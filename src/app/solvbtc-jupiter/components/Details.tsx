import DetailsDescription from '@/components/DetailsDescription';
import InfoItem from '@/components/InfoItem';

import React from 'react';

export default function Details() {
  return (
    <div>
      <div className='text-textColor mb-4 font-MatterSQ-Medium text-xl'>
        Contract Info
      </div>

      <div className='mb-6 flex space-x-[2rem] md:space-x-[3.875rem]'>
        <InfoItem label='Vault Address' value={`0x9537...d185`} url={''} />

        <InfoItem label='Token Address' value={`0x9537...d185`} url={''} />
      </div>

      <div className='text-textColor mb-4 font-MatterSQ-Medium text-xl'>
        Description
      </div>

      <DetailsDescription
        /* Placeholder text */
        description={`SolvBTC is a universal Bitcoin reserve token, fully backed 1:1 by
            Bitcoin and supported wrapped assets. It bridges Bitcoin’s value
            across blockchains—empowering you to access DeFi, CeFi, and TradFi
            opportunities with full asset control. Why SolvBTC Cross-Chain
            Ready —— Bridge Bitcoin’s value seamlessly across multiple chains.
            1:1 Transparent Reserve —— Every SolvBTC is fully backed by BTC and
            verified in real-time. Maximize Yields —— Access top Bitcoin yield
            strategies through Solv. Multi-Ecosystem Utility —— Use SolvBTC for
            lending, trading, or yield generation across DeFi, CeFi, and TradFi.
            You Own It —— Control your assets, your keys, your call.`}
      />
    </div>
  );
}
