import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  FileTextIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
} from "lucide-react";
import Link from "next/link";
import { WorkflowActions } from "./workflowActions";
import RunBtn from "./RunBtn";
import ScheduleDialog from "./SchedulerDialog";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Badge } from "@/components/ui/badge";
import SchedulerDialog from "./SchedulerDialog";
import ExecutionStatusIndicator, { ExecutionStatusLabel } from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { format, formatDistanceToNow } from "date-fns";
import {formatInTimeZone} from "date-fns-tz"
import DuplicateWorkflowsDialog from "./DuplicateWorkflowsDialog";

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-pink-400 text-pink-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary text-pink-600",
};
function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card
      className="border border-separate shadow-sm rounded-lg overflow-hidden
        hover:shadow-md dark:shadow-primary/30 group/card"
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
              <TooltipWrapper content={workflow.description}>

              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
                >
                {workflow.name}
              </Link>
              </TooltipWrapper>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-pink-100 text-pink-800 rounded-full">
                  Draft
                </span>
              )}
              <DuplicateWorkflowsDialog workflowId={workflow.id} />
            </h3>
            <ScheduleSection
              isDraft={isDraft}
              CreditsCosts={workflow.creditsCost}
              workflowId={workflow.id}
              cron={workflow.cron}
            />
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
      <LastRunDetails workflow={workflow} />
    </Card>
  );
}

function ScheduleSection({
  isDraft,
  CreditsCosts,
  workflowId,
  cron,
}: {
  isDraft: boolean;
  CreditsCosts: number;
  workflowId: string;
  cron: string | null;
}) {
  if (isDraft) {
    return null;
  }
  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="h-4 w-4 text-muted-foreground" />
      <SchedulerDialog
        workflowId={workflowId}
        cron={cron!}
        key={`${cron}-${workflowId}`}
      />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="space-x-2 text-muted-foreground rounded-sm "
          >
            <CoinsIcon className=" h-4 w-4 " />
            <span className="text-sm">{CreditsCosts}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {

  const isDraft = workflow.status === WorkflowStatus.DRAFT

  if(isDraft)return null;

  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });

    const nextScheduleAt =  nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm")
    const nextScheduleUTC = nextRunAt && formatInTimeZone(nextRunAt,"IST","HH:mm")
  return (
    <div className="bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground ">
      <div className="flex items-center text-sm">
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="flex items-center text-sm gap-2 group"
          >
            <span>Lats run</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLabel
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="group-hover:translate-x-0 -translate-x-[2px] transition"
            />
          </Link>
        )}
        {!lastRunAt && <p>No runs yet</p> }
      </div>
      {nextRunAt && (
        <div className="flex items-center text-sm gap-2">
          <ClockIcon size={12} />
          <span>Next run at: </span>
          <span>{nextScheduleAt}</span>
          <span  className="text-xs">({nextScheduleUTC} IST)</span>
        </div>
      )}
    </div>
  );
}
export default WorkflowCard;
