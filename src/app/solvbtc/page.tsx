'use client';

import React from 'react';
import Banner from '@/components/Banner';
import FAQ from '@/components/FAQ';
import { solvFAQ } from '@/constants';
import ActionTab from '@/components/ActionTab';

export default function SolvBtcPage() {
  return (
    <div>
      <Banner
        title='SolvBTC'
        subTitle=' '
        description='A Bitcoin Reserve for Everyone'
        showBg={true}
      />
      <ActionTab />
      <FAQ faqData={solvFAQ} />
    </div>
  );
}
