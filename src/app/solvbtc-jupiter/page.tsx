"use client";

import Banner from "@/components/Banner";
import FAQ from "@/components/FAQ";
import SolvBTCJupiter from "./components";
import { solvJupFAQ } from "@/constants";

const SolvBTCJupiterPage = () => {
  return (
    <div>
      <Banner
        title="SolvBTC Jupiter"
        subTitle=" "
        description="Subtitle, please write a brief introduction of what does user do on this page"
        showBg={false}
      />

      <SolvBTCJupiter />

      <FAQ faqData={solvJupFAQ} />
    </div>
  );
};

export default SolvBTCJupiterPage;
