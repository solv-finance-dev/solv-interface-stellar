"use client";


import { Card } from "@solvprotocol/ui-v2";

import DynamicAccordion, { SolvInfo } from "../Accordion";

const FAQ = ({ hash, faqData }: { hash?: string; faqData:SolvInfo[] }) => {
  return (
    <Card
      className="box-border md:!p-8 !p-4 md:mb-8 mb-4 rounded-3xl"
      id="faqs"
    >
      <div className="text-3xl font-medium font-MatterSQ-Medium">FAQs</div>
      <DynamicAccordion
        data={faqData}
        defaultValue={hash ? ["How do I redeem my SolvBTC?"] : []}
      />
    </Card>
  );
};
export default FAQ;
