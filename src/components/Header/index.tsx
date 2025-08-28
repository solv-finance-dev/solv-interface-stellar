'use client';

import classNames from 'classnames';
import { SunIcon, MoonIcon, AlignJustify, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import { useSolvBtcStore } from '@/states';
import { WalletConnector } from '@/components/WalletConnector';

import AppLogoLight from '@/assets/images/app-logo-light.svg';
import AppLogoDark from '@/assets/images/app-logo-dark.svg';
import solvLogoDark from '@/assets/images/solv-logo-dark.svg';
import solvLogoLight from '@/assets/images/solv-logo-light.svg';

import MeunPc from './components/MeunPc';

export interface MenuItem {
  label: string;
  href: string;
  activeHref: string[];
}

export const menuList: MenuItem[] = [
  { label: 'SolvBTC', href: '/solvbtc', activeHref: ['/', '/solvbtc'] },
  {
    label: 'SolvBTC_JUP',
    href: '/solvbtc-jupiter',
    activeHref: ['/solvbtc-jupiter'],
  },
  { label: 'My portfolio', href: '/portfolio', activeHref: ['/portfolio'] },
];

const Header = ({ className }: { className?: string }) => {
  const { navOpen, setNavOpen } = useSolvBtcStore();
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={classNames(
        className,
        'fixed left-0 right-0 top-0 z-50 flex h-[4.75rem] w-full items-center overflow-hidden px-4 backdrop-blur-md lg:h-[6.5rem] lg:bg-transparent lg:backdrop-blur-none'
      )}
    >
      <header className='flex w-full items-center justify-between lg:h-[4.5rem]'>
        <div
          className='box-border hidden h-[2.75rem] items-center rounded-full px-[.75rem] lg:flex'
          onClick={() => {
            window.open('https://solv.finance', '_blank');
          }}
        >
          <div className='hidden lg:flex'>
            <Image
              src={theme === 'dark' ? AppLogoLight : AppLogoDark}
              alt='logo'
              width={108}
              height={33}
              className='cursor-pointer lg:scale-100'
            ></Image>
          </div>
        </div>

        <div className='flex items-center gap-3 lg:hidden'>
          <Image
            src={theme === 'dark' ? solvLogoLight : solvLogoDark}
            width={25}
            height={31}
            alt='Solv Logo'
            onClick={() => {
              window.open('https://solv.finance', '_blank');
            }}
          />

          <div className='cursor-pointer' onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <AlignJustify className='h-5 w-5' />
            )}
          </div>
        </div>

        <MeunPc menuList={menuList} />

        <div className='flex items-center gap-2 lg:gap-4'>
          <WalletConnector />

          <div className='flex items-center justify-center'>
            <div
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-solid border-border bg-gray-400/10 lg:h-[2.75rem] lg:w-[2.75rem] lg:p-[.375rem]'
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme == 'dark' ? (
                <SunIcon className='h-[1.125rem] w-[1.125rem] text-textColor lg:h-[1.5rem] lg:w-[1.5rem]' />
              ) : (
                <MoonIcon className='h-[1.125rem] w-[1.125rem] text-textColor lg:h-[1.5rem] lg:w-[1.5rem]' />
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
