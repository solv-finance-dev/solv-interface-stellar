"use client";

import { Card } from "@solvprotocol/ui-v2";

const Banner = () => {
  return (
    <Card className="!p-0 my-4">
      <div className="p-4 bg-[url('/solvbtc-h5-dark.png')] bg-contain bg-no-repeat bg-right">
        <div className="text-[32px] font-Faculty-Glyphic">SolvBTC</div>
        <div className="text-[12px]">A Bitcoin Reserve for Everyone</div>
      </div>
    </Card>
  );
};
export default Banner;
