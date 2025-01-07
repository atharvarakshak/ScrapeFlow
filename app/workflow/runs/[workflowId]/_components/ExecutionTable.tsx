"use client";

import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

function ExecutionTable({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: InitialDataType;
}) {
  const query = useQuery({
    queryKey: ["executions", workflowId],
    initialData,
    queryFn: () => GetWorkflowExecutions(workflowId),
    refetchInterval: 5000,
  });
  return (
    <div className="border rounded-lg shadow-md overflow-auto ">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Started At
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full overflow-auto">
          {query.data.map((execution) => {
            const duration = DatesToDurationString(
              execution.completedAt,
              execution.startedAt
            );

            return (
              <TableRow key={execution.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{execution.id}</span>
                    <div className="text-muted-foreground text-xs ">
                      <span>Triggered Via</span>
                      <Badge variant={"outline"}>{execution.trigger}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    {/* watch TS: 8:50 to 9:10 for styling page */}
                  <div>
                    <div>{execution.status}</div>
                    <div>{duration}</div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default ExecutionTable;
