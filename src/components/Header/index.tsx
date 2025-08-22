"use client";

import classNames from "classnames";
import { SunIcon, MoonIcon, HamburgerIcon, CrossIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { useSolvBtcStore } from "@/states";
import solvLogoDark from "@/assets/images/solv-logo-dark.svg";
import solvLogoLight from "@/assets/images/solv-logo-light.svg";

const Header = ({ className }: { className?: string }) => {
  const { navOpen, setNavOpen } = useSolvBtcStore();

  const { theme, setTheme } = useTheme();

  return (
    <div
      className={classNames(
        className,
        "fixed top-0 left-0 right-0 w-full z-50 h-[3.125rem] flex items-center px-4 md:h-[6.5rem]"
        // {
        //   "bg-black border-gray-800": mode === "dark",
        //   "bg-white border-gray-200": mode === "light",
        // }
      )}
    >
      <header className="flex items-center justify-between w-full h-[4.5rem]">
        <div className="flex items-center gap-4 md:hidden">
          <Image
            src={theme === "dark" ? solvLogoLight : solvLogoDark}
            width={25}
            height={31}
            alt="Solv Logo"
          />

          <div className="cursor-pointer" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? (
              <CrossIcon className="w-5 h-5" />
            ) : (
              <HamburgerIcon className="w-5 h-5" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="cursor-pointer border border-solid border-gray-500 rounded-full p-1"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme == "dark" ? (
              <SunIcon width={18} height={18} color="#fff" />
            ) : (
              <MoonIcon width={18} height={18} color="black" />
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
