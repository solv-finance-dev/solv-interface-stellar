import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MenuItem } from "..";

export default function MeunPc({ menuList }: { menuList: MenuItem[] }) {
  const pathname = usePathname();

  return (
    <section className="m-auto  h-[44px] cursor-pointer items-center rounded-full border border-solid border-border p-1 font-[500] backdrop-blur-[5px] hover:border-[#767676] bg-gray-400/10 text-textColor lg:flex hidden">
      {menuList.map((item) => (
        <div
          className="flex px-[2rem] items-center justify-center font-MatterSQ-Medium text-[0.875rem] cursor-pointer"
          key={item.label}
        >
          <Link
            href={item.href}
            className={
              item.activeHref.includes(pathname)
                ? "!text-textActiveColor"
                : "text-textColor"
            }
          >
            {item.label}
          </Link>
        </div>
      ))}
    </section>
  );
}
