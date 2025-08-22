"use client";

import { ReactNode, useEffect, useState } from "react";

import Header from "@/components/Header";

import BodyProvider from "./BodyProvider";
import { ThemeProvider } from "./ThemeProvider";
import { useWalletStore } from "@/states";

const Provider = ({ children }: { children: ReactNode }) => {
  const initializeWallets = useWalletStore((state) => state.initializeWallets)
  useEffect(() => {
    // 初始化应用配置
    const initialize = async () => {
      try {
        await initializeWallets()
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }

    initialize()
  }, [initializeWallets])
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Header />
      <BodyProvider>{children}</BodyProvider>
    </ThemeProvider>
  );
};

export { Provider };
