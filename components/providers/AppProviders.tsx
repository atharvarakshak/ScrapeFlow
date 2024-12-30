"use client"

import { ThemeProvider } from 'next-themes'
import React, { useState } from 'react'
import { Query, QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function AppProviders({children}:{children:React.ReactNode}) {
    const [queryClinet] = useState(()=>new QueryClient());
  return (
    <QueryClientProvider client={queryClinet}>
    <ThemeProvider attribute="class" defaultTheme='system' enableSystem>
        {children}
    </ThemeProvider>
    <ReactQueryDevtools/>
    </QueryClientProvider>
  )
}

export default AppProviders


