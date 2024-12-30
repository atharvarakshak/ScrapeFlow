import React, { ReactNode } from 'react'

const NodeInputs = ({children}:{children:ReactNode}) => {
  return (
    <div className='flex flex-col divide-y gap-2'>
        {children}
    </div>
  )
}

export default NodeInputs