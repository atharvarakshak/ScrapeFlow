"use server";

import prisma from "@/lib/prisma";
import { FLowToExecutionPlan } from "@/lib/workfow/executionPlan";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow(form:{
    workflowId:string;
    flowDefinition?:string

}) {

    const {userId} = auth();
    if(!userId){
        throw new Error("unauthenticated");
    }

    const {workflowId, flowDefinition} = form;

    if(!workflowId){
        throw new Error("workflowId is required");
    }

    const workflow = await prisma.workflow.findUnique({
        where:{
            userId,
            id:workflowId
        }
    });

    if(!workflow){
        throw new Error("workflow not found");
    }

    let executionPlan: WorkflowExecutionPlan;

    if(!flowDefinition){
        throw new Error("flowDefinition not defined");
    }

    const flow = JSON.parse(flowDefinition);

    const result = FLowToExecutionPlan(flow.nodes, flow.edges);
    if(result.error){
        throw new Error("Invalid flow definition");
    }

    if(!result.executionPlan){
        throw new Error("Failed to generate execution plan");
    }

    executionPlan = result.executionPlan;


}