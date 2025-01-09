import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { waitFor } from "@/lib/helper/waitFor";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionTable from "./_components/ExecutionTable";

export default function ExecutionPage({
  params,
}: {
  params: { workflowId: string };
}) {
  return (
    <div className="w-full h-full overflow-auto ">
      <Topbar
        hideButtons
        title="All runs"
        subtitle="List of all your workflow runs"
        workflowId={params.workflowId}
      />
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center">

        <Loader2Icon size={30} className="animate-spin stroke-primary"/>
        </div>
      }>
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
 
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) {
    <div>No data</div>
  }
  if(executions.length === 0){
    return <div className="py-6 ">
        <div className="flex flex-col gap-2 items-center justify-center h-full w-full">
            <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                <InboxIcon size={40} className="stroke-primary"/>
            </div>
            <div className="flex flex-col gap-1 text-center">
                <p className="font-bold ">No runs have been triggered</p>
                <p className="text-sm text-muted-foreground ">you can trigger new runs in editor</p>
            </div>
        </div>
    </div>
  }

  return(

    <div className="py-6 container w-full">
    
    <ExecutionTable workflowId={workflowId} initialData={executions}/>;
  </div>
  )
}
