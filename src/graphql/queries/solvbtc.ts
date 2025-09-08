import { gql } from '@apollo/client';

export const QUERY_NON_EVM_REDEMPTIONS = gql`
  query NonEvmRedemptions(
    $filter: NonEvmRedeemFilter
    $pagination: Pagination
    $sort: Sort
  ) {
    nonEvmRedemptions(filter: $filter, pagination: $pagination, sort: $sort) {
      totalCount
      records {
        id
        chain
        vaultId
        vaultName
        walletAddress
        withdrawTokenAddress
        withdrawRequestHash
        share
        withdrawAmount
        fee
        state
        availableTime
        verifierAddress
        valueUsd
        nav
      }
    }
  }
`;

export interface NonEvmRedemptionRecord {
  id: string;
  chain: string;
  vaultId: string;
  vaultName: string;
  walletAddress: string;
  withdrawTokenAddress: string;
  withdrawRequestHash: string;
  share: string;
  withdrawAmount: string;
  fee: string;
  state: 'pending' | 'ready' | string;
  availableTime: string; // ISO timestamp
  verifierAddress: string;
  valueUsd: string;
  nav: string;
}

export interface NonEvmRedemptionsResponse {
  nonEvmRedemptions: {
    totalCount: number;
    records: NonEvmRedemptionRecord[];
  };
}

// Signature for redemption claim (non-EVM chains)
export const QUERY_NON_EVM_REDEMPTION_SIG = gql`
  query NonEvmRedemptionSig($redemptionId: String) {
    nonEvmRedemptionSig(redemptionId: $redemptionId) {
      id
      signature
      recoveryId
    }
  }
`;

export interface NonEvmRedemptionSigResponse {
  nonEvmRedemptionSig: {
    id: string | null | undefined;
    signature: string | null | undefined;
    recoveryId: number | null | undefined;
  } | null;
}
