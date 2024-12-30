import { cn } from '@/lib/utils';
import {  SquareMousePointer } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

function Logo({
  fontSize = 'text-2xl',
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      href="/"
      className={cn(
        'text-2xl font-extrabold flex items-center justify-center gap-2 ',
        fontSize
      )}
    >
  

      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-2 flex items-center justify-center">
        <SquareMousePointer size={iconSize} className="stroke-white" />
      </div>
      <div>
        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Scrape
        </span>
        <span className="bg-gradient-to-r from-stone-600 to-stone-800 bg-clip-text text-transparent">
          Flow
        </span>
      </div>
  
    </Link>
  );
}

export default Logo;
