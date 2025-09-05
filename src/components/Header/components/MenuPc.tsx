import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { MenuItem } from '..';
import cn from 'classnames';

export default function MenuPc({ menuList }: { menuList: MenuItem[] }) {
  const pathname = usePathname();

  return (
    <section
      className={cn(
        'bg-base-neutral-600/10 border-base-neutral-300 dark:border-base-neutral-800',
        'm-auto hidden h-[44px] cursor-pointer items-center rounded-full border border-solid p-1 font-[500] backdrop-blur-[5px] md:flex'
      )}
    >
      {menuList.map(item => (
        <div
          className='flex cursor-pointer items-center justify-center font-MatterSQ-Medium text-[0.875rem] md:px-[.8rem] lg:px-[2rem]'
          key={item.label}
        >
          <Link
            href={item.href}
            className={cn(
              'hover:text-textColor',
              item?.activeHref && item?.activeHref.includes(pathname)
                ? '!text-textColor'
                : 'text-textColor-secondary'
            )}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </section>
  );
}
