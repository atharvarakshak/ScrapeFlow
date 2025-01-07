"use client";

import { RunWorkflow } from '@/actions/workflows/runWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';

function RunBtn({workflowId}:{workflowId:string}) {
    const mutation = useMutation({
        mutationFn: RunWorkflow,
        onSuccess:()=>{
            toast.success("Workflow Running.",{id:workflowId})
        },
        onError:()=>{
            toast.error("Workflow Running.",{id:workflowId})
        },
    })
  return (
    <Button variant={'outline'} className='flex items-center gap-2' disabled={mutation.isPending} size={'sm'}
    onClick={()=>{
        toast.loading("Running workflow...",{id:workflowId})
        mutation.mutate({workflowId});
    }}
    >
        <PlayIcon size={16} className='' />
        Run
    </Button>
  )
}

export default RunBtn
