"use client";

import Banner from "@/components/Banner";
import FAQ from "@/components/FAQ";
import SolvBtc from "./components";

const SolvBtcPage = () => {
  return (
    <div>
      <Banner
        title="SolvBTC"
        subTitle=" "
        description="A Bitcoin Reserve for Everyone"
        showBg={true}
      />

      <SolvBtc />

      <FAQ />
    </div>
  );
};

export default SolvBtcPage;
