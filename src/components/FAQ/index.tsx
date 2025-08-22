"use client";

import { solvFAQ } from "@/constants";

import DynamicAccordion from "../Accordion";
import { Card } from "@solvprotocol/ui-v2";

const FAQ = ({ hash }: { hash?: string }) => {
  return (
    <Card className="p-8" id="faqs">
      <div className="text-[28px] font-medium font-MatterSQ-Medium">FAQs</div>
      <DynamicAccordion
        data={solvFAQ}
        defaultValue={hash ? ["How do I redeem my SolvBTC?"] : []}
      />
    </Card>
  );
};
export default FAQ;
