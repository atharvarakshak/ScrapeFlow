import { cn } from '@/lib/utils'
import { WorkflowExecutionStatus } from '@/types/workflow'
import React from 'react'


const indicatorColors : Record<WorkflowExecutionStatus,string>={
    PENDING:"bg-slate-400",
    RUNNING:"bg-yellow-400",
    FAILED: "bg-red-400",
    COMPLETED : "bg-emerald-400"
}
function ExecutionStatusIndicator({status}:{
    status:WorkflowExecutionStatus
}) {
    return (
    <div className={cn("h-2 w-2 rounded-full bg-red-500",indicatorColors[status])}/>
    
    
  )
}


const labelColors : Record<WorkflowExecutionStatus,string>={
    PENDING:"text-slate-400",
    RUNNING:"text-yellow-400",
    FAILED: "text-red-400",
    COMPLETED : "text-emerald-400"
}
export function ExecutionStatusLabel({status}:{status:WorkflowExecutionStatus}){
    return <span className={cn("lowercase",labelColors[status])}>{status}</span>
}   

export default ExecutionStatusIndicator
