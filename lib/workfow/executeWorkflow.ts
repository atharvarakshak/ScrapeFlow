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

  const environment:Environment = {
    phases: {},
  };

  // initialize workflow execution

  await initializeWorkflowExecution(executionId, execution.workflowId);

  // initialize phases execution
  await initializePhaseStatuses(execution);

  let creditsConsumed = 0;

  let executionFailed = false;
  for (const phase of execution.phases) {
    await waitFor(3000);
    // credits consumed

    //execute phase
    const phaseExecution = await executeWorkflowPhase(phase, environment);
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

async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  setupEnvironmentForPhase(node, environment);

  // update phase status

  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs:JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  console.log(`executing phase ${phase.name} with credits ${creditsRequired}`);

  // TODO: DECREMENT CREDITS

  const success = await executePhase(node, phase, environment);

  await finalizePhase(phase.id, success);
  return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
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
    },
  });
}

async function executePhase(
  node: AppNode,
  phase: ExecutionPhase,
  environment: Environment
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    return false;
  }

  const executionEnvironemnt: ExecutionEnvironment<any> = createExecutionenvironment(node, environment);
  return await runFn(executionEnvironemnt);
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };

  const inputs = TaskRegistry[node.data.type].inputs;

  for(const input of inputs) {

    if(input.type === TaskParamType.BROWSER_INSTANCE)continue;

    const inputValue = node.data.inputs[input.name];

    if(inputValue){
        environment.phases[node.id].inputs[input.name] = inputValue;
        continue;

    }
    // get input value from outputs in environment


  }

  const inputsDefiniton = TaskRegistry[node.data.type].inputs;
}   

function createExecutionenvironment(node: AppNode, environment: Environment) : ExecutionEnvironment<any> {
  return {
    getInput: (name: string) =>  environment.phases[node.id]?.inputs[name],
    getBrowser:()=>environment.browser,
    setBrowser:(browser: Browser)=>(environment.browser = browser),
    getPage:()=>environment.page,
    setPage:(page: Page)=>(environment.page = page),    
  };
}