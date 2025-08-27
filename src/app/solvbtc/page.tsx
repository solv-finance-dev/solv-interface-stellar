"use client";

import React from "react";
import Banner from "@/components/Banner";
import FAQ from "@/components/FAQ";
import SolvBtc from "./components";
import { solvFAQ } from "@/constants";

export default function SolvBtcPage() {
  return (
    <div>
      <Banner
        title="SolvBTC"
        subTitle=" "
        description="A Bitcoin Reserve for Everyone"
        showBg={true}
      />

      <SolvBtc />

      <FAQ faqData={solvFAQ} />
    </div>
  );
}
