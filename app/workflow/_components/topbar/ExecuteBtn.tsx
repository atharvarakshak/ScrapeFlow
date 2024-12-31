"use client";
import useExecutionPlan from '@/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { RunWorkflow } from '@/actions/workflows/runWorkflow';
import { useReactFlow } from '@xyflow/react';


const ExecuteBtn = ({workflowId}:{workflowId:string}) => {
const generate = useExecutionPlan()
const {toObject} = useReactFlow();

const mutation = useMutation({
  mutationFn:RunWorkflow,
  onSuccess:()=>{
    toast.success("Execution started..",{id:"flow-execution"})
  },
  onError:()=>{
    toast.error("Something went wrong",{id:"flow-execution"})
  }
})
  return (
    <Button
     variant={'outline'}
    className='flex items-center gap-2'
    disabled={mutation.isPending}
    onClick={()=>{
      const plan = generate();
      
      if(!plan){
        // client validation
        toast.error("Invalid flow definition",{id:"flow-execution"})
        return;
      }

      mutation.mutate({
        workflowId: workflowId,
        flowDefinition:JSON.stringify(toObject())
      })
      
 
    }}>
        <PlayIcon size={16} className='stroke-orange-400'/>
    Execute
    </Button>
  )
}

export default ExecuteBtn