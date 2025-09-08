import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export enum SignatureType {
  Ed25519 = 0,
  Secp256k1 = 1,
}

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAR4BTRMWF4AQ5P2H75NSDSVTR2ND4NP55PIYF7HZI3X3XPHR4YPY4RL",
  }
} as const


/**
 * EIP712 signature data structure: withdrawal request
 */
export interface WithdrawRequest {
  nav: i128;
  request_hash: Buffer;
  signature: Buffer;
  target_amount: i128;
  timestamp: u64;
  user: string;
}


/**
 * Deposit event
 */
export interface DepositEvent {
  amount: i128;
  minted_tokens: i128;
  nav: i128;
}


/**
 * Withdrawal event
 */
export interface WithdrawEvent {
  amount: i128;
  fee: i128;
  request_hash: Buffer;
}


/**
 * Currency added event
 */
export interface SetAllowedCurrencyEvent {
  allowed: boolean;
}


/**
 * Currency removed event
 */
export interface CurrencyRemovedEvent {
  admin: string;
}


/**
 * Withdraw request event
 */
export interface WithdrawRequestEvent {
  amount: i128;
  nav: i128;
  request_hash: Buffer;
  shares: i128;
  token_contract: string;
}


/**
 * Treasurer deposit event
 */
export interface TreasurerDepositEvent {
  amount: i128;
}

/**
 * Storage data key enum
 */
export type DataKey = { tag: "Oracle", values: void } | { tag: "Treasurer", values: void } | { tag: "WithdrawVerifier", values: readonly [u32] } | { tag: "TokenContract", values: void } | { tag: "AllowedCurrency", values: void } | { tag: "DepositFeeRatio", values: void } | { tag: "WithdrawCurrency", values: void } | { tag: "WithdrawFeeRatio", values: void } | { tag: "WithdrawFeeReceiver", values: void } | { tag: "WithdrawRequestStatus", values: void } | { tag: "UsedRequestHash", values: readonly [Buffer] };


export interface EIP712Domain {
  chain_id: Buffer;
  name: string;
  salt: Buffer;
  verifying_contract: string;
  version: string;
}

/**
 * Error code definition
 */
export const ContractErrors = {
  /**
   * Currency not supported
   */
  301: { message: "CurrencyNotAllowed" },

  /**
   * Exceeds maximum currency quantity
   */
  302: { message: "TooManyCurrencies" },

  /**
   * Currency already exists
   */
  303: { message: "CurrencyAlreadyExists" },

  /**
   * Currency does not exist
   */
  304: { message: "CurrencyNotExists" },

  /**
   * Invalid amount
   */
  305: { message: "InvalidAmount" },

  /**
   * Invalid NAV
   */
  306: { message: "InvalidNav" },

  /**
   * Withdraw fee ratio not set or invalid
   */
  307: { message: "WithdrawFeeRatioNotSet" },

  /**
   * Invalid withdraw fee ratio
   */
  308: { message: "InvalidWithdrawFeeRatio" },

  /**
   * Request already exists
   */
  309: { message: "RequestAlreadyExists" },

  /**
   * Insufficient balance
   */
  310: { message: "InsufficientBalance" },

  /**
   * Invalid request status
   */
  311: { message: "InvalidRequestStatus" },

  /**
   * Invalid deposit fee ratio
   */
  312: { message: "InvalidDepositFeeRatio" },

  /**
   * Insufficient permissions
   */
  313: { message: "Unauthorized" }
}
export enum WithdrawStatus {
  NotExist = 0,
  Pending = 1,
  Done = 2,
}

export const OpenzeppelinErrors = {
  1220: { message: "OwnerNotSet" },

  1221: { message: "TransferInProgress" },

  1222: { message: "OwnerAlreadySet" }
}
/**
 * Storage keys for `Ownable` utility.
 */
export type OwnableStorageKey = { tag: "Owner", values: void } | { tag: "PendingOwner", values: void };

export const Errors = {
  ...ContractErrors,
  ...OpenzeppelinErrors,
  /**
   * When migration is attempted but not allowed due to upgrade state.
   */
  1100: { message: "MigrationNotAllowed" }
}

export interface SolvBTCVaultClient {
  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: ({ new_wasm_hash, operator }: { new_wasm_hash: Buffer, operator: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: ({ from, currency, amount }: { from: string, currency: string, amount: i128 }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a withdraw_request transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_request: ({ from, shares, request_hash }: { from: string, shares: i128, request_hash: Buffer }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw: ({ from, shares, nav, request_hash, signature, signature_type, recovery_id }: { from: string, shares: i128, nav: i128, request_hash: Buffer, signature: Buffer, signature_type: u32, recovery_id: u32 }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a treasurer_deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  treasurer_deposit: ({ amount }: { amount: i128 }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a add_currency_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_currency_by_admin: ({ currency }: { currency: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a remove_currency_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_currency_by_admin: ({ currency }: { currency: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_supported_currencies transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_supported_currencies: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a is_currency_supported transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_currency_supported: ({ currency }: { currency: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_withdraw_currency transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_withdraw_currency: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a set_withdraw_currency_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_withdraw_currency_by_admin: ({ withdraw_currency }: { withdraw_currency: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_shares_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_shares_token: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a set_withdraw_verifier_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_withdraw_verifier_by_admin: ({ signature_type, verifier_public_key }: { signature_type: u32, verifier_public_key: Buffer }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_oracle_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_oracle_by_admin: ({ oracle }: { oracle: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_treasurer_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_treasurer_by_admin: ({ treasurer }: { treasurer: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_deposit_fee_ratio_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_deposit_fee_ratio_by_admin: ({ deposit_fee_ratio }: { deposit_fee_ratio: i128 }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_withdraw_fee_ratio_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_withdraw_fee_ratio_by_admin: ({ withdraw_fee_ratio }: { withdraw_fee_ratio: i128 }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_withdraw_fee_recv_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_withdraw_fee_recv_by_admin: ({ withdraw_fee_receiver }: { withdraw_fee_receiver: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the current admin address
   */
  get_admin: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_withdraw_verifier transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_withdraw_verifier: ({ signature_type }: { signature_type: u32 }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>

  /**
   * Construct and simulate a get_oracle transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_oracle: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_treasurer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_treasurer: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_withdraw_fee_ratio transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_withdraw_fee_ratio: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_deposit_fee_ratio transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_deposit_fee_ratio: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_eip712_domain_name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_eip712_domain_name: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_eip712_domain_version transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_eip712_domain_version: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_eip712_chain_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_eip712_chain_id: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>

  /**
   * Construct and simulate a get_eip712_domain_separator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_eip712_domain_separator: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>

  /**
   * Construct and simulate a get_withdraw_fee_receiver transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_withdraw_fee_receiver: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_owner: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a transfer_ownership transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_ownership: ({ new_owner, live_until_ledger }: { new_owner: string, live_until_ledger: u32 }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a accept_ownership transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  accept_ownership: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a renounce_ownership transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  renounce_ownership: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

}
export class SolvBTCVaultClient extends ContractClient {
  static async deploy<T = SolvBTCVaultClient>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin, token_contract, oracle, treasurer, withdraw_verifier, deposit_fee_ratio, withdraw_fee_ratio, withdraw_fee_receiver, withdraw_currency }: { admin: string, token_contract: string, oracle: string, treasurer: string, withdraw_verifier: Buffer, deposit_fee_ratio: i128, withdraw_fee_ratio: i128, withdraw_fee_receiver: string, withdraw_currency: string },
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({ admin, token_contract, oracle, treasurer, withdraw_verifier, deposit_fee_ratio, withdraw_fee_ratio, withdraw_fee_receiver, withdraw_currency }, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec(["AAAAAQAAADNFSVA3MTIgc2lnbmF0dXJlIGRhdGEgc3RydWN0dXJlOiB3aXRoZHJhd2FsIHJlcXVlc3QAAAAAAAAAAA9XaXRoZHJhd1JlcXVlc3QAAAAABgAAAAAAAAADbmF2AAAAAAsAAAAAAAAADHJlcXVlc3RfaGFzaAAAAA4AAAAAAAAACXNpZ25hdHVyZQAAAAAAAA4AAAAAAAAADXRhcmdldF9hbW91bnQAAAAAAAALAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAGAAAAAAAAAAR1c2VyAAAAEw==",
        "AAAAAQAAAA1EZXBvc2l0IGV2ZW50AAAAAAAAAAAAAAxEZXBvc2l0RXZlbnQAAAADAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAADW1pbnRlZF90b2tlbnMAAAAAAAALAAAAAAAAAANuYXYAAAAACw==",
        "AAAAAQAAABBXaXRoZHJhd2FsIGV2ZW50AAAAAAAAAA1XaXRoZHJhd0V2ZW50AAAAAAAAAwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAANmZWUAAAAACwAAAAAAAAAMcmVxdWVzdF9oYXNoAAAADg==",
        "AAAAAQAAABRDdXJyZW5jeSBhZGRlZCBldmVudAAAAAAAAAAXU2V0QWxsb3dlZEN1cnJlbmN5RXZlbnQAAAAAAQAAAAAAAAAHYWxsb3dlZAAAAAAB",
        "AAAAAQAAABZDdXJyZW5jeSByZW1vdmVkIGV2ZW50AAAAAAAAAAAAFEN1cnJlbmN5UmVtb3ZlZEV2ZW50AAAAAQAAAAAAAAAFYWRtaW4AAAAAAAAT",
        "AAAAAQAAABZXaXRoZHJhdyByZXF1ZXN0IGV2ZW50AAAAAAAAAAAAFFdpdGhkcmF3UmVxdWVzdEV2ZW50AAAABQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAANuYXYAAAAACwAAAAAAAAAMcmVxdWVzdF9oYXNoAAAADgAAAAAAAAAGc2hhcmVzAAAAAAALAAAAAAAAAA50b2tlbl9jb250cmFjdAAAAAAAEw==",
        "AAAAAQAAABdUcmVhc3VyZXIgZGVwb3NpdCBldmVudAAAAAAAAAAAFVRyZWFzdXJlckRlcG9zaXRFdmVudAAAAAAAAAEAAAAAAAAABmFtb3VudAAAAAAACw==",
        "AAAAAgAAABVTdG9yYWdlIGRhdGEga2V5IGVudW0AAAAAAAAAAAAAB0RhdGFLZXkAAAAACwAAAAAAAAAXT3JhY2xlIGNvbnRyYWN0IGFkZHJlc3MAAAAABk9yYWNsZQAAAAAAAAAAABFUcmVhc3VyZXIgYWRkcmVzcwAAAAAAAAlUcmVhc3VyZXIAAAAAAAABAAAAlVdpdGhkcmF3YWwgdmVyaWZpZXIgbWFwOiB1MzIgKHNpZ25hdHVyZV90eXBlKSAtPiBQdWJsaWNLZXkgKEJ5dGVzKQpTaWduYXR1cmVUeXBlOjpFRDI1NTE5ICgzMiBieXRlcykKU2lnbmF0dXJlVHlwZTo6U0VDUDI1NksxICg2NSBieXRlcyB1bmNvbXByZXNzZWQpAAAAAAAAEFdpdGhkcmF3VmVyaWZpZXIAAAABAAAABAAAAAAAAAAWVG9rZW4gY29udHJhY3QgYWRkcmVzcwAAAAAADVRva2VuQ29udHJhY3QAAAAAAAAAAAAAMVN1cHBvcnRlZCBjdXJyZW5jaWVzIG1hcHBpbmcgKE1hcDxBZGRyZXNzLCBib29sPikAAAAAAAAPQWxsb3dlZEN1cnJlbmN5AAAAAAAAAAARRGVwb3NpdCBmZWUgcmF0aW8AAAAAAAAPRGVwb3NpdEZlZVJhdGlvAAAAAAAAAAATV2l0aGRyYXdhbCBjdXJyZW5jeQAAAAAQV2l0aGRyYXdDdXJyZW5jeQAAAAAAAAAUV2l0aGRyYXdhbCBmZWUgcmF0aW8AAAAQV2l0aGRyYXdGZWVSYXRpbwAAAAAAAAAdV2l0aGRyYXcgZmVlIHJlY2VpdmVyIGFkZHJlc3MAAAAAAAATV2l0aGRyYXdGZWVSZWNlaXZlcgAAAAAAAAAAGVdpdGhkcmF3YWwgcmVxdWVzdCBzdGF0dXMAAAAAAAAVV2l0aGRyYXdSZXF1ZXN0U3RhdHVzAAAAAAAAAQAAABlVc2VkIHJlcXVlc3QgaGFzaCBtYXBwaW5nAAAAAAAAD1VzZWRSZXF1ZXN0SGFzaAAAAAABAAAADg==",
        "AAAAAQAAAAAAAAAAAAAADEVJUDcxMkRvbWFpbgAAAAUAAAAAAAAACGNoYWluX2lkAAAADgAAAAAAAAAEbmFtZQAAABAAAAAAAAAABHNhbHQAAAAOAAAAAAAAABJ2ZXJpZnlpbmdfY29udHJhY3QAAAAAABMAAAAAAAAAB3ZlcnNpb24AAAAAEA==",
        "AAAABAAAABVFcnJvciBjb2RlIGRlZmluaXRpb24AAAAAAAAAAAAAClZhdWx0RXJyb3IAAAAAAA0AAAAWQ3VycmVuY3kgbm90IHN1cHBvcnRlZAAAAAAAEkN1cnJlbmN5Tm90QWxsb3dlZAAAAAABLQAAACFFeGNlZWRzIG1heGltdW0gY3VycmVuY3kgcXVhbnRpdHkAAAAAAAARVG9vTWFueUN1cnJlbmNpZXMAAAAAAAEuAAAAF0N1cnJlbmN5IGFscmVhZHkgZXhpc3RzAAAAABVDdXJyZW5jeUFscmVhZHlFeGlzdHMAAAAAAAEvAAAAF0N1cnJlbmN5IGRvZXMgbm90IGV4aXN0AAAAABFDdXJyZW5jeU5vdEV4aXN0cwAAAAAAATAAAAAOSW52YWxpZCBhbW91bnQAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAABMQAAAAtJbnZhbGlkIE5BVgAAAAAKSW52YWxpZE5hdgAAAAABMgAAACVXaXRoZHJhdyBmZWUgcmF0aW8gbm90IHNldCBvciBpbnZhbGlkAAAAAAAAFldpdGhkcmF3RmVlUmF0aW9Ob3RTZXQAAAAAATMAAAAaSW52YWxpZCB3aXRoZHJhdyBmZWUgcmF0aW8AAAAAABdJbnZhbGlkV2l0aGRyYXdGZWVSYXRpbwAAAAE0AAAAFlJlcXVlc3QgYWxyZWFkeSBleGlzdHMAAAAAABRSZXF1ZXN0QWxyZWFkeUV4aXN0cwAAATUAAAAUSW5zdWZmaWNpZW50IGJhbGFuY2UAAAATSW5zdWZmaWNpZW50QmFsYW5jZQAAAAE2AAAAFkludmFsaWQgcmVxdWVzdCBzdGF0dXMAAAAAABRJbnZhbGlkUmVxdWVzdFN0YXR1cwAAATcAAAAZSW52YWxpZCBkZXBvc2l0IGZlZSByYXRpbwAAAAAAABZJbnZhbGlkRGVwb3NpdEZlZVJhdGlvAAAAAAE4AAAAGEluc3VmZmljaWVudCBwZXJtaXNzaW9ucwAAAAxVbmF1dGhvcml6ZWQAAAE5",
        "AAAAAwAAAAAAAAAAAAAADldpdGhkcmF3U3RhdHVzAAAAAAADAAAAAAAAAAhOb3RFeGlzdAAAAAAAAAAAAAAAB1BlbmRpbmcAAAAAAQAAAAAAAAAERG9uZQAAAAI=",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAACAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAkAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAOdG9rZW5fY29udHJhY3QAAAAAABMAAAAAAAAABm9yYWNsZQAAAAAAEwAAAAAAAAAJdHJlYXN1cmVyAAAAAAAAEwAAAAAAAAARd2l0aGRyYXdfdmVyaWZpZXIAAAAAAAPuAAAAIAAAAAAAAAARZGVwb3NpdF9mZWVfcmF0aW8AAAAAAAALAAAAAAAAABJ3aXRoZHJhd19mZWVfcmF0aW8AAAAAAAsAAAAAAAAAFXdpdGhkcmF3X2ZlZV9yZWNlaXZlcgAAAAAAABMAAAAAAAAAEXdpdGhkcmF3X2N1cnJlbmN5AAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAIY3VycmVuY3kAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAACw==",
        "AAAAAAAAAAAAAAAQd2l0aGRyYXdfcmVxdWVzdAAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAZzaGFyZXMAAAAAAAsAAAAAAAAADHJlcXVlc3RfaGFzaAAAAA4AAAAA",
        "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAHAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGc2hhcmVzAAAAAAALAAAAAAAAAANuYXYAAAAACwAAAAAAAAAMcmVxdWVzdF9oYXNoAAAADgAAAAAAAAAJc2lnbmF0dXJlAAAAAAAD7gAAAEAAAAAAAAAADnNpZ25hdHVyZV90eXBlAAAAAAAEAAAAAAAAAAtyZWNvdmVyeV9pZAAAAAAEAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAARdHJlYXN1cmVyX2RlcG9zaXQAAAAAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAVYWRkX2N1cnJlbmN5X2J5X2FkbWluAAAAAAAAAQAAAAAAAAAIY3VycmVuY3kAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAYcmVtb3ZlX2N1cnJlbmN5X2J5X2FkbWluAAAAAQAAAAAAAAAIY3VycmVuY3kAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAYZ2V0X3N1cHBvcnRlZF9jdXJyZW5jaWVzAAAAAAAAAAEAAAPqAAAAEw==",
        "AAAAAAAAAAAAAAAVaXNfY3VycmVuY3lfc3VwcG9ydGVkAAAAAAAAAQAAAAAAAAAIY3VycmVuY3kAAAATAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAVZ2V0X3dpdGhkcmF3X2N1cnJlbmN5AAAAAAAAAAAAAAEAAAPoAAAAEw==",
        "AAAAAAAAAAAAAAAec2V0X3dpdGhkcmF3X2N1cnJlbmN5X2J5X2FkbWluAAAAAAABAAAAAAAAABF3aXRoZHJhd19jdXJyZW5jeQAAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAQZ2V0X3NoYXJlc190b2tlbgAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAec2V0X3dpdGhkcmF3X3ZlcmlmaWVyX2J5X2FkbWluAAAAAAACAAAAAAAAAA5zaWduYXR1cmVfdHlwZQAAAAAABAAAAAAAAAATdmVyaWZpZXJfcHVibGljX2tleQAAAAAOAAAAAA==",
        "AAAAAAAAAAAAAAATc2V0X29yYWNsZV9ieV9hZG1pbgAAAAABAAAAAAAAAAZvcmFjbGUAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAWc2V0X3RyZWFzdXJlcl9ieV9hZG1pbgAAAAAAAQAAAAAAAAAJdHJlYXN1cmVyAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAec2V0X2RlcG9zaXRfZmVlX3JhdGlvX2J5X2FkbWluAAAAAAABAAAAAAAAABFkZXBvc2l0X2ZlZV9yYXRpbwAAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAfc2V0X3dpdGhkcmF3X2ZlZV9yYXRpb19ieV9hZG1pbgAAAAABAAAAAAAAABJ3aXRoZHJhd19mZWVfcmF0aW8AAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAec2V0X3dpdGhkcmF3X2ZlZV9yZWN2X2J5X2FkbWluAAAAAAABAAAAAAAAABV3aXRoZHJhd19mZWVfcmVjZWl2ZXIAAAAAAAATAAAAAA==",
        "AAAAAAAAAB1HZXQgdGhlIGN1cnJlbnQgYWRtaW4gYWRkcmVzcwAAAAAAAAlnZXRfYWRtaW4AAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAVZ2V0X3dpdGhkcmF3X3ZlcmlmaWVyAAAAAAAAAQAAAAAAAAAOc2lnbmF0dXJlX3R5cGUAAAAAAAQAAAABAAAADg==",
        "AAAAAAAAAAAAAAAKZ2V0X29yYWNsZQAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAANZ2V0X3RyZWFzdXJlcgAAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAWZ2V0X3dpdGhkcmF3X2ZlZV9yYXRpbwAAAAAAAAAAAAEAAAAL",
        "AAAAAAAAAAAAAAAVZ2V0X2RlcG9zaXRfZmVlX3JhdGlvAAAAAAAAAAAAAAEAAAAL",
        "AAAAAAAAAAAAAAAWZ2V0X2VpcDcxMl9kb21haW5fbmFtZQAAAAAAAAAAAAEAAAAQ",
        "AAAAAAAAAAAAAAAZZ2V0X2VpcDcxMl9kb21haW5fdmVyc2lvbgAAAAAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAATZ2V0X2VpcDcxMl9jaGFpbl9pZAAAAAAAAAAAAQAAAA4=",
        "AAAAAAAAAAAAAAAbZ2V0X2VpcDcxMl9kb21haW5fc2VwYXJhdG9yAAAAAAAAAAABAAAADg==",
        "AAAAAAAAAAAAAAAZZ2V0X3dpdGhkcmF3X2ZlZV9yZWNlaXZlcgAAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAJZ2V0X293bmVyAAAAAAAAAAAAAAEAAAPoAAAAEw==",
        "AAAAAAAAAAAAAAASdHJhbnNmZXJfb3duZXJzaGlwAAAAAAACAAAAAAAAAAluZXdfb3duZXIAAAAAAAATAAAAAAAAABFsaXZlX3VudGlsX2xlZGdlcgAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAQYWNjZXB0X293bmVyc2hpcAAAAAAAAAAA",
        "AAAAAAAAAAAAAAAScmVub3VuY2Vfb3duZXJzaGlwAAAAAAAAAAAAAA==",
        "AAAABAAAAAAAAAAAAAAADE93bmFibGVFcnJvcgAAAAMAAAAAAAAAC093bmVyTm90U2V0AAAABMQAAAAAAAAAElRyYW5zZmVySW5Qcm9ncmVzcwAAAAAExQAAAAAAAAAPT3duZXJBbHJlYWR5U2V0AAAABMY=",
        "AAAAAgAAACNTdG9yYWdlIGtleXMgZm9yIGBPd25hYmxlYCB1dGlsaXR5LgAAAAAAAAAAEU93bmFibGVTdG9yYWdlS2V5AAAAAAAAAgAAAAAAAAAAAAAABU93bmVyAAAAAAAAAAAAAAAAAAAMUGVuZGluZ093bmVy",
        "AAAABAAAAAAAAAAAAAAAEFVwZ3JhZGVhYmxlRXJyb3IAAAABAAAAQVdoZW4gbWlncmF0aW9uIGlzIGF0dGVtcHRlZCBidXQgbm90IGFsbG93ZWQgZHVlIHRvIHVwZ3JhZGUgc3RhdGUuAAAAAAAAE01pZ3JhdGlvbk5vdEFsbG93ZWQAAAAETA=="]),
      options
    )
  }
  public readonly fromJSON = {
    upgrade: this.txFromJSON<null>,
    deposit: this.txFromJSON<i128>,
    withdraw_request: this.txFromJSON<null>,
    withdraw: this.txFromJSON<i128>,
    treasurer_deposit: this.txFromJSON<null>,
    add_currency_by_admin: this.txFromJSON<null>,
    remove_currency_by_admin: this.txFromJSON<null>,
    get_supported_currencies: this.txFromJSON<Array<string>>,
    is_currency_supported: this.txFromJSON<boolean>,
    get_withdraw_currency: this.txFromJSON<Option<string>>,
    set_withdraw_currency_by_admin: this.txFromJSON<null>,
    get_shares_token: this.txFromJSON<string>,
    set_withdraw_verifier_by_admin: this.txFromJSON<null>,
    set_oracle_by_admin: this.txFromJSON<null>,
    set_treasurer_by_admin: this.txFromJSON<null>,
    set_deposit_fee_ratio_by_admin: this.txFromJSON<null>,
    set_withdraw_fee_ratio_by_admin: this.txFromJSON<null>,
    set_withdraw_fee_recv_by_admin: this.txFromJSON<null>,
    get_admin: this.txFromJSON<string>,
    get_withdraw_verifier: this.txFromJSON<Buffer>,
    get_oracle: this.txFromJSON<string>,
    get_treasurer: this.txFromJSON<string>,
    get_withdraw_fee_ratio: this.txFromJSON<i128>,
    get_deposit_fee_ratio: this.txFromJSON<i128>,
    get_eip712_domain_name: this.txFromJSON<string>,
    get_eip712_domain_version: this.txFromJSON<string>,
    get_eip712_chain_id: this.txFromJSON<Buffer>,
    get_eip712_domain_separator: this.txFromJSON<Buffer>,
    get_withdraw_fee_receiver: this.txFromJSON<string>,
    get_owner: this.txFromJSON<Option<string>>,
    transfer_ownership: this.txFromJSON<null>,
    accept_ownership: this.txFromJSON<null>,
    renounce_ownership: this.txFromJSON<null>
  }
}