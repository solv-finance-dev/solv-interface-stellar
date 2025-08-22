"use client";

import { solvFAQ } from "@/constants";
import { Card } from "@solvprotocol/ui-v2";

import DynamicAccordion from "../Accordion";

const FAQ = ({ hash }: { hash?: string }) => {
  return (
    <Card className="p-8" id="faqs">
      <div className="text-3xl font-medium font-MatterSQ-Medium">FAQs</div>
      <DynamicAccordion
        data={solvFAQ}
        defaultValue={hash ? ["How do I redeem my SolvBTC?"] : []}
      />
    </Card>
  );
};
export default FAQ;
