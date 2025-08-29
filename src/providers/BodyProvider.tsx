'use client';

import { ReactNode } from 'react';
import { Toaster } from '@solvprotocol/ui-v2';
import { GlobalDialog } from '@/components/Dialog';

const BodyProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div className='mx-auto max-w-[1200px] pt-[5.75rem] lg:pt-[6.5rem]'>
      {children}

      <GlobalDialog />
      <Toaster />
    </div>
  );
};

export default BodyProvider;
