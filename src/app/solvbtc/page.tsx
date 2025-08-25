"use client";

import Banner from "@/components/Banner";
import FAQ from "@/components/FAQ";

const SolvBtcPage = () => {
  return (
    <div>
      <Banner
        title="SolvBTC"
        subTitle="on Solana"
        description="A Bitcoin Reserve for Everyone"
        showBg={true}
      />
      <FAQ />
    </div>
  );
};

export default SolvBtcPage;
