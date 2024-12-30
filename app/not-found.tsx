import Link from 'next/link'
import React from 'react'

function NotFoundPage() {
  return (
    <div className='flex items-center justify-center h-screen min-h-screen p-6'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-primary mb-4 '>404</h1>
        <h1 className='text-2xl font-semibold mb-4 '>Page Not found</h1>

        <div className='flex flex-col sm:flex-row justify-center gap-4 '>
            <Link href={"/"} className='flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors '>Go to Home</Link>
        </div>

      </div>
    </div>
  )
}

export default NotFoundPage
