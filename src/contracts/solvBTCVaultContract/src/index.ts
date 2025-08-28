import { Buffer } from 'buffer';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type { u64, i128, Option } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractId: 'CC67HMWXFGQ3GL6L3YKPQWXCDDZYGA4FKDET5ZV467E4ARQDWCDNTLIX',
  },
} as const;

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
export type DataKey =
  | { tag: 'Admin'; values: void }
  | { tag: 'Initialized'; values: void }
  | { tag: 'Oracle'; values: void }
  | { tag: 'Treasurer'; values: void }
  | { tag: 'WithdrawVerifier'; values: void }
  | { tag: 'TokenContract'; values: void }
  | { tag: 'AllowedCurrency'; values: void }
  | { tag: 'DepositFeeRatio'; values: void }
  | { tag: 'WithdrawCurrency'; values: void }
  | { tag: 'WithdrawFeeRatio'; values: void }
  | { tag: 'WithdrawFeeReceiver'; values: void }
  | { tag: 'WithdrawRequestStatus'; values: void }
  | { tag: 'EIP712DomainName'; values: void }
  | { tag: 'EIP712DomainVersion'; values: void }
  | { tag: 'UsedRequestHash'; values: readonly [Buffer] };

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
export const Errors = {
  /**
   * Permission insufficient
   */
  301: { message: 'Unauthorized' },

  /**
   * Invalid parameter
   */
  302: { message: 'InvalidArgument' },

  /**
   * Contract not initialized
   */
  303: { message: 'NotInitialized' },

  /**
   * Contract already initialized
   */
  304: { message: 'AlreadyInitialized' },

  /**
   * Currency not supported
   */
  305: { message: 'CurrencyNotAllowed' },

  /**
   * Exceeds maximum currency quantity
   */
  306: { message: 'TooManyCurrencies' },

  /**
   * Currency already exists
   */
  307: { message: 'CurrencyAlreadyExists' },

  /**
   * Currency does not exist
   */
  308: { message: 'CurrencyNotExists' },

  /**
   * Invalid amount
   */
  309: { message: 'InvalidAmount' },

  /**
   * Oracle not set
   */
  310: { message: 'OracleNotSet' },

  /**
   * Deposit fee ratio not set
   */
  311: { message: 'DepositFeeRatioNotSet' },

  /**
   * Treasurer not set
   */
  312: { message: 'TreasurerNotSet' },

  /**
   * Withdrawal verifier not set
   */
  313: { message: 'WithdrawVerifierNotSet' },

  /**
   * Withdrawal currency not set
   */
  314: { message: 'WithdrawCurrencyNotSet' },

  /**
   * Signature verification failed
   */
  315: { message: 'InvalidSignature' },

  /**
   * Request hash already used
   */
  316: { message: 'RequestHashAlreadyUsed' },

  /**
   * Invalid NAV
   */
  317: { message: 'InvalidNav' },

  /**
   * Withdraw fee ratio not set
   */
  318: { message: 'WithdrawFeeRatioNotSet' },

  /**
   * Invalid withdraw fee ratio
   */
  319: { message: 'InvalidWithdrawFeeRatio' },

  /**
   * Withdraw fee receiver address not set
   */
  320: { message: 'WithdrawFeeReceiverNotSet' },

  /**
   * NAV value expired
   */
  321: { message: 'StaleNavValue' },

  /**
   * Invalid fee amount
   */
  322: { message: 'InvalidFeeAmount' },

  /**
   * Token contract not set
   */
  323: { message: 'TokenContractNotSet' },

  /**
   * Invalid signature format
   */
  324: { message: 'InvalidSignatureFormat' },

  /**
   * Request already exists
   */
  325: { message: 'RequestAlreadyExists' },

  /**
   * Insufficient balance
   */
  326: { message: 'InsufficientBalance' },

  /**
   * Invalid request status
   */
  327: { message: 'InvalidRequestStatus' },

  /**
   * Invalid deposit fee ratio
   */
  328: { message: 'InvalidDepositFeeRatio' },
};
export enum WithdrawStatus {
  NotExist = 0,
  Pending = 1,
  Done = 2,
}

export interface SolvBTCVaultClient {
  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Upgrade the contract with a new WASM hash
   */
  upgrade: (
    { new_wasm_hash }: { new_wasm_hash: Buffer },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: (
    {
      from,
      currency,
      amount,
    }: { from: string; currency: string; amount: i128 },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a withdraw_request transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_request: (
    {
      from,
      shares,
      request_hash,
    }: { from: string; shares: i128; request_hash: Buffer },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw: (
    {
      from,
      shares,
      nav,
      request_hash,
      signature,
    }: {
      from: string;
      shares: i128;
      nav: i128;
      request_hash: Buffer;
      signature: Buffer;
    },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a treasurer_deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  treasurer_deposit: (
    { amount }: { amount: i128 },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a add_currency_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_currency_by_admin: (
    { currency }: { currency: string },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a remove_currency_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_currency_by_admin: (
    { currency }: { currency: string },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

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
  }) => Promise<AssembledTransaction<Array<string>>>;

  /**
   * Construct and simulate a is_currency_supported transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_currency_supported: (
    { currency }: { currency: string },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<boolean>>;

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
  }) => Promise<AssembledTransaction<Option<string>>>;

  /**
   * Construct and simulate a set_withdraw_verifier_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_withdraw_verifier_by_admin: (
    { verifier_address }: { verifier_address: string },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a set_oracle_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_oracle_by_admin: (
    { oracle }: { oracle: string },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a set_treasurer_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_treasurer_by_admin: (
    { treasurer }: { treasurer: string },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a set_deposit_fee_ratio_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_deposit_fee_ratio_by_admin: (
    { deposit_fee_ratio }: { deposit_fee_ratio: i128 },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a set_withdraw_fee_ratio_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_withdraw_fee_ratio_by_admin: (
    { withdraw_fee_ratio }: { withdraw_fee_ratio: i128 },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a set_withdraw_fee_recv_by_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_withdraw_fee_recv_by_admin: (
    { withdraw_fee_receiver }: { withdraw_fee_receiver: string },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  admin: (options?: {
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
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a get_withdraw_verifier transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_withdraw_verifier: (options?: {
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
  }) => Promise<AssembledTransaction<string>>;

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
  }) => Promise<AssembledTransaction<string>>;

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
  }) => Promise<AssembledTransaction<string>>;

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
  }) => Promise<AssembledTransaction<i128>>;

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
  }) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a is_initialized transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_initialized: (options?: {
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
  }) => Promise<AssembledTransaction<boolean>>;

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
  }) => Promise<AssembledTransaction<string>>;

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
  }) => Promise<AssembledTransaction<string>>;

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
  }) => Promise<AssembledTransaction<Buffer>>;

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
  }) => Promise<AssembledTransaction<Buffer>>;

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
  }) => Promise<AssembledTransaction<string>>;
}
export class SolvBTCVaultClient extends ContractClient {
  static async deploy<T = SolvBTCVaultClient>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    {
      admin,
      token_contract,
      oracle,
      treasurer,
      withdraw_verifier,
      deposit_fee_ratio,
      withdraw_fee_ratio,
      withdraw_fee_receiver,
      withdraw_currency,
    }: {
      admin: string;
      token_contract: string;
      oracle: string;
      treasurer: string;
      withdraw_verifier: string;
      deposit_fee_ratio: i128;
      withdraw_fee_ratio: i128;
      withdraw_fee_receiver: string;
      withdraw_currency: string;
    },
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, 'contractId'> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: 'hex' | 'base64';
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(
      {
        admin,
        token_contract,
        oracle,
        treasurer,
        withdraw_verifier,
        deposit_fee_ratio,
        withdraw_fee_ratio,
        withdraw_fee_receiver,
        withdraw_currency,
      },
      options
    );
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        'AAAAAQAAADNFSVA3MTIgc2lnbmF0dXJlIGRhdGEgc3RydWN0dXJlOiB3aXRoZHJhd2FsIHJlcXVlc3QAAAAAAAAAAA9XaXRoZHJhd1JlcXVlc3QAAAAABgAAAAAAAAADbmF2AAAAAAsAAAAAAAAADHJlcXVlc3RfaGFzaAAAAA4AAAAAAAAACXNpZ25hdHVyZQAAAAAAAA4AAAAAAAAADXRhcmdldF9hbW91bnQAAAAAAAALAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAGAAAAAAAAAAR1c2VyAAAAEw==',
        'AAAAAQAAAA1EZXBvc2l0IGV2ZW50AAAAAAAAAAAAAAxEZXBvc2l0RXZlbnQAAAADAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAADW1pbnRlZF90b2tlbnMAAAAAAAALAAAAAAAAAANuYXYAAAAACw==',
        'AAAAAQAAABBXaXRoZHJhd2FsIGV2ZW50AAAAAAAAAA1XaXRoZHJhd0V2ZW50AAAAAAAAAgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAANmZWUAAAAACw==',
        'AAAAAQAAABRDdXJyZW5jeSBhZGRlZCBldmVudAAAAAAAAAAXU2V0QWxsb3dlZEN1cnJlbmN5RXZlbnQAAAAAAQAAAAAAAAAHYWxsb3dlZAAAAAAB',
        'AAAAAQAAABZDdXJyZW5jeSByZW1vdmVkIGV2ZW50AAAAAAAAAAAAFEN1cnJlbmN5UmVtb3ZlZEV2ZW50AAAAAQAAAAAAAAAFYWRtaW4AAAAAAAAT',
        'AAAAAQAAABZXaXRoZHJhdyByZXF1ZXN0IGV2ZW50AAAAAAAAAAAAFFdpdGhkcmF3UmVxdWVzdEV2ZW50AAAABAAAAAAAAAADbmF2AAAAAAsAAAAAAAAADHJlcXVlc3RfaGFzaAAAAA4AAAAAAAAABnNoYXJlcwAAAAAACwAAAAAAAAAOdG9rZW5fY29udHJhY3QAAAAAABM=',
        'AAAAAQAAABdUcmVhc3VyZXIgZGVwb3NpdCBldmVudAAAAAAAAAAAFVRyZWFzdXJlckRlcG9zaXRFdmVudAAAAAAAAAEAAAAAAAAABmFtb3VudAAAAAAACw==',
        'AAAAAgAAABVTdG9yYWdlIGRhdGEga2V5IGVudW0AAAAAAAAAAAAAB0RhdGFLZXkAAAAADwAAAAAAAAAOQ29udHJhY3QgYWRtaW4AAAAAAAVBZG1pbgAAAAAAAAAAAAAVSW5pdGlhbGl6YXRpb24gc3RhdHVzAAAAAAAAC0luaXRpYWxpemVkAAAAAAAAAAAXT3JhY2xlIGNvbnRyYWN0IGFkZHJlc3MAAAAABk9yYWNsZQAAAAAAAAAAABFUcmVhc3VyZXIgYWRkcmVzcwAAAAAAAAlUcmVhc3VyZXIAAAAAAAAAAAAAG1dpdGhkcmF3YWwgdmVyaWZpZXIgYWRkcmVzcwAAAAAQV2l0aGRyYXdWZXJpZmllcgAAAAAAAAAWVG9rZW4gY29udHJhY3QgYWRkcmVzcwAAAAAADVRva2VuQ29udHJhY3QAAAAAAAAAAAAAMVN1cHBvcnRlZCBjdXJyZW5jaWVzIG1hcHBpbmcgKE1hcDxBZGRyZXNzLCBib29sPikAAAAAAAAPQWxsb3dlZEN1cnJlbmN5AAAAAAAAAAARRGVwb3NpdCBmZWUgcmF0aW8AAAAAAAAPRGVwb3NpdEZlZVJhdGlvAAAAAAAAAAATV2l0aGRyYXdhbCBjdXJyZW5jeQAAAAAQV2l0aGRyYXdDdXJyZW5jeQAAAAAAAAAUV2l0aGRyYXdhbCBmZWUgcmF0aW8AAAAQV2l0aGRyYXdGZWVSYXRpbwAAAAAAAAAdV2l0aGRyYXcgZmVlIHJlY2VpdmVyIGFkZHJlc3MAAAAAAAATV2l0aGRyYXdGZWVSZWNlaXZlcgAAAAAAAAAAGVdpdGhkcmF3YWwgcmVxdWVzdCBzdGF0dXMAAAAAAAAVV2l0aGRyYXdSZXF1ZXN0U3RhdHVzAAAAAAAAAAAAABJFSVA3MTIgRG9tYWluIG5hbWUAAAAAABBFSVA3MTJEb21haW5OYW1lAAAAAAAAABVFSVA3MTIgRG9tYWluIHZlcnNpb24AAAAAAAATRUlQNzEyRG9tYWluVmVyc2lvbgAAAAABAAAAGVVzZWQgcmVxdWVzdCBoYXNoIG1hcHBpbmcAAAAAAAAPVXNlZFJlcXVlc3RIYXNoAAAAAAEAAAAO',
        'AAAAAQAAAAAAAAAAAAAADEVJUDcxMkRvbWFpbgAAAAUAAAAAAAAACGNoYWluX2lkAAAADgAAAAAAAAAEbmFtZQAAABAAAAAAAAAABHNhbHQAAAAOAAAAAAAAABJ2ZXJpZnlpbmdfY29udHJhY3QAAAAAABMAAAAAAAAAB3ZlcnNpb24AAAAAEA==',
        'AAAABAAAABVFcnJvciBjb2RlIGRlZmluaXRpb24AAAAAAAAAAAAAClZhdWx0RXJyb3IAAAAAABwAAAAXUGVybWlzc2lvbiBpbnN1ZmZpY2llbnQAAAAADFVuYXV0aG9yaXplZAAAAS0AAAARSW52YWxpZCBwYXJhbWV0ZXIAAAAAAAAPSW52YWxpZEFyZ3VtZW50AAAAAS4AAAAYQ29udHJhY3Qgbm90IGluaXRpYWxpemVkAAAADk5vdEluaXRpYWxpemVkAAAAAAEvAAAAHENvbnRyYWN0IGFscmVhZHkgaW5pdGlhbGl6ZWQAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAEwAAAAFkN1cnJlbmN5IG5vdCBzdXBwb3J0ZWQAAAAAABJDdXJyZW5jeU5vdEFsbG93ZWQAAAAAATEAAAAhRXhjZWVkcyBtYXhpbXVtIGN1cnJlbmN5IHF1YW50aXR5AAAAAAAAEVRvb01hbnlDdXJyZW5jaWVzAAAAAAABMgAAABdDdXJyZW5jeSBhbHJlYWR5IGV4aXN0cwAAAAAVQ3VycmVuY3lBbHJlYWR5RXhpc3RzAAAAAAABMwAAABdDdXJyZW5jeSBkb2VzIG5vdCBleGlzdAAAAAARQ3VycmVuY3lOb3RFeGlzdHMAAAAAAAE0AAAADkludmFsaWQgYW1vdW50AAAAAAANSW52YWxpZEFtb3VudAAAAAAAATUAAAAOT3JhY2xlIG5vdCBzZXQAAAAAAAxPcmFjbGVOb3RTZXQAAAE2AAAAGURlcG9zaXQgZmVlIHJhdGlvIG5vdCBzZXQAAAAAAAAVRGVwb3NpdEZlZVJhdGlvTm90U2V0AAAAAAABNwAAABFUcmVhc3VyZXIgbm90IHNldAAAAAAAAA9UcmVhc3VyZXJOb3RTZXQAAAABOAAAABtXaXRoZHJhd2FsIHZlcmlmaWVyIG5vdCBzZXQAAAAAFldpdGhkcmF3VmVyaWZpZXJOb3RTZXQAAAAAATkAAAAbV2l0aGRyYXdhbCBjdXJyZW5jeSBub3Qgc2V0AAAAABZXaXRoZHJhd0N1cnJlbmN5Tm90U2V0AAAAAAE6AAAAHVNpZ25hdHVyZSB2ZXJpZmljYXRpb24gZmFpbGVkAAAAAAAAEEludmFsaWRTaWduYXR1cmUAAAE7AAAAGVJlcXVlc3QgaGFzaCBhbHJlYWR5IHVzZWQAAAAAAAAWUmVxdWVzdEhhc2hBbHJlYWR5VXNlZAAAAAABPAAAAAtJbnZhbGlkIE5BVgAAAAAKSW52YWxpZE5hdgAAAAABPQAAABpXaXRoZHJhdyBmZWUgcmF0aW8gbm90IHNldAAAAAAAFldpdGhkcmF3RmVlUmF0aW9Ob3RTZXQAAAAAAT4AAAAaSW52YWxpZCB3aXRoZHJhdyBmZWUgcmF0aW8AAAAAABdJbnZhbGlkV2l0aGRyYXdGZWVSYXRpbwAAAAE/AAAAJVdpdGhkcmF3IGZlZSByZWNlaXZlciBhZGRyZXNzIG5vdCBzZXQAAAAAAAAZV2l0aGRyYXdGZWVSZWNlaXZlck5vdFNldAAAAAAAAUAAAAARTkFWIHZhbHVlIGV4cGlyZWQAAAAAAAANU3RhbGVOYXZWYWx1ZQAAAAAAAUEAAAASSW52YWxpZCBmZWUgYW1vdW50AAAAAAAQSW52YWxpZEZlZUFtb3VudAAAAUIAAAAWVG9rZW4gY29udHJhY3Qgbm90IHNldAAAAAAAE1Rva2VuQ29udHJhY3ROb3RTZXQAAAABQwAAABhJbnZhbGlkIHNpZ25hdHVyZSBmb3JtYXQAAAAWSW52YWxpZFNpZ25hdHVyZUZvcm1hdAAAAAABRAAAABZSZXF1ZXN0IGFscmVhZHkgZXhpc3RzAAAAAAAUUmVxdWVzdEFscmVhZHlFeGlzdHMAAAFFAAAAFEluc3VmZmljaWVudCBiYWxhbmNlAAAAE0luc3VmZmljaWVudEJhbGFuY2UAAAABRgAAABZJbnZhbGlkIHJlcXVlc3Qgc3RhdHVzAAAAAAAUSW52YWxpZFJlcXVlc3RTdGF0dXMAAAFHAAAAGUludmFsaWQgZGVwb3NpdCBmZWUgcmF0aW8AAAAAAAAWSW52YWxpZERlcG9zaXRGZWVSYXRpbwAAAAABSA==',
        'AAAAAwAAAAAAAAAAAAAADldpdGhkcmF3U3RhdHVzAAAAAAADAAAAAAAAAAhOb3RFeGlzdAAAAAAAAAAAAAAAB1BlbmRpbmcAAAAAAQAAAAAAAAAERG9uZQAAAAI=',
        'AAAAAAAAAClVcGdyYWRlIHRoZSBjb250cmFjdCB3aXRoIGEgbmV3IFdBU00gaGFzaAAAAAAAAAd1cGdyYWRlAAAAAAEAAAAAAAAADW5ld193YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAA=',
        'AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAkAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAOdG9rZW5fY29udHJhY3QAAAAAABMAAAAAAAAABm9yYWNsZQAAAAAAEwAAAAAAAAAJdHJlYXN1cmVyAAAAAAAAEwAAAAAAAAARd2l0aGRyYXdfdmVyaWZpZXIAAAAAAAATAAAAAAAAABFkZXBvc2l0X2ZlZV9yYXRpbwAAAAAAAAsAAAAAAAAAEndpdGhkcmF3X2ZlZV9yYXRpbwAAAAAACwAAAAAAAAAVd2l0aGRyYXdfZmVlX3JlY2VpdmVyAAAAAAAAEwAAAAAAAAARd2l0aGRyYXdfY3VycmVuY3kAAAAAAAATAAAAAA==',
        'AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAIY3VycmVuY3kAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAACw==',
        'AAAAAAAAAAAAAAAQd2l0aGRyYXdfcmVxdWVzdAAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAZzaGFyZXMAAAAAAAsAAAAAAAAADHJlcXVlc3RfaGFzaAAAAA4AAAAA',
        'AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAFAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGc2hhcmVzAAAAAAALAAAAAAAAAANuYXYAAAAACwAAAAAAAAAMcmVxdWVzdF9oYXNoAAAADgAAAAAAAAAJc2lnbmF0dXJlAAAAAAAADgAAAAEAAAAL',
        'AAAAAAAAAAAAAAARdHJlYXN1cmVyX2RlcG9zaXQAAAAAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA',
        'AAAAAAAAAAAAAAAVYWRkX2N1cnJlbmN5X2J5X2FkbWluAAAAAAAAAQAAAAAAAAAIY3VycmVuY3kAAAATAAAAAA==',
        'AAAAAAAAAAAAAAAYcmVtb3ZlX2N1cnJlbmN5X2J5X2FkbWluAAAAAQAAAAAAAAAIY3VycmVuY3kAAAATAAAAAA==',
        'AAAAAAAAAAAAAAAYZ2V0X3N1cHBvcnRlZF9jdXJyZW5jaWVzAAAAAAAAAAEAAAPqAAAAEw==',
        'AAAAAAAAAAAAAAAVaXNfY3VycmVuY3lfc3VwcG9ydGVkAAAAAAAAAQAAAAAAAAAIY3VycmVuY3kAAAATAAAAAQAAAAE=',
        'AAAAAAAAAAAAAAAVZ2V0X3dpdGhkcmF3X2N1cnJlbmN5AAAAAAAAAAAAAAEAAAPoAAAAEw==',
        'AAAAAAAAAAAAAAAec2V0X3dpdGhkcmF3X3ZlcmlmaWVyX2J5X2FkbWluAAAAAAABAAAAAAAAABB2ZXJpZmllcl9hZGRyZXNzAAAAEwAAAAA=',
        'AAAAAAAAAAAAAAATc2V0X29yYWNsZV9ieV9hZG1pbgAAAAABAAAAAAAAAAZvcmFjbGUAAAAAABMAAAAA',
        'AAAAAAAAAAAAAAAWc2V0X3RyZWFzdXJlcl9ieV9hZG1pbgAAAAAAAQAAAAAAAAAJdHJlYXN1cmVyAAAAAAAAEwAAAAA=',
        'AAAAAAAAAAAAAAAec2V0X2RlcG9zaXRfZmVlX3JhdGlvX2J5X2FkbWluAAAAAAABAAAAAAAAABFkZXBvc2l0X2ZlZV9yYXRpbwAAAAAAAAsAAAAA',
        'AAAAAAAAAAAAAAAfc2V0X3dpdGhkcmF3X2ZlZV9yYXRpb19ieV9hZG1pbgAAAAABAAAAAAAAABJ3aXRoZHJhd19mZWVfcmF0aW8AAAAAAAsAAAAA',
        'AAAAAAAAAAAAAAAec2V0X3dpdGhkcmF3X2ZlZV9yZWN2X2J5X2FkbWluAAAAAAABAAAAAAAAABV3aXRoZHJhd19mZWVfcmVjZWl2ZXIAAAAAAAATAAAAAA==',
        'AAAAAAAAAAAAAAAFYWRtaW4AAAAAAAAAAAAAAQAAABM=',
        'AAAAAAAAAAAAAAAVZ2V0X3dpdGhkcmF3X3ZlcmlmaWVyAAAAAAAAAAAAAAEAAAAT',
        'AAAAAAAAAAAAAAAKZ2V0X29yYWNsZQAAAAAAAAAAAAEAAAAT',
        'AAAAAAAAAAAAAAANZ2V0X3RyZWFzdXJlcgAAAAAAAAAAAAABAAAAEw==',
        'AAAAAAAAAAAAAAAWZ2V0X3dpdGhkcmF3X2ZlZV9yYXRpbwAAAAAAAAAAAAEAAAAL',
        'AAAAAAAAAAAAAAAVZ2V0X2RlcG9zaXRfZmVlX3JhdGlvAAAAAAAAAAAAAAEAAAAL',
        'AAAAAAAAAAAAAAAOaXNfaW5pdGlhbGl6ZWQAAAAAAAAAAAABAAAAAQ==',
        'AAAAAAAAAAAAAAAWZ2V0X2VpcDcxMl9kb21haW5fbmFtZQAAAAAAAAAAAAEAAAAQ',
        'AAAAAAAAAAAAAAAZZ2V0X2VpcDcxMl9kb21haW5fdmVyc2lvbgAAAAAAAAAAAAABAAAAEA==',
        'AAAAAAAAAAAAAAATZ2V0X2VpcDcxMl9jaGFpbl9pZAAAAAAAAAAAAQAAAA4=',
        'AAAAAAAAAAAAAAAbZ2V0X2VpcDcxMl9kb21haW5fc2VwYXJhdG9yAAAAAAAAAAABAAAADg==',
        'AAAAAAAAAAAAAAAZZ2V0X3dpdGhkcmF3X2ZlZV9yZWNlaXZlcgAAAAAAAAAAAAABAAAAEw==',
      ]),
      options
    );
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
    set_withdraw_verifier_by_admin: this.txFromJSON<null>,
    set_oracle_by_admin: this.txFromJSON<null>,
    set_treasurer_by_admin: this.txFromJSON<null>,
    set_deposit_fee_ratio_by_admin: this.txFromJSON<null>,
    set_withdraw_fee_ratio_by_admin: this.txFromJSON<null>,
    set_withdraw_fee_recv_by_admin: this.txFromJSON<null>,
    admin: this.txFromJSON<string>,
    get_withdraw_verifier: this.txFromJSON<string>,
    get_oracle: this.txFromJSON<string>,
    get_treasurer: this.txFromJSON<string>,
    get_withdraw_fee_ratio: this.txFromJSON<i128>,
    get_deposit_fee_ratio: this.txFromJSON<i128>,
    is_initialized: this.txFromJSON<boolean>,
    get_eip712_domain_name: this.txFromJSON<string>,
    get_eip712_domain_version: this.txFromJSON<string>,
    get_eip712_chain_id: this.txFromJSON<Buffer>,
    get_eip712_domain_separator: this.txFromJSON<Buffer>,
    get_withdraw_fee_receiver: this.txFromJSON<string>,
  };
}
