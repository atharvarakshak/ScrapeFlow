"use server";

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workfow/executeWorkflow";
import { FLowToExecutionPlan } from "@/lib/workfow/executionPlan";
import { TaskRegistry } from "@/lib/workfow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { stat } from "fs";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const { workflowId, flowDefinition } = form;

  if (!workflowId) {
    throw new Error("workflowId is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) {
    throw new Error("workflow not found");
  }

  let executionPlan: WorkflowExecutionPlan;

  if (!flowDefinition) {
    throw new Error("flowDefinition not defined");
  }

  const flow = JSON.parse(flowDefinition);

  const result = FLowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("Invalid flow definition");
  }

  if (!result.executionPlan) {
    throw new Error("Failed to generate execution plan");
  }

  executionPlan = result.executionPlan;

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition:flowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });
  if(!execution){
    throw new Error("Workflow execution not created");
  }

  ExecuteWorkflow(execution.id);//run in background
  redirect(`/workflow/runs/${workflowId}/${execution.id}`);

}
