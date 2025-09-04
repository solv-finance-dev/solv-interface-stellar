'use client';

import { Card } from '@solvprotocol/ui-v2';

import DynamicAccordion, { SolvInfo } from '../Accordion';

const FAQ = ({ hash, faqData }: { hash?: string; faqData: SolvInfo[] }) => {
  return (
    <Card className='mb-4 rounded-3xl !p-4 md:mb-8 md:!p-8' id='faqs'>
      <div className='font-MatterSQ-Medium text-3xl font-medium'>FAQs</div>
      <DynamicAccordion
        data={faqData}
        defaultValue={hash ? ['How do I redeem my SolvBTC?'] : []}
      />
    </Card>
  );
};
export default FAQ;
