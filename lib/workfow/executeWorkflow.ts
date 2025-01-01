import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";

export async function ExecuteWorkflow(executionId: string) {
    
    const execution = await prisma.workflowExecution.findUnique({
        where:{
            id: executionId
        },
        include:{
            workflow:true,
            phases:true
        }
    })
        if(!execution){
            throw new Error("Execution not found");
        }

        const environment = {
            phases:{
                
            }
        }
        // initialize workflow execution
        // initialize phases execution

        let executionFailed = false;
        for(const phase of execution.phases){
           //execute phase

        }
        // finalize execution 
        // clean up environment

        revalidatePath(`/workflow/runs`);

}