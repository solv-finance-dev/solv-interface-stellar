'use client';

import React from 'react';
import Banner from '@/components/Banner';
import FAQ from '@/components/FAQ';
import SolvBTCJupiter from './components';
import { solvJupFAQ } from '@/constants';

export default function SolvBTCJupiterPage() {
  return (
    <div>
      <Banner
        title='SolvBTC Jupiter'
        subTitle=' '
        description='Subtitle, please write a brief introduction of what does user do on this page'
        slot='4.18% APY'
        showBg={false}
      />

      <SolvBTCJupiter />

      <FAQ faqData={solvJupFAQ} />
    </div>
  );
}
