'use client';

import { Card } from '@solvprotocol/ui-v2';
import cn from 'classnames';
import { ReactNode } from 'react';

interface BannerProps {
  title?: string;
  subTitle?: string;
  description?: string;
  slot?: string | ReactNode;
  showBg?: boolean;
  className?: string;
}

const Banner = ({
  title = '',
  subTitle = '',
  description = '',
  slot = '',
  showBg = false,
  className = '',
}: BannerProps) => {
  return (
    <Card
      className={cn(
        'mb-4 box-border !p-4 md:mb-8 md:!p-8',
        showBg
          ? "bg-[url('../../assets/images/solvbtc-banner-bg-h5.svg')] bg-contain bg-right-top bg-no-repeat lg:bg-[url('../../assets/images/solvbtc-banner-bg.svg')]"
          : '',
        className
      )}
    >
      <div className=''>
        <div className='text-textColor mb-4 flex flex-col text-[4rem] leading-[4rem] md:flex-row md:items-end'>
          {title}

          {subTitle && (
            <span className='text-textColor-tertiary text-[2.5rem] leading-[3rem] md:ml-4'>
              {subTitle}
            </span>
          )}
        </div>
        {description && (
          <div
            className={cn(
              'text-textColor',
              slot
                ? 'text-[1.125rem] leading-[1.5rem]'
                : 'text-[1.25rem] leading-[1.75rem]'
            )}
          >
            {description}
          </div>
        )}

        {slot && (
          <div className='mt-4 font-MatterSQ-Medium text-[1.25rem] leading-[1.4375rem]'>
            {slot}
          </div>
        )}
      </div>
    </Card>
  );
};
export default Banner;
