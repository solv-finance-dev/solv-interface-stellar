const solvFAQ = [
  {
    title: 'What is SolvBTC?',
    content:
      'SolvBTC is a universal Bitcoin reserve token that connects Bitcoin’s value across multiple blockchains. Backed 1:1 by a transparent reserve, it allows you to use your Bitcoin in DeFi, CeFi, and TradFi markets for lending, trading, or yield generation while maintaining full control.',
  },
  {
    title: 'How does SolvBTC work?',
    content:
      'SolvBTC is minted by depositing Bitcoin & supported wrapped Bitcoin into Solv Protocol’s secure reserve, creating a 1:1 pegged token. You can then use SolvBTC across supported blockchains to participate in financial activities like lending, trading, or yield farming, all while your underlying Bitcoin remains securely held.',
  },
  {
    title: 'What can I do with SolvBTC?',
    content: `With SolvBTC, you can:
* Access DeFi, CeFi, and TradFi opportunities like yield generation and liquidity provision.
* Participate in lending, trading, or staking across ecosystems.
* Use Solv Strategies to tap into the best Bitcoin yield opportunities available.`,
  },
  {
    title: 'How is SolvBTC backed and secured?',
    content:
      'SolvBTC is backed 1:1 by Bitcoin and Wrapped Bitcoin (WBTC) held in a transparent, audited reserve. The reserve is secured with institutional-grade measures, including partnerships with trusted custodians like Ceffu, ensuring your assets are protected.',
  },
  {
    title: 'What blockchains does SolvBTC support?',
    content: `SolvBTC connects Bitcoin’s value across multiple blockchains, including Ethereum, BNB Chain, Avalanche, and more. Check the Solv Protocol platform for the latest supported networks.`,
  },
  {
    title: 'How do I redeem my SolvBTC?',
    content:
      'Submit your redemption request anytime from Sunday to Saturday, and it will be processed on the following Monday. If Monday is a non-business day, processing shifts to the next business day. Plan ahead for a smooth experience.',
  },
  {
    title: 'Are there any fees for using SolvBTC?',
    content:
      'Depending on the method you use to mint SolvBTC, there might be some fees. However, there are no fees for redeeming SolvBTC back to Bitcoin. Additional fees may apply for specific DeFi, CeFi, or TradFi activities—details are available on the Solv platform.',
  },
];

const solvJupFAQ = [
  {
    title: 'What is SolvBTC.JUP?',
    content: `**SolvBTC.JUP** is a liquid staking token for Bitcoin, allowing users to participate in a **delta-neutral trading strategy** by providing liquidity to the **Jupiter Liquidity Provider (JLP) Pool**. The JLP Pool is used by traders for leveraged trading, while SolvBTC.JUP minimizes exposure to market fluctuations through hedging on centralized exchanges (CEXes). In return, users earn yields generated from trading fees, borrowing fees, and other pool activities, all while benefiting from active risk management to ensure stability and consistent returns.`,
  },
  {
    title: 'How does SolvBTC.JUP generate yields?',
    content: `Yields for SolvBTC.JUP come from multiple sources:
* **Trading Fees**: Earn a portion of JLP Pool fees from trading and borrowing activities.
* **Funding Rate from Hedging**: By hedging delta exposure on centralized exchanges, SolvBTC.JUP generates additional yields based on market-neutral positions.
`,
  },
  {
    title: 'How are yields distributed?',
    content: `Yields are reflected in the value of SolvBTC.JUP over time. As the strategy accrues profits, the BTC-denominated value of each SolvBTC.JUP token increases. Users do not need to manually claim rewards; the value of their holdings grows automatically.`,
  },
  {
    title: 'What are the fees associated with SolvBTC.JUP?',
    content: `
* **Performance Fee**: 30% of all yields generated are deducted as a performance fee before being reflected in the token value.
* **Redemption Fee**: 0.6% is charged during redemptions to cover operational and liquidity costs.
    `,
  },
  {
    title: 'SolvBTC.JUP Redemption Schedule',
    content: `To redeem your **SolvBTC.JUP**, please submit a redemption request through the **Solv platform**. Requests are processed **three times a month** based on the following schedule:
*	**Requests submitted from the 1st to the 9th** → Processed on the **15th**
*	**Requests submitted from the 10th to the 19th** → Processed on the **25th**
*	**Requests submitted from the 20th to the end of the month** → Processed on the **5th of the following month**

🔹 *If the scheduled date falls on a weekend, processing will be deferred to the next business day.*
    `,
  },
  {
    title: 'What DeFi protocols does SolvBTC.JUP interact with?',
    content: `Currently, SolvBTC.JUP interacts with:
* **Jupiter Liquidity Provider Pool (JLP)** on Solana for BTC-based liquidity provisioning. Future integrations will focus on expanding SolvBTC.JUP’s exposure across Solana and other ecosystems to increase yield opportunities.
    `,
  },
  {
    title: 'What risks are associated with SolvBTC.JUP?',
    content: `While SolvBTC.JUP employs a hedged, delta-neutral strategy to mitigate market risks, the following risks remain:
* **Smart Contract Risks**: Vulnerabilities in Solana-based protocols or the Jupiter Pool could impact funds.
* **Counterparty Risks**: Relies on centralized exchanges (CEXes) for hedging, which may introduce third-party risks. To minimize these risks, Solv uses institutional-grade security and 24/7 risk monitoring to safeguard user assets.
    `,
  },
];

export { solvFAQ, solvJupFAQ };
