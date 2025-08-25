"use client";

import classNames from "classnames";
import { SunIcon, MoonIcon, AlignJustify, X } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { useSolvBtcStore } from "@/states";
import { WalletConnector } from "@/components/WalletConnector";

import AppLogoLight from "@/assets/images/app-logo-light.svg";
import AppLogoDark from "@/assets/images/app-logo-dark.svg";
import solvLogoDark from "@/assets/images/solv-logo-dark.svg";
import solvLogoLight from "@/assets/images/solv-logo-light.svg";

import MeunPc from "./components/MeunPc";

export interface MenuItem {
  label: string;
  href: string;
  activeHref: string[];
}

export const menuList: MenuItem[] = [
  { label: "SolvBTC", href: "/solvbtc", activeHref: ["/", "/solvbtc"] },
  { label: "SolvBTC_JUP", href: "/solvbtc-jup", activeHref: ["/solvbtc-jup"] },
  { label: "My portfolio", href: "/portfolio", activeHref: ["/portfolio"] },
];

const Header = ({ className }: { className?: string }) => {
  const { navOpen, setNavOpen } = useSolvBtcStore();
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={classNames(
        className,
        "fixed top-0 left-0 right-0 w-full z-50 h-[4.75rem] flex items-center px-4 lg:h-[6.5rem] overflow-hidden lg:bg-transparent backdrop-blur-md  lg:backdrop-blur-none"
      )}
    >
      <header className="flex items-center justify-between w-full lg:h-[4.5rem] ">
        <div
          className="lg:flex items-center h-[2.75rem] rounded-full box-border px-[.75rem] hidden"
          onClick={() => {
            window.open("https://solv.finance", "_blank");
          }}
        >
          <div className="hidden lg:flex">
            <Image
              src={theme === "dark" ? AppLogoLight : AppLogoDark}
              alt="logo"
              width={108}
              height={33}
              className="cursor-pointer lg:scale-100"
            ></Image>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Image
            src={theme === "dark" ? solvLogoLight : solvLogoDark}
            width={25}
            height={31}
            alt="Solv Logo"
            onClick={() => {
              window.open("https://solv.finance", "_blank");
            }}
          />

          <div className="cursor-pointer" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <AlignJustify className="w-5 h-5" />
            )}
          </div>
        </div>

        <MeunPc menuList={menuList} />

        <div className="flex items-center gap-[1rem]">
          <WalletConnector />

          <div className="flex items-center justify-center">
            <div
              className="cursor-pointer border border-solid rounded-full p-[.375rem] border-border bg-gray-400/10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme == "dark" ? (
                <SunIcon width={24} height={24} color="#fff" />
              ) : (
                <MoonIcon width={24} height={24} color="black" />
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
