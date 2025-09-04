export type SentTransactionLike = {
  sendTransactionResponse?: { hash?: string };
  getTransactionResponse?: { txhash?: string; hash?: string };
  hash?: string;
};

export const getExplorerTxBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_EXPLORER_TX_URL || '';

export const getTxHashFromSent = (
  resp: SentTransactionLike | any
): string | undefined => {
  if (!resp || typeof resp !== 'object') return undefined;
  return (
    resp.sendTransactionResponse?.hash ||
    resp.getTransactionResponse?.txhash ||
    resp.getTransactionResponse?.hash ||
    resp.hash ||
    undefined
  );
};

export const buildExplorerTxUrl = (txHash?: string): string | undefined => {
  const base = getExplorerTxBaseUrl();
  return txHash ? `${base}${txHash}` : undefined;
};
