import React, { ReactNode } from 'react';

export default function c({
  label,
  value,
  url,
}: {
  label?: string | ReactNode;
  value?: string | ReactNode;
  url?: string;
}) {
  return (
    <div className='flex flex-col text-sm'>
      <span className='text-textColor-tertiary mb-1'>{label}</span>

      <span>
        <a
          href={url}
          className='text-textColor underline hover:text-brand'
          target='_blank'
          rel='noreferrer'
        >
          {value}
        </a>
      </span>
    </div>
  );
}
