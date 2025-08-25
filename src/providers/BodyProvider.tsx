"use client";

import { ReactNode } from "react";

const BodyProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-[1200px] mx-auto lg:pt-[6.5rem] pt-[4.75rem]">
      {children}
    </div>
  );
};

export default BodyProvider;
