'use client'

import { ReactNode } from "react";

export function NodeOutputs({children}:{children: ReactNode}){
return <div className="flex flex-col divide-y gap-1">
    {children}
</div>
}