import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { exec } from "child_process";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";
import { auth } from "@clerk/nextjs/server";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });
  if (!execution) {
    throw new Error("Execution not found");
  }

  const edges = JSON.parse(execution.definition).edges as Edge[];

  const environment: Environment = {
    phases: {},
  };

  // initialize workflow execution

  await initializeWorkflowExecution(executionId, execution.workflowId);

  // initialize phases execution
  await initializePhaseStatuses(execution);

  let creditsConsumed = 0;

  let executionFailed = false;
  for (const phase of execution.phases) {
    // credits consumed



    //execute phase
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges,
      execution.userId
    );

    creditsConsumed = creditsConsumed +   phaseExecution.creditsConsumed;
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }
  // finalize execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  // clean up environment

  await cleanupEnvironment(environment);

  revalidatePath(`/workflow/runs`);
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  //initialize workflow execution

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

async function initializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((e) => {
      //  ignore
    });
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[],
  userId:string
) {
  const logCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  setupEnvironmentForPhase(node, environment, edges);

  // update phase status

  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  // console.log(`executing phase ${phase.name} with credits ${creditsRequired}`);

 
  // TODO: DECREMENT CREDITS
    let success = await decrementCredits(userId,creditsRequired,logCollector);
    const creditsConsumed = success ? creditsRequired:0;
    if(success){
      // we can execute the phase if credits are sufficient
       success = await executePhase(node, phase, environment, logCollector);
    }
  const outputs = environment.phases[node.id].outputs;

  await finalizePhase(phase.id, success, outputs, logCollector,creditsConsumed);
  return { success,creditsConsumed };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
  creditsConsumed:number
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            logLevel: log.level,
            message: log.message,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
}

async function executePhase(
  node: AppNode,
  phase: ExecutionPhase,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    logCollector.error(`not found executor for ${node.data.type}`);
    return false;
  }

  const executionEnvironemnt: ExecutionEnvironment<any> =
    createExecutionenvironment(node, environment, logCollector);
  return await runFn(executionEnvironemnt);
}

function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };

  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;

    const inputValue = node.data.inputs[input.name];

    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
    // get input value from outputs in environment

    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.error("No connected edge found for input", input.name);
    }

    const outputValue =
      environment.phases[connectedEdge?.source!].outputs[
        connectedEdge?.sourceHandle!
      ];

    environment.phases[node.id].inputs[input.name] = outputValue;
  }

  const inputsDefiniton = TaskRegistry[node.data.type].inputs;
}

function createExecutionenvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) =>
      (environment.phases[node.id].outputs[name] = value),
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),
    log: logCollector,
  };
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((err) => console.error("cannot close browser", err));
  }
}

async function decrementCredits(userId: string, amount: number,logCollector:LogCollector) {
  try {
    await prisma.userBalance.update({
      where: {
        userId,
        credits: { gte: amount },
      },
      data: {
        credits: { decrement: amount },
      },
    });
    return true;
  }
  catch(e){
    
    logCollector.error("insufficient balance");
    return false;
  }
}
