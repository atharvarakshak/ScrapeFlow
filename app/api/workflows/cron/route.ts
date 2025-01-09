import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { Trigger } from "@radix-ui/react-dialog";

export async function GET(req: Request) {
  const now = new Date();
  const workflows = await prisma.workflow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  });
  console.log("Workflow to run", workflows.length);
  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return new Response(null, { status: 200 });
}

function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  );

  fetch(triggerApiUrl, {
    headers:{
        Authorization: `Bearer ${process.env.API_SECRET!}`
    },
    cache: "no-store",

  }).catch(e=>{

      console.error("Error fetching api url:",e);
    })

  console.log("url: ", triggerApiUrl);
}
