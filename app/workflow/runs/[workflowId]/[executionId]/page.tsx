import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { waitFor } from "@/lib/helper/waitFor";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

function page({
  params,
}: {
  params: {
    workflowId: string;
    executionId: string;
  };
}) {
  return (
    
    <div className="flex  flex-col w-full h-screen overflow-hidden ">
      <Topbar
        workflowId={params.workflowId}
        title="Workflow Run Details"
        subtitle={`Run ID: ${params.executionId}`}
        hideButtons
      />
      <section className="h-full flex overflow-auto">
        <Suspense fallback={<div className="flex w-full  items-center justify-center">
          <Loader2Icon size={32} className="h-10 w-10 animate-spin stroke-primary " />
        </div>}>
          <ExecutionViewrWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
}

export default page;

async function ExecutionViewrWrapper({ executionId }: { executionId: string }) {

  const {userId} = auth();

  if(!userId){
    throw new Error("unauthenticated");
  }

  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

  if(!workflowExecution){
    return <div >Execution not found</div>
  }


  return <>
    <ExecutionViewer/>
  </>

}