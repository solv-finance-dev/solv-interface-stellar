import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { MenuItem } from '..';
import cn from 'classnames';
import { useMenuStore } from '@/states/menu';

const MenuH5 = ({ menuList }: { menuList: MenuItem[] }) => {
  const router = useRouter();

  const { setMenuH5Open } = useMenuStore();
  const { theme } = useTheme();
  const pathname = usePathname();

  const handleNavClick = async (href: string) => {
    router.push(href);
    setTimeout(() => {
      setMenuH5Open(false);
    }, 300);
  };

  return (
    <div
      className={cn(
        'top-[4.75rem]',
        'fixed inset-0 z-50 box-border flex h-screen w-screen p-4 backdrop-blur-sm md:hidden',

        {
          'bg-black': theme === 'dark',
          'bg-white': theme === 'light',
        }
      )}
    >
      <div className='flex w-full flex-col items-start space-y-2'>
        {menuList.map(item => (
          <div
            className={cn(
              'flex w-full cursor-pointer items-center justify-start font-MatterSQ-Medium text-[0.875rem]',
              'cursor-pointer rounded-[6px] px-4 py-2',

              item?.activeHref && item?.activeHref.includes(pathname)
                ? theme === 'dark'
                  ? 'bg-[#161616]'
                  : 'bg-gray-50'
                : 'bg-transparent'
            )}
            key={item.label}
          >
            <div
              className={
                item?.activeHref && item?.activeHref.includes(pathname)
                  ? '!text-textActiveColor'
                  : 'text-textColor'
              }
              onClick={() => handleNavClick(item.href)}
            >
              <div className='relative font-MatterSQ-Medium text-base'>
                {item.label}
                {item.new ? item.new : null}
              </div>
              <div className='w-2/3 font-MatterSQ-Regular text-xs'>
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuH5;
