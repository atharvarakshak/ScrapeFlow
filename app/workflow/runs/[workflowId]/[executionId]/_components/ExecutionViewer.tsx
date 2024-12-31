"use client";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type ExecutionType = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;
function ExecutionViewer() {

  return <div>Execution</div>;
}

export default ExecutionViewer;
