"use client";

import { ReactNode } from "react";

import { useSolvBtcStore } from "@/states";
import { Theme } from "@radix-ui/themes";

function ThemeProvider({ children }: { children: ReactNode }) {
  const { mode } = useSolvBtcStore();

  return (
    <Theme appearance={mode as "light" | "dark" | "inherit" | undefined}>
      {children}
    </Theme>
  );
}

export default ThemeProvider;
