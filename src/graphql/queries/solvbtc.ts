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
}

export interface NonEvmRedemptionsResponse {
  nonEvmRedemptions: {
    totalCount: number;
    records: NonEvmRedemptionRecord[];
  };
}
