"use client";
import useExecutionPlan from '@/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { DownloadIcon, PlayIcon, UploadIcon } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PublishWorkflow } from '@/actions/workflows/publishWorkflow';
import { UnpublishWorkflow } from '@/actions/workflows/unpublishWorkflow';


export default  function UnPublishBtn({workflowId}:{workflowId:string}) {
const generate = useExecutionPlan()
const {toObject} = useReactFlow();

const mutation = useMutation({
  mutationFn:UnpublishWorkflow,
  onSuccess:()=>{
    toast.success("Workflow UnPublished.",{id:workflowId})
  },
  onError:()=>{
    toast.error("Something went wrong",{id:workflowId})
  }
})
  return (
    <Button
     variant={'outline'}
    className='flex items-center gap-2'
    disabled={mutation.isPending}
    onClick={()=>{
    
      toast.loading("UnPublishing workflow...",{id:workflowId})
      mutation.mutate(workflowId);
      
 
    }}>
        <DownloadIcon size={16} className='stroke-red-400'/>
    UnPublish
    </Button>
  )
}
