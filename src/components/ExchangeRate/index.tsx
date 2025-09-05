import React, { ReactNode } from 'react';

export default function ExchangeRate({
  title = ' Exchange Rate',
  value,
}: {
  title?: string | ReactNode;
  value?: string | ReactNode;
}) {
  return (
    <div className='flex w-full flex-row items-center justify-between rounded-md text-[.875rem] md:justify-end md:gap-2 md:py-1'>
      <span className='text-textColor-tertiary'>{title}</span>
      <span className='text-textColor'>{value}</span>
    </div>
  );
}
