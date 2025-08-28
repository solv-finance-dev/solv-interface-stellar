'use client';

import { ReactNode } from 'react';

const BodyProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div className='mx-auto max-w-[1200px] pt-[5.75rem] lg:pt-[6.5rem]'>
      {children}
    </div>
  );
};

export default BodyProvider;
