"use client";

import { solvFAQ } from "@/constants";
import { Card } from "@solvprotocol/ui-v2";

import DynamicAccordion from "../Accordion";

const FAQ = ({ hash }: { hash?: string }) => {
  return (
    <Card
      className="box-border md:!p-8 !p-4 md:mb-8 mb-4 rounded-3xl"
      id="faqs"
    >
      <div className="text-3xl font-medium font-MatterSQ-Medium">FAQs</div>
      <DynamicAccordion
        data={solvFAQ}
        defaultValue={hash ? ["How do I redeem my SolvBTC?"] : []}
      />
    </Card>
  );
};
export default FAQ;
