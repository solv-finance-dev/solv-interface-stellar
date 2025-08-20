"use client";

import { ReactNode } from "react";

import BodyProvider from "./BodyProvider";
import ThemeProvider from "./ThemeProvider";

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <BodyProvider>{children}</BodyProvider>
    </ThemeProvider>
  );
};

export { Provider };
