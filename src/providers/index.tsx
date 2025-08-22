"use client";

import { ReactNode } from "react";

import Header from "@/components/Header";

import BodyProvider from "./BodyProvider";
import { ThemeProvider } from "./ThemeProvider";

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Header />
      <BodyProvider>{children}</BodyProvider>
    </ThemeProvider>
  );
};

export { Provider };
