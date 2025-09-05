import classNames from 'classnames';
import { ReactNode } from 'react';

import noDataLightUrl from '@/assets/images/no-data-light.svg';
import noDataUrl from '@/assets/images/no-data.svg';
import { useTheme } from 'next-themes';
import { Skeleton } from '@solvprotocol/ui-v2';
import Image from 'next/image';

export function AssetsDataItem({
  keyTitle,
  value,
  className = '',
}: {
  keyTitle: string | ReactNode;
  value: string | ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames('flex min-h-[2.875rem] items-center', className)}
    >
      <div className='flex flex-col justify-between'>
        <div className='mb-[4px] text-[.75rem] leading-4 text-gray-600'>
          {keyTitle}
        </div>

        <div className='text-[.75rem] leading-4'>{value}</div>
      </div>
    </div>
  );
}

export function NoDataDom() {
  const { theme } = useTheme();

  return (
    <div className='flex justify-center pt-[2rem]'>
      <div>
        <Image
          alt='No data illustration'
          src={theme == 'dark' ? noDataUrl : noDataLightUrl}
          width={160}
          height={160}
          className='h-40 w-40'
        ></Image>
        <div className='text-center text-[1.2rem] text-textColor-tertiary'>
          <span>No results found</span>
        </div>
      </div>
    </div>
  );
}

export function AssetsSkeletonCard() {
  return (
    <>
      {[1, 2, 3].map(index => {
        return (
          <div key={index}>
            <div className='flex items-center justify-between rounded-[.25rem] px-[.25rem] py-[.375rem]'>
              <Skeleton className='mt-1 h-[1rem] w-full opacity-80' />
            </div>

            <div>
              <section className='grid grid-cols-2 gap-[.75rem] pt-[.75rem]'>
                <Skeleton className='mt-1 h-[1.5rem] w-full opacity-80' />
                <Skeleton className='mt-1 h-[1.5rem] w-full opacity-80' />
                <Skeleton className='mt-1 h-[1.5rem] w-full opacity-80' />
                <Skeleton className='mt-1 h-[1.5rem] w-full opacity-80' />
              </section>
              <footer className='mb-6 mt-4'>
                <Skeleton className='mt-1 h-[1.5rem] w-full opacity-80' />
              </footer>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function H5AssetsCard({
  cardTitle,
  children,
  operateBtn,
}: {
  cardTitle: ReactNode;
  children: ReactNode;
  operateBtn: ReactNode;
}) {
  return (
    <>
      <div className='flex items-center justify-between rounded-[.25rem] py-[.375rem] md:px-[.25rem]'>
        {cardTitle}
      </div>

      <div>
        <section className='grid grid-cols-2 gap-[.75rem] pt-[.75rem]'>
          {children}
        </section>
        <footer className='mb-6 mt-4'>{operateBtn}</footer>
      </div>
    </>
  );
}
