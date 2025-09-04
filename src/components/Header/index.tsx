'use client';

import classNames from 'classnames';
import { SunIcon, MoonIcon, AlignJustify, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import { WalletConnector } from '@/components/WalletConnector';

import AppLogoLight from '@/assets/images/app-logo-light.svg';
import AppLogoDark from '@/assets/images/app-logo-dark.svg';
import solvLogoDark from '@/assets/images/solv-logo-dark.svg';
import solvLogoLight from '@/assets/images/solv-logo-light.svg';

import MeunPc from './components/MenuPc';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useMenuStore } from '@/states/menu';
import MenuH5 from './components/MenuH5';

export interface MenuItem {
  label: string;
  href: string;
  activeHref?: string[];
  new?: React.ReactNode;
  description?: string;
}

export const menuList: MenuItem[] = [
  {
    label: 'SolvBTC',
    href: '/solvbtc',
    activeHref: ['/', '/solvbtc'],
    description:
      'A universal liquid Bitcoin backed 1:1 by BTC used across CeDeFi.',
    // new: (
    //   <div className='absolute left-[60px] top-0 box-border flex h-[10px] w-[20px] items-center justify-center rounded-full bg-[#FD4040] text-[7px] capitalize text-white'>
    //     New
    //   </div>
    // ),
  },
  {
    label: 'SolvBTC_JUP',
    href: '/solvbtc-jupiter',
    activeHref: ['/solvbtc-jupiter'],
  },
  {
    label: 'My portfolio',
    href: '/portfolio',
    activeHref: ['/portfolio'],
    description:
      'Track all your BTC-based assets, positions and strategies in one unified dashboard.',
  },
];

const Header = ({ className }: { className?: string }) => {
  const { menuH5Open, setMenuH5Open } = useMenuStore();
  const { theme, setTheme } = useTheme();
  useLockBodyScroll(menuH5Open);

  return (
    <>
      <div
        className={classNames(
          className,
          'fixed left-0 right-0 top-0 z-50 flex h-[4.75rem] w-full items-center overflow-hidden px-4 backdrop-blur-md md:h-[6.5rem] md:bg-transparent md:backdrop-blur-none'
        )}
      >
        <header className='relative flex w-full items-center justify-between md:h-[4.5rem]'>
          <div
            className='box-border hidden h-[2.75rem] items-center rounded-full px-[.75rem] md:flex'
            onClick={() => {
              window.open('https://solv.finance', '_blank');
            }}
          >
            <div className='hidden md:flex'>
              <Image
                src={theme === 'dark' ? AppLogoLight : AppLogoDark}
                alt='logo'
                width={108}
                height={33}
                className='cursor-pointer md:scale-100'
              ></Image>
            </div>
          </div>

          <div className='flex items-center gap-3 md:hidden'>
            <Image
              src={theme === 'dark' ? solvLogoLight : solvLogoDark}
              width={25}
              height={31}
              alt='Solv Logo'
              onClick={() => {
                window.open('https://solv.finance', '_blank');
              }}
            />

            <div
              className='cursor-pointer'
              onClick={() => setMenuH5Open(!menuH5Open)}
            >
              {menuH5Open ? (
                <X className='h-5 w-5' />
              ) : (
                <AlignJustify className='h-5 w-5' />
              )}
            </div>
          </div>

          <MeunPc menuList={menuList} />

          <div className='flex items-center gap-2 md:gap-4'>
            <WalletConnector />

            <div className='flex items-center justify-center'>
              <div
                className='bg-base-neutral-600/10 border-base-neutral-300 dark:border-base-neutral-800 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-solid md:h-[2.75rem] md:w-[2.75rem] md:p-[.375rem]'
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme == 'dark' ? (
                  <SunIcon className='text-textColor-secondary h-[1.125rem] w-[1.125rem] md:h-[1.5rem] md:w-[1.5rem]' />
                ) : (
                  <MoonIcon className='text-textColor-secondary h-[1.125rem] w-[1.125rem] md:h-[1.5rem] md:w-[1.5rem]' />
                )}
              </div>
            </div>
          </div>
        </header>
      </div>

      {menuH5Open && <MenuH5 menuList={menuList} />}
    </>
  );
};

export default Header;
