import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import { FileTextIcon, PlayIcon, ShuffleIcon } from "lucide-react";
import Link from "next/link";
import { WorkflowActions } from "./workflowActions";
import RunBtn from "./RunBtn";

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-pink-400 text-pink-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary text-pink-600",
};
function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card
      className="border border-separate shadow-sm rounded-lg overflow-hidden
        hover:shadow-md dark:shadow-primary/30"
    >
      <CardContent className="p-4 flex items-center justify-between h-[100px] ">
        <div className="flex justify-end items-center space-x-3">
          <div  
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-pink-100 text-pink-800 rounded-full">
                  Draft
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunBtn workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}
export default WorkflowCard;
