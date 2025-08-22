"use client";

import {
  SunIcon,
  MoonIcon,
  HamburgerMenuIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import classNames from "classnames";
import Image from "next/image";

import { useSolvBtcStore } from "@/states";
import solvLogoDark from "@/assets/images/solv-logo-dark.svg";
import solvLogoLight from "@/assets/images/solv-logo-light.svg";

const Header = ({ className }: { className?: string }) => {
  const { mode, setMode, navOpen, setNavOpen } = useSolvBtcStore();

  return (
    <div
      className={classNames(
        className,
        "fixed top-0 left-0 right-0 w-full z-50 h-[3.125rem] flex items-center px-4 md:h-[6.5rem] bg-blue-500"
        // {
        //   "bg-black border-gray-800": mode === "dark",
        //   "bg-white border-gray-200": mode === "light",
        // }
      )}
    >
      <header className="flex items-center justify-between w-full h-[4.5rem] bg-purple-400">

        
        <div className="flex items-center gap-4 md:hidden">
          <Image
            src={mode === "dark" ? solvLogoLight : solvLogoDark}
            width={25}
            height={31}
            alt="Solv Logo"
          />

          <div className="cursor-pointer" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? (
              <Cross1Icon className="w-5 h-5" />
            ) : (
              <HamburgerMenuIcon className="w-5 h-5" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <ConnectWallet /> */}

          <div
            className="cursor-pointer border border-solid border-gray-500 rounded-full p-1"
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          >
            {mode == "dark" ? (
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
