"use client";

import Image from "next/image";
import LogoDark from "@/assets/images/solv-logo-dark.svg";
import LogoLight from "@/assets/images/solv-logo-light.svg";

import { useSolvBtcStore } from "@/states";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function Home() {
  const { mode, setMode } = useSolvBtcStore();

  return (
    <div>
      <div className="!flex !items-center !justify-end p-3">
        <div
          className="rounded-full w-10 h-10 flex items-center justify-center border border-solid border-grayColor"
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
          <span>
            {mode == "dark" ? (
              <SunIcon width={20} height={20} />
            ) : (
              <MoonIcon width={20} height={20} />
            )}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center h-40 flex-col gap-3">
        <Image src={mode === "dark" ? LogoLight : LogoDark} alt=""></Image>
        <div className="text-4xl font-MatterSQ-Medium">Welcome to Solv</div>
        <div>Solv App - The Future of Bitcoin Finance</div>
      </div>
    </div>
  );
}
