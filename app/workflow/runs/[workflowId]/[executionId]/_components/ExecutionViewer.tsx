"use client";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  LucideIcon,
  Workflow,
} from "lucide-react";
import React, { ReactNode } from "react";

type ExecutionType = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;
function ExecutionViewer({ initialData }: { initialData: ExecutionType }) {
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  return (
    <div className="flex w-full h-full ">
      <aside className="w-[400px] min-w-[400px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
        <div className="py-4 px-2">
          {/* status label */}
          <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
              <CircleDashedIcon
                size={20}
                className="stroke-muted-foreground/80 "
              />
              <span>Status</span>
            </div>
            <div className="font-semibold capitalize gap-2 flex items-center">
              {query.data?.status}
            </div>
          </div>

          {/* status ddate */}
          <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2 ">
              <CalendarIcon size={20} className="stroke-muted-foreground/80 " />
              <span>Started At</span>
            </div>
            <div className="font-semibold lowercase gap-2 flex items-center">
              {query.data?.createdAt
                ? formatDistanceToNow(new Date(query.data?.createdAt), {
                    addSuffix: true,
                  })
                : "-"}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default ExecutionViewer;

function ExecutionLabel({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {

    return(
        <div className="flex justify-between items-center py-2 px-4 text-sm">
        <div className="text-muted-foreground flex items-center gap-2 ">
          <CalendarIcon size={20} className="stroke-muted-foreground/80 " />
          <span>{label}</span>
        </div>
        
      </div>
    )
}
