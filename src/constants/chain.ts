export const aiLayerChain = {
  id: 123456, // 替换为 AI_LAYER 的实际链 ID
  name: "AI Layer",
  network: "ailayer",
  nativeCurrency: {
    name: "AI Layer Token",
    symbol: "AIL",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ai-layer.io"] // 替换为实际 RPC URL
    }
  },
  blockExplorers: {
    default: {
      name: "AILayerScan",
      url: "https://scan.ai-layer.io" // 替换为实际区块浏览器 URL
    }
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11", // 可选
      blockCreated: 12345678 // 替换为实际部署块号
    }
  }
};
