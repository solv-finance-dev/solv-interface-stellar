"use client";

import { ReactNode } from "react";

const BodyProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-[1200px] mx-auto md:pt-[6.5rem] mt-[3.125rem]">
      {children}
    </div>
  );
};

export default BodyProvider;
