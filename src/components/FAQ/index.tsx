"use client";

import { Card } from "@radix-ui/themes";
import { solvFAQ } from "@/constants";

import DynamicAccordion from "../Accordion";

const FAQ = ({ hash }: { hash?: string }) => {
  return (
    <Card className="border-0 !p-0 !pb-4 scroll-mt-[50px]" id="faqs">
      <div className="p-4 text-[28px] font-medium font-MatterSQ-Medium">
        FAQs
      </div>
      <DynamicAccordion
        data={solvFAQ}
        defaultValue={hash ? ["How do I redeem my SolvBTC?"] : []}
      />
    </Card>
  );
};
export default FAQ;
