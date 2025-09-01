import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { MenuItem } from '..';

export default function MeunPc({ menuList }: { menuList: MenuItem[] }) {
  const pathname = usePathname();

  return (
    <section className='m-auto hidden h-[44px] cursor-pointer items-center rounded-full border border-solid border-border bg-gray-400/10 p-1 font-[500] text-textColor backdrop-blur-[5px] hover:border-[#767676] md:flex'>
      {menuList.map(item => (
        <div
          className='flex cursor-pointer items-center justify-center px-[2rem] font-MatterSQ-Medium text-[0.875rem]'
          key={item.label}
        >
          <Link
            href={item.href}
            className={
              item?.activeHref && item?.activeHref.includes(pathname)
                ? '!text-textActiveColor'
                : 'text-textColor'
            }
          >
            {item.label}
          </Link>
        </div>
      ))}
    </section>
  );
}
