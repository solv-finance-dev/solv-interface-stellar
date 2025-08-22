export interface SolvInfo {
  title: string;
  content: string;
}

export type LoginInput = {
  message: string;
  signature: string;
  address: string;
  chainId: number;
  accountType?: string | null;
  safeMessageHash?: string | null;
};

export type AccountInfo = {
  __typename: "AccountInfo";
  id?: number | null;
  address?: string | null;
  // latestLoginId: Int
  username?: string | null;
  ensName?: string | null;
  avatar?: string | null;
  isIssuer?: boolean | null;
  bio?: string | null;
  // email: String
  // twitter: String
  // discord: String
  needBind?: boolean | null;
  createdAt: string;
  updatedAt: string;
};

export type IssueInput = {
  issuerAddress?: string | null;
  chainId?: number | null;
  contractAddress?: string | null;
  slot?: string | null;
  interestType?: string | null;
  convertibility?: boolean | null;
  creditType?: string | null;
  issueSize?: string | null;
  currency?: string | null;
  valueDate?: number | null;
  term?: number | null;
  maturityDate?: number | null;
  couponRate?: string | null;
  expectedRepayment?: string | null;
  // fee: String
  isTransferable?: boolean | null;
  imageUrl?: string | null;
  name?: string | null;
  description?: string | null;
  startSaleTime?: number | null;
  endSaleTime?: number | null;
  receivingAddress?: string | null;
  maxBuyLimit?: string | null;
  minBuyLimit?: string | null;
  whitelist?: Array<string | null> | null;
  fundType?: string | null;
  supervisorId?: number | null;
  carriedInterest?: string | null;
};

export type BondInfo = {
  __typename: "BondInfo";
  id: number;
  productInfo?: ProductInfo | null;
  issuerInfo?: IssuerInfo | null;
  issuances?: Array<Issuance | null> | null;
  interestType?: string | null;
  convertibility?: boolean | null;
  creditType?: string | null;
  currencyInfo?: Currency | null;
  term?: number | null;
  couponRate?: string | null;
  valueDate?: number | null;
  maturityDate?: number | null;
  issueSize?: string | null;
  totalValue?: string | null;
  isTransferable?: boolean | null;
  expectedToPay?: string | null;
  repaidValue?: string | null;
  claimedValue?: string | null;
  repayInfos?: Array<RepayInfo | null> | null;
  // todo
  // imageUrl: String
  extraInfo?: string | null;
  payoffDate?: number | null;
  fundType?: string | null;
  showNav?: boolean | null;
  supervisorInfo?: SupervisorInfo | null;
  carriedInterest?: string | null;
  isInterestRateSet?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ProductInfo = {
  __typename: "ProductInfo";
  id: number;
  chainId?: number | null;
  contractInfo?: ContractInfo | null;
  // contractType: String
  productType?: string | null;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  properties?: string | null;
  slot?: string | null;
  symbol?: string | null;
  createTxHash?: string | null;
  txStatus?: string | null;
  tags?: Array<Tag | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ContractInfo = {
  __typename: "ContractInfo";
  id: number;
  contractAddress?: string | null;
  contractType?: string | null;
  chainId: number;
  productType?: string | null;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  externalLink?: string | null;
  decimals?: number | null;
  symbol?: string | null;
  totalSupply?: string | null;
  properties?: string | null;
  owner?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  fee?: string | null;
  currencies?: Array<Currency | null> | null;
};

export type Currency = {
  __typename: "Currency";
  symbol?: string | null;
  currencyAddress?: string | null;
  decimals?: number | null;
};

export type Tag = {
  __typename: "Tag";
  tag?: string | null;
};

export type IssuerInfo = {
  __typename: "IssuerInfo";
  id: number;
  accountInfo?: AccountInfo | null;
  category?: string | null;
  // institutionUrl: String
  description?: string | null;
  isKyb?: boolean | null;
  kybInfo?: string | null;
  creator?: string | null;
  extraInfo?: string | null;
  state?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type Issuance = {
  __typename: "Issuance";
  id: number;
  // productInfo: ProductInfo
  // issuerInfo: IssuerInfo
  chainId?: number | null;
  // marketInfo: MarketInfo
  startSaleTime?: number | null;
  endSaleTime?: number | null;
  receivingAddress?: string | null;
  isWhitelisted?: boolean | null;
  underwriterIssuance?: string | null;
  issueSize?: string | null;
  remainingSize?: string | null;
  priceType?: string | null;
  priceInfo?: string | null;
  maxBuyLimit?: string | null;
  minBuyLimit?: string | null;
  // isVisible: Boolean
  auditStatus?: string | null;
  isUnlisted?: boolean | null;
  whitelist?: string | null;
  createTxHash?: string | null;
  txStatus?: string | null;
  issuePrice?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RepayInfo = {
  __typename: "RepayInfo";
  id: number;
  address?: string | null;
  repayValue?: string | null;
  repayDate?: number | null;
  txHash?: string | null;
  transactionIndex?: number | null;
  eventIndex?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type SupervisorInfo = {
  __typename: "SupervisorInfo";
  id: number;
  name?: string | null;
  label?: string | null;
  address?: string | null;
  chainId?: number | null;
  state?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AfterIssueInput = {
  bondId?: number | null;
  txHash?: string | null;
  txStatus?: string | null;
};

export type IssuerInput = {
  address?: string | null;
  avatar?: string | null;
  // username: String
  description?: string | null;
  bio?: string | null;
  email?: string | null;
  twitter?: string | null;
  // web url#
  institutionUrl?: string | null;
};

export type UserInput = {
  address?: string | null;
  avatar?: string | null;
  username?: string | null;
  bio?: string | null;
  email?: string | null;
  twitter?: string | null;
};

export type ImageInput = {
  fileName?: string | null;
};

export type UpdateInput = {
  address?: string | null;
  key?: string | null;
};

export type PoolInput = {
  issuerAddress?: string | null;
  chainId?: number | null;
  marketContractAddress?: string | null;
  openFundShare?: string | null;
  fundType?: string | null;
  interestType?: string | null;
  supervisorId?: number | null;
  slot?: string | null;
  vault?: string | null;
  hardCap?: string | null;
  softCap?: string | null;
  currency?: string | null;
  fundraisingStartTime?: number | null;
  valueDate?: number | null;
  fundraisingEndTime?: number | null;
  subscribeMin?: string | null;
  subscribeMax?: string | null;
  whitelist?: Array<string | null> | null;
  openFundRedemption?: string | null;
  redemptionPeriod?: number | null;
  navOracle?: string | null;
  navManager?: string | null;
  redeemNavManager?: string | null;
  carryRate?: string | null;
  name?: string | null;
  estimatedAprMin?: string | null;
  estimatedAprMax?: string | null;
  description?: string | null;
  carryCollector?: string | null;
};

export type PoolSlotInfo = {
  __typename: "PoolSlotInfo";
  id: number;
  productInfo?: ProductInfo | null;
  issuerInfo?: IssuerInfo | null;
  poolOrderInfo?: PoolOrderInfo | null;
  supervisorInfo?: SupervisorInfo | null;
  currencyInfo?: Currency | null;
  fundType?: string | null;
  interestType?: string | null;
  maturityDate?: number | null;
  redemptionPeriod?: number | null;
  isTransferable?: boolean | null;
  // fundraisingStartTime: Int
  // fundraisingEndTime: Int
  totalAmount?: string | null;
  // repaidValue: String
  // claimedValue: String
  nav?: string | null;
  apy?: string | null;
  historyApy?: string | null;
  aum?: string | null;
  couponRate?: string | null;
  isInterestRateSet?: boolean | null;
  totalRepaidValue?: string | null;
  manualOrder?: number | null;
  compositeIcon?: string | null;
  additionalRewards?: string | null;
  subtype?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  pointRatio?: string | null;
  isYieldPool?: boolean | null;
  yieldType?: string | null;
  aumUSD?: string | null;
  isUpgradedRouterV2?: boolean | null;
};

export type PoolOrderInfo = {
  __typename: "PoolOrderInfo";
  id: number;
  poolId?: string | null;
  marketInfo?: MarketInfo | null;
  openFundShare?: string | null;
  openFundRedemption?: string | null;
  openFundShareSlot?: string | null;
  latestRedeemSlot?: string | null;
  carryRate?: string | null;
  carryCollector?: string | null;
  latestProtocolFeeSettleTime?: number | null;
  poolManager?: string | null;
  subscribeNavManager?: string | null;
  redeemNavManager?: string | null;
  hardCap?: string | null;
  softCap?: string | null;
  subscribeMin?: string | null;
  subscribeMax?: string | null;
  fundraisingStartTime?: number | null;
  fundraisingEndTime?: number | null;
  vault?: string | null;
  currency?: string | null;
  navOracle?: string | null;
  valueDate?: number | null;
  permissionless?: boolean | null;
  fundraisingAmount?: string | null;
  whitelist?: string | null;
  poolStatus?: string | null;
  auditStatus?: string | null;
  isUnlisted?: boolean | null;
  createTxHash?: string | null;
  txStatus?: string | null;
  estimatedAprMin?: string | null;
  estimatedAprMax?: string | null;
  highWatermark?: string | null;
  poolStrategies?: Array<PoolStrategy | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type MarketInfo = {
  __typename: "MarketInfo";
  id: number;
  name?: string | null;
  chainId?: number | null;
  marketType?: string | null;
  protocolFeeRate?: string | null;
  contractAddress?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type PoolStrategy = {
  __typename: "PoolStrategy";
  id: number;
  strategyInfo?: Strategies | null;
};

export type Strategies = {
  __typename: "Strategies";
  id: number;
  strategy?: string | null;
  label?: string | null;
  color?: string | null;
  subcolor?: string | null;
  icon?: string | null;
  description?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AfterCreatePoolInput = {
  poolSlotInfoId?: number | null;
  txHash?: string | null;
  txStatus?: string | null;
};

export type OriginalNavInput = {
  poolId?: string | null;
  navDate?: number | null;
  originalNav?: string | null;
  nav?: string | null;
};

export type OriginalNavInfo = {
  __typename: "OriginalNavInfo";
  id: number;
  poolId?: string | null;
  navDate?: number | null;
  originalNav?: string | null;
  nav?: string | null;
  txHash?: string | null;
};

export type OriginalNavUpdateInput = {
  originalNavId?: number | null;
  txHash?: string | null;
};

export type ReferralInput = {
  address?: string | null;
  message?: string | null;
  signature?: string | null;
  referralCode?: string | null;
  chainId: number;
  accountType?: string | null;
  safeMessageHash?: string | null;
};

export type ReferralInfo = {
  __typename: "ReferralInfo";
  id?: number | null;
  referralCode?: string | null;
  userAddress?: string | null;
  bindTime?: string | null;
  state?: string | null;
};

export type PointSysBindRegInput = {
  address?: string | null;
  inviteCode?: string | null;
  twitterAuthCode?: string | null;
  signature?: string | null;
  chainId?: number | null;
  accountType?: string | null;
  safeMessageHash?: string | null;
};

export type PointSysAccountInfo = {
  __typename: "PointSysAccountInfo";
  address?: string | null;
  isRegistered?: boolean | null;
  seedUserInviteCode?: string | null;
  inviteCode?: string | null;
  inviteCount?: number | null;
  totalPointsEarned?: string | null;
  availablePoints?: string | null;
  isPointsAccelerationActive?: boolean | null;
  todayHoldingTVL?: string | null;
  todayHoldingAccelerationRatio?: string | null;
  isHighestLevel?: boolean | null;
  nextLevelHoldingTVL?: string | null;
  nextLevelHoldingAccelerationRatio?: string | null;
  activityCards?: Array<PointSysActivityCard | null> | null;
};

export type PointSysActivityCard = {
  __typename: "PointSysActivityCard";
  type?: string | null;
  accelerationRatio?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

export type WalletInfoInput = {
  chainId?: number | null;
  userAddress?: string | null;
  txHash?: string | null;
  walletType?: string | null;
};

export type WalletInfo = {
  __typename: "WalletInfo";
  chainId?: number | null;
  userAddress?: string | null;
  txHash?: string | null;
  walletType?: string | null;
  recordDate?: string | null;
};

export type BtcRecordsInput = {
  depositAmount?: string | null;
  depositHash?: string | null;
  depositFromAddress?: string | null;
  transferToAddress?: string | null;
  chain?: string | null;
  state?: string | null;
  mintHash?: string | null;
  transferHash?: string | null;
  createTime?: string | null;
};

export type BtcDepositMintRecord = {
  __typename: "BtcDepositMintRecord";
  id: number;
  depositAmount?: string | null;
  depositHash?: string | null;
  depositFromAddress?: string | null;
  transferToAddress?: string | null;
  chain?: string | null;
  state?: string | null;
  mintHash?: string | null;
  transferHash?: string | null;
  createTime?: string | null;
  btcContractAddress?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type BtcStakeRecordsInput = {
  recordType: string;
  chainId: number;
  poolId: string;
  depositAmount: string;
  depositTxHash: string;
  depositFromAddress: string;
  depositToAddress: string;
  transferToAddress?: string | null;
};

export type BtcStakeRecord = {
  __typename: "BtcStakeRecord";
  id: number;
  chainId: number;
  poolId: string;
  recordType: string;
  depositAmount: string;
  depositTxHash: string;
  depositFromAddress: string;
  depositToAddress: string;
  transferToAddress?: string | null;
  createdAt?: string | null;
};

export type UpdateBtcStakeRecordInput = {
  // depositAmount: String!
  depositTxHash: string;
  depositToAddress: string;
  transferToAddress?: string | null;
};

export type BtcMintRegisterInput = {
  btcAddress: string;
  poolId: string;
  chainId: number;
  evmAddress: string;
};

export type BtcMintRegisterInfo = {
  __typename: "BtcMintRegisterInfo";
  id?: number | null;
  btcAddress?: string | null;
  chainId?: number | null;
  tokenAddress?: string | null;
  evmAddress?: string | null;
  opReturnHash?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type EvmBabylonConnectionInput = {
  chainId: number;
  accountType: string;
  evmAddress: string;
  babylonAddress: string;
  signature: string;
  safeMessageHash?: string | null;
};

export type EvmBabylonConnectionInfo = {
  __typename: "EvmBabylonConnectionInfo";
  evmAddress?: string | null;
  babylonAddress?: string | null;
  signMessage?: string | null;
  signature?: string | null;
};

export type InstitutionalRecordsInput = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  emailAddress: string;
  telegram: string;
  subject: string;
  message: string;
};

export type NewsletterRecordsInput = {
  emailAddress: string;
};

export type LoginMessage = {
  __typename: "LoginMessage";
  message: string;
};

export type Filter = {
  address?: string | null;
  isIssuer?: boolean | null;
  createdAt?: FilterInput | null;
  or?: string | null;
};

export type FilterInput = {
  lt?: number | null;
  gt?: number | null;
};

export type Pagination = {
  offset?: number | null;
  limit?: number | null;
};

export type Sort = {
  field?: string | null;
  direction?: string | null;
};

export type Accounts = {
  __typename: "Accounts";
  totalCount?: number | null;
  accountsInfo: Array<AccountInfo>;
};

export type IssuanceFilter = {
  bondId?: number | null;
  issuerId?: number | null;
  payables?: Array<string | null> | null;
  // todo
  saleStatus?: Array<string | null> | null;
  // todo
  interestType?: Array<string | null> | null;
  // todo
  term?: Array<TermFilter | null> | null;
  currency?: Array<string | null> | null;
  chainId?: Array<number | null> | null;
  auditStatus?: string | null;
  isUnlisted?: boolean | null;
  totalValue?: totalValueFilter | null;
};

export type TermFilter = {
  gte?: number | null;
  lt?: number | null;
};

export type totalValueFilter = {
  gt?: number | null;
};

export type Bonds = {
  __typename: "Bonds";
  totalCount: number;
  bondsInfo: Array<BondInfo>;
};

export type AssetFilter = {
  holder?: string | null;
  saleStatus?: Array<string | null> | null;
  name?: Array<string | null> | null;
  chainId?: Array<number | null> | null;
  productType?: Array<string | null> | null;
  poolId?: string | null;
  slot?: string | null;
};

export type Assets = {
  __typename: "Assets";
  totalCount?: number | null;
  assetsInfo: Array<AssetInfo>;
};

export type AssetInfo = {
  __typename: "AssetInfo";
  id?: number | null;
  // 有的需要从bondInfo中拿
  poolSlotInfoId?: number | null;
  productInfo?: ProductInfo | null;
  holder?: string | null;
  tokenId?: string | null;
  chainId?: number | null;
  contractId?: number | null;
  contractAddress?: string | null;
  productType?: string | null;
  name?: string | null;
  description?: string | null;
  imageUri?: string | null;
  image?: string | null;
  // Amount#
  balance?: string | null;
  slot?: string | null;
  properties?: string | null;
  mintTime?: number | null;
  // isBurned: Boolean
  rate?: string | null;
  valueDate?: number | null;
  maturityDate?: number | null;
  bondId?: number | null;
  isTransferable?: boolean | null;
  currenyInfo?: Currency | null;
  term?: number | null;
  interestType?: string | null;
  isInterestRateSet?: boolean | null;
  // new add
  // claimableValue: String
  poolId?: string | null;
  nav?: string | null;
  redeemState?: string | null;
  redemptionPeriod?: number | null;
  subtype?: string | null;
  erc20TokenAddress?: string | null;
  isYieldPool?: boolean | null;
  routerContractAddress?: string | null;
  usdValue?: string | null;
  routerVersion?: string | null;
  yieldType?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type IssueContractInput = {
  issuerAddress?: string | null;
  chainId?: number | null;
  fundType?: string | null;
};

export type IssueContracts = {
  __typename: "IssueContracts";
  totalCount?: number | null;
  issueContracts?: Array<IssueContract | null> | null;
};

export type IssueContract = {
  __typename: "IssueContract";
  contractInfo?: ContractInfo | null;
};

export type RoadshowFilter = {
  roadshowType?: Array<string | null> | null;
  // 多选
  currency?: Array<string | null> | null;
  chainId?: Array<number | null> | null;
  requester?: string | null;
  state?: Array<string | null> | null;
};

export type Roadshows = {
  __typename: "Roadshows";
  totalCount?: number | null;
  roadshowsInfo: Array<Roadshow>;
};

export type Roadshow = {
  __typename: "Roadshow";
  id?: number | null;
  chainId?: number | null;
  roadshowType?: string | null;
  from?: string | null;
  creator?: string | null;
  amount?: string | null;
  currencySymbol?: string | null;
  targetApr?: string | null;
  description?: string | null;
  status?: string | null;
  inquireCount?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ActivityFilter = {
  slot?: string | null;
  poolId?: string | null;
  address?: string | null;
  activityType?: Array<string | null> | null;
  productName?: Array<string | null> | null;
  chainId?: Array<number | null> | null;
};

export type Activities = {
  __typename: "Activities";
  totalCount?: number | null;
  activitiesInfo: Array<Activity>;
};

export type Activity = {
  __typename: "Activity";
  id: number;
  chainId?: number | null;
  contractAddress?: string | null;
  tokenId?: string | null;
  txHash?: string | null;
  fromAddress?: string | null;
  toAddress?: string | null;
  amount?: string | null;
  decimals?: number | null;
  currencySymbol?: string | null;
  currencyDecimals?: number | null;
  slot?: string | null;
  transactionType?: string | null;
  productName?: string | null;
  blockTimestamp?: number | null;
  // transactionIndex: Int
  // eventIndex: Int
  // #activity#
  // eventName: String
  // # get amount from eventValue._value#
  // eventValue: AWSJSON
  lastUpdated?: number | null;
  nav?: string | null;
  poolId?: string | null;
  productType?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type IssuerStats = {
  __typename: "IssuerStats";
  totalIssued?: string | null;
  totalRepaid?: string | null;
  totalInterest?: string | null;
};

export type SupervisorFilter = {
  name?: string | null;
  label?: string | null;
  address?: string | null;
  chainId?: number | null;
  state?: string | null;
};

export type Supervisors = {
  __typename: "Supervisors";
  totalCount: number;
  supervisorsInfo: Array<SupervisorInfo>;
};

export type NavFilter = {
  bondId?: number | null;
};

export type NavInfo = {
  __typename: "NavInfo";
  bondId?: number | null;
  symbol?: string | null;
  serialData?: Array<NavData | null> | null;
};

export type NavData = {
  __typename: "NavData";
  nav?: string | null;
  yield?: string | null;
  fetchDate?: string | null;
};

export type MarketContractInfo = {
  __typename: "MarketContractInfo";
  marketContractAddress?: string | null;
  decimals?: number | null;
  defautFeeRate?: string | null;
};

export type PoolFilter = {
  poolSlotInfoId?: number | null;
  issuerId?: number | null;
  saleStatus?: Array<string | null> | null;
  // todo
  // interestType: [String] # todo
  // currency: [String]
  chainId?: Array<number | null> | null;
  auditStatus?: string | null;
  isUnlisted?: boolean | null;
  totalValue?: totalValueFilter | null;
  poolStatus?: string | null;
  subtype?: string | null;
  txStatus?: string | null;
  phase?: number | null;
};

export type Pools = {
  __typename: "Pools";
  totalCount: number;
  poolsInfo: Array<PoolSlotInfo>;
};

export type NavHistoryFilter = {
  poolSlotInfoId?: number | null;
  navType?: string | null;
};

export type NavHistoryInfo = {
  __typename: "NavHistoryInfo";
  totalCount?: number | null;
  poolSlotInfoId?: number | null;
  symbol?: string | null;
  currencyDecimals?: number | null;
  allTimeHigh?: string | null;
  serialData?: Array<NavHistoryData | null> | null;
};

export type NavHistoryData = {
  __typename: "NavHistoryData";
  nav?: string | null;
  adjustedNav?: string | null;
  navDate?: string | null;
};

export type NavOpenFundFilter = {
  poolSlotInfoId?: number | null;
  navType?: string | null;
  beginDate?: number | null;
  endDate?: number | null;
};

export type AssetsCountInfo = {
  __typename: "AssetsCountInfo";
  productType?: string | null;
  count?: number | null;
};

export type RedemptionFilter = {
  poolId?: string | null;
};

export type Redemptions = {
  __typename: "Redemptions";
  totalCount: number;
  redemptionsInfo: Array<RedeemInfo>;
};

export type RedeemInfo = {
  __typename: "RedeemInfo";
  id: number;
  poolId?: string | null;
  currencyInfo?: Currency | null;
  redeemSlot?: string | null;
  redeemAmount?: string | null;
  nav?: string | null;
  repaidValue?: string | null;
  claimedAmount?: string | null;
  state?: string | null;
  startTime?: number | null;
  orders?: number | null;
  performanceFee?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  contractAddress?: string | null;
};

export type Stats = {
  __typename: "Stats";
  totalAssetsValue?: string | null;
  totalBtcStaked?: string | null;
  totalBtcTvlUSD?: string | null;
  totalProducts?: number | null;
  totalUsers?: number | null;
};

export type AumFilter = {
  poolSlotInfoId?: number | null;
  beginDate?: number | null;
  endDate?: number | null;
};

export type AumHistoryInfo = {
  __typename: "AumHistoryInfo";
  totalCount?: number | null;
  totalShares?: string | null;
  investors?: number | null;
  poolSlotInfoId?: number | null;
  decimals?: number | null;
  symbol?: string | null;
  currencyDecimals?: number | null;
  serialData?: Array<AumHistoryData | null> | null;
};

export type AumHistoryData = {
  __typename: "AumHistoryData";
  aum?: string | null;
  nav?: string | null;
  fetchDate?: string | null;
};

export type NavRecordsFilter = {
  poolSlotInfoId: number;
  navType?: string | null;
};

export type NavRecordsInfo = {
  __typename: "NavRecordsInfo";
  totalCount?: number | null;
  symbol?: string | null;
  currencyDecimals?: number | null;
  serialData?: Array<NavRecordsData | null> | null;
};

export type NavRecordsData = {
  __typename: "NavRecordsData";
  nav?: string | null;
  navType?: string | null;
  time?: number | null;
};

export type CarryCollectorInfo = {
  __typename: "CarryCollectorInfo";
  id: number;
  chainId?: number | null;
  carryCollector?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AllocationInfo = {
  __typename: "AllocationInfo";
  name?: string | null;
  percentage?: string | null;
  value?: string | null;
  color?: string | null;
  subcolor?: string | null;
};

export type UserAssetsInfo = {
  __typename: "UserAssetsInfo";
  totalBalanceUSD?: string | null;
  assetsInfo?: Array<PoolAssetInfo | null> | null;
};

export type PoolAssetInfo = {
  __typename: "PoolAssetInfo";
  poolId?: string | null;
  balance?: string | null;
  // currencyPrice: String
  routerVersion?: string | null;
};

export type WrappedTokenInfo = {
  __typename: "WrappedTokenInfo";
  tokenAddress?: string | null;
  symbol?: string | null;
  decimals?: number | null;
  name?: string | null;
};

export type WrappedAssetFilter = {
  holder?: string | null;
  slot?: string | null;
};

export type WrappedAssets = {
  __typename: "WrappedAssets";
  totalCount?: number | null;
  wrappedAssets?: Array<WrappedAssetInfo | null> | null;
};

export type Allocation = {
  __typename: "Allocation";
  assetName?: string | null;
  percentage?: string | null;
  color?: string | null;
};

export type WrappedAssetInfo = {
  __typename: "WrappedAssetInfo";
  chainId?: number | null;
  tokenAddress?: string | null;
  holder?: string | null;
  symbol?: string | null;
  balance?: string | null;
  mintTime?: number | null;
  lastUpdated?: number | null;
  decimals?: number | null;
  sftAddress?: string | null;
  slot?: string | null;
  name?: string | null;
  nav?: string | null;
  routerContract?: string | null;
  poolId?: string | null;
  genesisDate?: number | null;
  currencyDecimals?: number | null;
  currencySymbol?: string | null;
  poolSlotInfoId?: number | null;
  isYieldPool?: boolean | null;
  usdValue?: string | null;
  fundraisingStartTime?: number | null;
  fundraisingEndTime?: number | null;
  maturityDate?: number | null;
  routerVersion?: string | null;
  yieldType?: string | null;
  xpoolAddress?: string | null;
};

export type PoolCurrencies = {
  __typename: "PoolCurrencies";
  totalCount?: number | null;
  currencies?: Array<PoolCurrencyInfo | null> | null;
};

export type PoolCurrencyInfo = {
  __typename: "PoolCurrencyInfo";
  chainId?: number | null;
  poolId?: string | null;
  currencyAddress?: string | null;
  symbol?: string | null;
  decimals?: number | null;
  isSupported?: boolean | null;
};

export type RouterContractInfo = {
  __typename: "RouterContractInfo";
  chainId?: number | null;
  contractAddress?: string | null;
};

export type MarketCoreData = {
  __typename: "MarketCoreData";
  totalValueLocked?: string | null;
  totalYieldGenerated?: string | null;
  totalUsers?: string | null;
  totalSolvBtcAmount?: string | null;
  totalSolvBTCTvl?: string | null;
  totalBabylonTvl?: string | null;
  totalBabylonAmount?: string | null;
  totalEthenaTvl?: string | null;
  totalEthenaAmount?: string | null;
  totalCoreTvl?: string | null;
  totalCoreAmount?: string | null;
  totalJupTvl?: string | null;
  totalJupAmount?: string | null;
  totalBeraTvl?: string | null;
  totalBeraAmount?: string | null;
  totalBnbTvl?: string | null;
  totalBnbAmount?: string | null;
  totalBTCStaked?: string | null;
  totalLSTTvl?: string | null;
  totalLSTAmount?: string | null;
  lastTime?: number | null;
};

export type PointSysRankingInfo = {
  __typename: "PointSysRankingInfo";
  address?: string | null;
  avatar?: string | null;
  username?: string | null;
  twitterUsername?: string | null;
  totalPointsEarned?: string | null;
  inviterAvatar?: string | null;
  inviterUsername?: string | null;
  inviterTwitterUsername?: string | null;
};

export type BTCStats = {
  __typename: "BTCStats";
  supportedChains?: Array<BtcFofInfo | null> | null;
  totalInvestors?: number | null;
  totalTvlUSD?: string | null;
  totalAmount?: string | null;
  totalSolvBtcAmount?: string | null;
  tvlDetail?: Array<TvlDetail | null> | null;
  detail?: Array<BTCDetail | null> | null;
};

export type BtcFofInfo = {
  __typename: "BtcFofInfo";
  chainId?: number | null;
  poolSlotInfoId?: number | null;
  order?: number | null;
};

export type TvlDetail = {
  __typename: "TvlDetail";
  chainId?: number | null;
  amount?: string | null;
  tvl?: string | null;
};

export type BTCDetail = {
  __typename: "BTCDetail";
  chainId?: number | null;
  slot?: string | null;
  symbol?: string | null;
  amount?: string | null;
  currentPrice?: string | null;
};

export type BTCTvlInfo = {
  __typename: "BTCTvlInfo";
  chainId?: number | null;
  tvl?: string | null;
  investors?: number | null;
};

export type BtcPoolInfo = {
  __typename: "BtcPoolInfo";
  poolInfo?: PoolSlotInfo | null;
  wrappedTokenInfo?: WrappedTokenInfo | null;
  routerContract?: RouterContractInfo | null;
  xpoolAddress?: string | null;
};

export type YieldPoolInfo = {
  __typename: "YieldPoolInfo";
  chainId?: number | null;
  poolSlotInfoId?: number | null;
  poolId?: string | null;
  tokenAddress?: string | null;
  routerContractAddress?: string | null;
  symbol?: string | null;
  decimals?: number | null;
  name?: string | null;
  slot?: string | null;
};

export type BtcMainnetInfo = {
  __typename: "BtcMainnetInfo";
  depositAddress?: string | null;
  depositNetwork?: string | null;
};

export type BtcWhitelistInfo = {
  __typename: "BtcWhitelistInfo";
  isBtcWhitelist: boolean;
  btcDepositPlatForm?: string | null;
  btcDepositAddress?: string | null;
};

export type DefiPointRatioInfo = {
  __typename: "DefiPointRatioInfo";
  chainId?: number | null;
  chainName?: string | null;
  protocol?: string | null;
  task?: string | null;
  // symbol: String
  // tokenAddress: String
  pointRatio?: number | null;
  url?: string | null;
  order?: number | null;
};

export type BtcYieldPoolInfo = {
  __typename: "BtcYieldPoolInfo";
  chainId?: number | null;
  poolSlotInfoId?: number | null;
  yieldType?: string | null;
  routerVersion?: string | null;
  order?: number | null;
};

export type YieldPoolStats = {
  __typename: "YieldPoolStats";
  yieldType?: string | null;
  tvl?: string | null;
  apy?: string | null;
  estimatedAprMin?: string | null;
  estimatedAprMax?: string | null;
  pointsEarned?: string | null;
};

export type BtcFofInfoM = {
  __typename: "BtcFofInfoM";
  chainId?: number | null;
  idAndCurrency?: Array<IdAndCurrency | null> | null;
  order?: number | null;
};

export type IdAndCurrency = {
  __typename: "IdAndCurrency";
  poolSlotInfoId?: number | null;
  currencySymbol?: string | null;
};

export type ChainLiquidityInfo = {
  __typename: "ChainLiquidityInfo";
  chainId?: number | null;
  chainName?: string | null;
  totalTvl?: string | null;
  highestApy?: string | null;
  highestPointRatio?: number | null;
  url?: string | null;
  order?: number | null;
  details?: Array<LiquidityInfo | null> | null;
  chainReward?: string | null;
  description?: string | null;
};

export type LiquidityInfo = {
  __typename: "LiquidityInfo";
  chainId?: number | null;
  chainName?: string | null;
  protocol?: string | null;
  task?: string | null;
  tvl?: string | null;
  apy?: string | null;
  url?: string | null;
  pointRatio?: number | null;
  description?: string | null;
  extraPointsReward?: boolean | null;
  pointsRewardTitle?: string | null;
  pointsRewardContent?: string | null;
  extraTokenReward?: boolean | null;
  tokenRewardTitle?: string | null;
  tokenRewardContent?: string | null;
  boosting?: boolean | null;
  assetType?: string | null;
  rewardInfo?: string | null;
  logoUrl?: string | null;
};

export type ProtocolLiquidityInfo = {
  __typename: "ProtocolLiquidityInfo";
  protocol?: string | null;
  totalTvl?: string | null;
  highestApy?: string | null;
  highestPointRatio?: number | null;
  order?: number | null;
  details?: Array<LiquidityInfo | null> | null;
};

export type AssetsLiquidityInfo = {
  __typename: "AssetsLiquidityInfo";
  assetType?: string | null;
  totalTvl?: string | null;
  highestApy?: string | null;
  highestPointRatio?: number | null;
  url?: string | null;
  order?: number | null;
  details?: Array<LiquidityInfo | null> | null;
};

export type SolvBtcAssets = {
  __typename: "SolvBtcAssets";
  snapshotTime?: number | null;
  totalAmount?: string | null;
  assets?: Array<SolvBtcAsset | null> | null;
};

export type SolvBtcAsset = {
  __typename: "SolvBtcAsset";
  assetName?: string | null;
  assetAmount?: string | null;
  order: number;
  details?: Array<SolvBtcAssetDetail | null> | null;
};

export type SolvBtcAssetDetail = {
  __typename: "SolvBtcAssetDetail";
  vault?: string | null;
  vaultAddress?: string | null;
  url?: string | null;
  amount?: string | null;
};

export type SolvBtcLiabilities = {
  __typename: "SolvBtcLiabilities";
  snapshotTime?: number | null;
  totalAmount?: string | null;
  liabilities?: Array<SolvBtcLiability | null> | null;
};

export type SolvBtcLiability = {
  __typename: "SolvBtcLiability";
  chainName?: string | null;
  tokenAddress?: string | null;
  url?: string | null;
  totalSupply?: string | null;
  order: number;
  details?: Array<SolvBtcLiabilityDetail | null> | null;
};

export type SolvBtcLiabilityDetail = {
  __typename: "SolvBtcLiabilityDetail";
  vault?: string | null;
  vaultAddress?: string | null;
  url?: string | null;
  amount?: string | null;
};

export type DexFilter = {
  chainId?: number | null;
  assetName?: string | null;
};

export type DexInfo = {
  __typename: "DexInfo";
  chainId?: number | null;
  chainName?: string | null;
  assetName?: string | null;
  dexName?: string | null;
  tokenPair?: string | null;
  dexUrl?: string | null;
  tvl?: string | null;
};

export type RedeemableInfo = {
  __typename: "RedeemableInfo";
  chainId?: number | null;
  chainName?: string | null;
  redeemableAmount?: string | null;
  curencySymbol?: string | null;
  assetName?: string | null;
  bridge?: string | null;
};

export type SolvBtcYTReserves = {
  __typename: "SolvBtcYTReserves";
  snapshotTime?: number | null;
  totalAmount?: string | null;
  reserves?: Array<SolvBtcYTReserve | null> | null;
};

export type SolvBtcYTReserve = {
  __typename: "SolvBtcYTReserve";
  vault?: string | null;
  vaultAddress?: string | null;
  url?: string | null;
  amount?: string | null;
};

export type SolvBtcYTIssuances = {
  __typename: "SolvBtcYTIssuances";
  snapshotTime?: number | null;
  totalAmount?: string | null;
  issuances?: Array<SolvBtcYTIssuance | null> | null;
};

export type SolvBtcYTIssuance = {
  __typename: "SolvBtcYTIssuance";
  chainName?: string | null;
  tokenAddress?: string | null;
  url?: string | null;
  totalSupply?: string | null;
  order: number;
};

export type Lsts = {
  __typename: "Lsts";
  stakingBTCAmount?: string | null;
  users?: number | null;
  ecosystems?: string | null;
  details?: Array<LstInfo | null> | null;
};

export type LstInfo = {
  __typename: "LstInfo";
  protocol?: string | null;
  alias?: string | null;
  category?: string | null;
  btcAmount?: string | null;
  tvlUsd?: string | null;
  validator?: string | null;
  apy?: string | null;
  estApy?: string | null;
  apyText?: Array<string | null> | null;
  rewards?: string | null;
  yieldDistributor?: string | null;
  url?: string | null;
  order?: number | null;
  apyUpdateTime?: number | null;
};

export type Chains = {
  __typename: "Chains";
  fromChains?: Array<ChainInfo | null> | null;
  toChains?: Array<ChainInfo | null> | null;
};

export type ChainInfo = {
  __typename: "ChainInfo";
  chainName: string;
  chainId: number;
  tokenAddress?: string | null;
};

export type Bridge = {
  __typename: "Bridge";
  bridgeName: string;
  bridgeUrl: string;
  description: string;
};

export type AirdropInfo = {
  __typename: "AirdropInfo";
  totalPoints?: string | null;
  userType?: string | null;
  chainId?: number | null;
  tokenAddress?: string | null;
  signer?: string | null;
  stagesInfo?: Array<StageInfo | null> | null;
};

export type StageInfo = {
  __typename: "StageInfo";
  stageNo?: number | null;
  rewardType?: string | null;
  totalClaimable?: string | null;
  pointSysReward?: string | null;
  earlyUserReward?: string | null;
  campaignReward?: string | null;
  baseBtcAmount?: string | null;
  averageHoldingAmount?: string | null;
  claimableBeginTime?: number | null;
  expireTime?: number | null;
  nonce?: string | null;
  signature?: string | null;
  state?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

export type BtcRecordsFilter = {
  poolId?: string | null;
  transferToAddress?: string | null;
  state?: string | null;
  depositTxHash?: string | null;
  recordType?: string | null;
};

export type ManagementBtcStakeRecords = {
  __typename: "ManagementBtcStakeRecords";
  totalCount?: number | null;
  btcStakeMintRecord?: Array<ManagementBtcStakeRecord | null> | null;
};

export type ManagementBtcStakeRecord = {
  __typename: "ManagementBtcStakeRecord";
  id: number;
  chainId: number;
  recordType: string;
  depositAmount: string;
  depositTxHash: string;
  depositFromAddress: string;
  depositToAddress: string;
  transferToAddress?: string | null;
  claimTxHash?: string | null;
  state?: string | null;
  signState?: string | null;
  btcMinterContractAddress?: string | null;
  createdAt?: string | null;
};

export type UserBtcRecordsFilter = {
  poolId?: string | null;
  transferToAddress?: string | null;
  state?: string | null;
};

export type UserBtcStakeRecords = {
  __typename: "UserBtcStakeRecords";
  totalCount?: number | null;
  btcStakeMintRecord?: Array<UserBtcStakeRecord | null> | null;
};

export type UserBtcStakeRecord = {
  __typename: "UserBtcStakeRecord";
  id: number;
  chainId: number;
  tokenAddress: string;
  depositAmount: string;
  depositTxHash: string;
  state?: string | null;
  signature?: string | null;
  btcMinterContractAddress?: string | null;
  opReturnHash?: string | null;
  signer?: string | null;
  claimTxHash?: string | null;
  createdAt?: string | null;
};

export type BtcTxInfo = {
  __typename: "BtcTxInfo";
  depositFromAddress?: string | null;
  depositToAddress?: string | null;
  depositAmount?: string | null;
  depositTxHash?: string | null;
  blockHeight?: number | null;
  lastHeight?: number | null;
  txInfo?: string | null;
};

export type SigningRecords = {
  __typename: "SigningRecords";
  totalCount?: number | null;
  signingRecords?: Array<SigningRecord | null> | null;
};

export type SigningRecord = {
  __typename: "SigningRecord";
  depositTxHash?: string | null;
  message?: string | null;
  signMessageHash?: string | null;
  updatedAt?: string | null;
};

export type StakingStats = {
  __typename: "StakingStats";
  stakingTvl?: string | null;
  totalStakingRewards?: string | null;
  airdropRewards?: string | null;
  currentTotalStakingPower?: string | null;
  stakingAPR?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export type EstimatedReward = {
  __typename: "EstimatedReward";
  stakingPower?: string | null;
  currentTotalStakingPower?: string | null;
  estimatedReward?: string | null;
};

export type SolvBtcJupReserves = {
  __typename: "SolvBtcJupReserves";
  snapshotTime?: number | null;
  totalAmount?: string | null;
  reserves?: Array<SolvBtcJupReserve | null> | null;
};

export type SolvBtcJupReserve = {
  __typename: "SolvBtcJupReserve";
  vault?: string | null;
  vaultAddress?: string | null;
  url?: string | null;
  amount?: string | null;
  assetName?: string | null;
  btcAmount?: string | null;
};

export type BabylonRelationInfo = {
  __typename: "BabylonRelationInfo";
  isRelation?: boolean | null;
  evmAddress?: string | null;
  babylonAddress?: string | null;
  points?: string | null;
};

export type ProtocolInfo = {
  __typename: "ProtocolInfo";
  protocol?: string | null;
  logoUrl?: string | null;
};

export type BroInfo = {
  __typename: "BroInfo";
  totalRaised?: string | null;
  revenueFromBRO?: string | null;
  pieChartData?: Array<FundDistribution | null> | null;
};

export type FundDistribution = {
  __typename: "FundDistribution";
  name?: string | null;
  value?: string | null;
};

export type NonEvmAssetFilter = {
  holder?: string | null;
};

export type NonEvmAssets = {
  __typename: "NonEvmAssets";
  totalCount?: number | null;
  nonEvmAssets?: Array<NonEvmAssetInfo | null> | null;
};

export type NonEvmAssetInfo = {
  __typename: "NonEvmAssetInfo";
  chainId?: number | null;
  tokenAddress?: string | null;
  holder?: string | null;
  symbol?: string | null;
  name?: string | null;
  balance?: string | null;
  decimals?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UserNonEvmAssetsInfo = {
  __typename: "UserNonEvmAssetsInfo";
  totalBalanceUSD?: string | null;
  numberOfVaults?: number | null;
};

export type NonEvmActivityFilter = {
  address?: string | null;
  activityType?: Array<string | null> | null;
  vaultName?: string | null;
  chainId?: number | null;
};

export type NonEvmActivities = {
  __typename: "NonEvmActivities";
  totalCount?: number | null;
  activitiesInfo: Array<NonEvmActivity>;
};

export type NonEvmActivity = {
  __typename: "NonEvmActivity";
  id: number;
  chainId?: number | null;
  txHash?: string | null;
  fromAddress?: string | null;
  toAddress?: string | null;
  amount?: string | null;
  decimals?: number | null;
  name?: string | null;
  symbol?: string | null;
  productName?: string | null;
  blockTimestamp?: number | null;
  txDetail?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type NonEvmVaultInfo = {
  __typename: "NonEvmVaultInfo";
  vaultAddress?: string | null;
  vaultName?: string | null;
  description?: string | null;
  pointRatio?: string | null;
  tokenAddress?: string | null;
  symbol?: string | null;
  decimals?: number | null;
  tvl?: string | null;
  tvlUSD?: string | null;
  apy?: string | null;
};

export type NonEvmSaleInfo = {
  __typename: "NonEvmSaleInfo";
  amountRaised?: string | null;
  amountRemaining?: string | null;
};

export type SolvBtcData = {
  __typename: "SolvBtcData";
  tvl?: string | null;
  tvlUSD?: string | null;
  users?: number | null;
  timestamp?: number | null;
};

export type XSolvBtcData = {
  __typename: "XSolvBtcData";
  tvl?: string | null;
  tvlUSD?: string | null;
  price?: string | null;
  apy?: string | null;
  timestamp?: number | null;
};

export type SolvBtcInCirculation = {
  __typename: "SolvBtcInCirculation";
  tvl?: string | null;
  details?: Array<PercentageByChain | null> | null;
};

export type PercentageByChain = {
  __typename: "PercentageByChain";
  chainName?: string | null;
  percentage?: string | null;
};

export type XSolvBtcInCirculation = {
  __typename: "XSolvBtcInCirculation";
  tvl?: string | null;
  details?: Array<PercentageByChain | null> | null;
};

export type SolvBtcBacking = {
  __typename: "SolvBtcBacking";
  tvl?: string | null;
  details?: Array<PercentageByAsset | null> | null;
};

export type PercentageByAsset = {
  __typename: "PercentageByAsset";
  assetName?: string | null;
  percentage?: string | null;
};

export type RedeemContractInfo = {
  __typename: "RedeemContractInfo";
  redeemContract?: string | null;
  solvbtcAddress?: string | null;
};

export type BtcRedeemFilter = {
  evmAddress?: string | null;
  state?: string | null;
};

export type BtcRedeemRecords = {
  __typename: "BtcRedeemRecords";
  totalCount?: number | null;
  records?: Array<BtcRedeemRecord | null> | null;
};

export type BtcRedeemRecord = {
  __typename: "BtcRedeemRecord";
  id?: number | null;
  burnAmount?: string | null;
  burnHash?: string | null;
  fromAddress?: string | null;
  withdrawToAddress?: string | null;
  withdrawAmount?: string | null;
  chainId?: number | null;
  chainName?: string | null;
  state?: string | null;
  btcTransferHash?: string | null;
  withdrawTime?: number | null;
  completionTime?: number | null;
};

export type LoginMutationVariables = {
  loginInput?: LoginInput | null;
};

export type LoginMutation = {
  login?: {
    __typename: "AccountInfo";
    id?: number | null;
    address?: string | null;
    // latestLoginId: Int
    username?: string | null;
    ensName?: string | null;
    avatar?: string | null;
    isIssuer?: boolean | null;
    bio?: string | null;
    // email: String
    // twitter: String
    // discord: String
    needBind?: boolean | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type BeforeIssueMutationVariables = {
  issueInput?: IssueInput | null;
};

export type BeforeIssueMutation = {
  beforeIssue?: {
    __typename: "BondInfo";
    id: number;
    productInfo?: {
      __typename: "ProductInfo";
      id: number;
      chainId?: number | null;
      // contractType: String
      productType?: string | null;
      name?: string | null;
      description?: string | null;
      image?: string | null;
      properties?: string | null;
      slot?: string | null;
      symbol?: string | null;
      createTxHash?: string | null;
      txStatus?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    issuerInfo?: {
      __typename: "IssuerInfo";
      id: number;
      category?: string | null;
      // institutionUrl: String
      description?: string | null;
      isKyb?: boolean | null;
      kybInfo?: string | null;
      creator?: string | null;
      extraInfo?: string | null;
      state?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    issuances?: Array<{
      __typename: "Issuance";
      id: number;
      // productInfo: ProductInfo
      // issuerInfo: IssuerInfo
      chainId?: number | null;
      // marketInfo: MarketInfo
      startSaleTime?: number | null;
      endSaleTime?: number | null;
      receivingAddress?: string | null;
      isWhitelisted?: boolean | null;
      underwriterIssuance?: string | null;
      issueSize?: string | null;
      remainingSize?: string | null;
      priceType?: string | null;
      priceInfo?: string | null;
      maxBuyLimit?: string | null;
      minBuyLimit?: string | null;
      // isVisible: Boolean
      auditStatus?: string | null;
      isUnlisted?: boolean | null;
      whitelist?: string | null;
      createTxHash?: string | null;
      txStatus?: string | null;
      issuePrice?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null> | null;
    interestType?: string | null;
    convertibility?: boolean | null;
    creditType?: string | null;
    currencyInfo?: {
      __typename: "Currency";
      symbol?: string | null;
      currencyAddress?: string | null;
      decimals?: number | null;
    } | null;
    term?: number | null;
    couponRate?: string | null;
    valueDate?: number | null;
    maturityDate?: number | null;
    issueSize?: string | null;
    totalValue?: string | null;
    isTransferable?: boolean | null;
    expectedToPay?: string | null;
    repaidValue?: string | null;
    claimedValue?: string | null;
    repayInfos?: Array<{
      __typename: "RepayInfo";
      id: number;
      address?: string | null;
      repayValue?: string | null;
      repayDate?: number | null;
      txHash?: string | null;
      transactionIndex?: number | null;
      eventIndex?: number | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null> | null;
    // todo
    // imageUrl: String
    extraInfo?: string | null;
    payoffDate?: number | null;
    fundType?: string | null;
    showNav?: boolean | null;
    supervisorInfo?: {
      __typename: "SupervisorInfo";
      id: number;
      name?: string | null;
      label?: string | null;
      address?: string | null;
      chainId?: number | null;
      state?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    carriedInterest?: string | null;
    isInterestRateSet?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type AfterIssueMutationVariables = {
  afterIssueInput?: AfterIssueInput | null;
};

export type AfterIssueMutation = {
  afterIssue?: {
    __typename: "BondInfo";
    id: number;
    productInfo?: {
      __typename: "ProductInfo";
      id: number;
      chainId?: number | null;
      // contractType: String
      productType?: string | null;
      name?: string | null;
      description?: string | null;
      image?: string | null;
      properties?: string | null;
      slot?: string | null;
      symbol?: string | null;
      createTxHash?: string | null;
      txStatus?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    issuerInfo?: {
      __typename: "IssuerInfo";
      id: number;
      category?: string | null;
      // institutionUrl: String
      description?: string | null;
      isKyb?: boolean | null;
      kybInfo?: string | null;
      creator?: string | null;
      extraInfo?: string | null;
      state?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    issuances?: Array<{
      __typename: "Issuance";
      id: number;
      // productInfo: ProductInfo
      // issuerInfo: IssuerInfo
      chainId?: number | null;
      // marketInfo: MarketInfo
      startSaleTime?: number | null;
      endSaleTime?: number | null;
      receivingAddress?: string | null;
      isWhitelisted?: boolean | null;
      underwriterIssuance?: string | null;
      issueSize?: string | null;
      remainingSize?: string | null;
      priceType?: string | null;
      priceInfo?: string | null;
      maxBuyLimit?: string | null;
      minBuyLimit?: string | null;
      // isVisible: Boolean
      auditStatus?: string | null;
      isUnlisted?: boolean | null;
      whitelist?: string | null;
      createTxHash?: string | null;
      txStatus?: string | null;
      issuePrice?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null> | null;
    interestType?: string | null;
    convertibility?: boolean | null;
    creditType?: string | null;
    currencyInfo?: {
      __typename: "Currency";
      symbol?: string | null;
      currencyAddress?: string | null;
      decimals?: number | null;
    } | null;
    term?: number | null;
    couponRate?: string | null;
    valueDate?: number | null;
    maturityDate?: number | null;
    issueSize?: string | null;
    totalValue?: string | null;
    isTransferable?: boolean | null;
    expectedToPay?: string | null;
    repaidValue?: string | null;
    claimedValue?: string | null;
    repayInfos?: Array<{
      __typename: "RepayInfo";
      id: number;
      address?: string | null;
      repayValue?: string | null;
      repayDate?: number | null;
      txHash?: string | null;
      transactionIndex?: number | null;
      eventIndex?: number | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null> | null;
    // todo
    // imageUrl: String
    extraInfo?: string | null;
    payoffDate?: number | null;
    fundType?: string | null;
    showNav?: boolean | null;
    supervisorInfo?: {
      __typename: "SupervisorInfo";
      id: number;
      name?: string | null;
      label?: string | null;
      address?: string | null;
      chainId?: number | null;
      state?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    carriedInterest?: string | null;
    isInterestRateSet?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type IssuerUpdateMutationVariables = {
  issuerInput?: IssuerInput | null;
};

export type IssuerUpdateMutation = {
  // inquire(inquireInput: InquireInput): InquireInfo
  issuerUpdate?: {
    __typename: "IssuerInfo";
    id: number;
    accountInfo?: {
      __typename: "AccountInfo";
      id?: number | null;
      address?: string | null;
      // latestLoginId: Int
      username?: string | null;
      ensName?: string | null;
      avatar?: string | null;
      isIssuer?: boolean | null;
      bio?: string | null;
      // email: String
      // twitter: String
      // discord: String
      needBind?: boolean | null;
      createdAt: string;
      updatedAt: string;
    } | null;
    category?: string | null;
    // institutionUrl: String
    description?: string | null;
    isKyb?: boolean | null;
    kybInfo?: string | null;
    creator?: string | null;
    extraInfo?: string | null;
    state?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type UserUpdateMutationVariables = {
  userInput?: UserInput | null;
};

export type UserUpdateMutation = {
  userUpdate?: {
    __typename: "AccountInfo";
    id?: number | null;
    address?: string | null;
    // latestLoginId: Int
    username?: string | null;
    ensName?: string | null;
    avatar?: string | null;
    isIssuer?: boolean | null;
    bio?: string | null;
    // email: String
    // twitter: String
    // discord: String
    needBind?: boolean | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateProfileImageUrlMutationVariables = {
  imageInput?: ImageInput | null;
};

export type UpdateProfileImageUrlMutation = {
  updateProfileImageUrl?: string | null;
};

export type UpdateAvatarMutationVariables = {
  updateInput?: UpdateInput | null;
};

export type UpdateAvatarMutation = {
  updateAvatar?: {
    __typename: "AccountInfo";
    id?: number | null;
    address?: string | null;
    // latestLoginId: Int
    username?: string | null;
    ensName?: string | null;
    avatar?: string | null;
    isIssuer?: boolean | null;
    bio?: string | null;
    // email: String
    // twitter: String
    // discord: String
    needBind?: boolean | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type RefreshImageMutationVariables = {
  assetId?: number | null;
};

export type RefreshImageMutation = {
  refreshImage?: boolean | null;
};

export type BeforeCreatePoolMutationVariables = {
  poolInput?: PoolInput | null;
};

export type BeforeCreatePoolMutation = {
  beforeCreatePool?: {
    __typename: "PoolSlotInfo";
    id: number;
    productInfo?: {
      __typename: "ProductInfo";
      id: number;
      chainId?: number | null;
      // contractType: String
      productType?: string | null;
      name?: string | null;
      description?: string | null;
      image?: string | null;
      properties?: string | null;
      slot?: string | null;
      symbol?: string | null;
      createTxHash?: string | null;
      txStatus?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    issuerInfo?: {
      __typename: "IssuerInfo";
      id: number;
      category?: string | null;
      // institutionUrl: String
      description?: string | null;
      isKyb?: boolean | null;
      kybInfo?: string | null;
      creator?: string | null;
      extraInfo?: string | null;
      state?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    poolOrderInfo?: {
      __typename: "PoolOrderInfo";
      id: number;
      poolId?: string | null;
      openFundShare?: string | null;
      openFundRedemption?: string | null;
      openFundShareSlot?: string | null;
      latestRedeemSlot?: string | null;
      carryRate?: string | null;
      carryCollector?: string | null;
      latestProtocolFeeSettleTime?: number | null;
      poolManager?: string | null;
      subscribeNavManager?: string | null;
      redeemNavManager?: string | null;
      hardCap?: string | null;
      softCap?: string | null;
      subscribeMin?: string | null;
      subscribeMax?: string | null;
      fundraisingStartTime?: number | null;
      fundraisingEndTime?: number | null;
      vault?: string | null;
      currency?: string | null;
      navOracle?: string | null;
      valueDate?: number | null;
      permissionless?: boolean | null;
      fundraisingAmount?: string | null;
      whitelist?: string | null;
      poolStatus?: string | null;
      auditStatus?: string | null;
      isUnlisted?: boolean | null;
      createTxHash?: string | null;
      txStatus?: string | null;
      estimatedAprMin?: string | null;
      estimatedAprMax?: string | null;
      highWatermark?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    supervisorInfo?: {
      __typename: "SupervisorInfo";
      id: number;
      name?: string | null;
      label?: string | null;
      address?: string | null;
      chainId?: number | null;
      state?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    currencyInfo?: {
      __typename: "Currency";
      symbol?: string | null;
      currencyAddress?: string | null;
      decimals?: number | null;
    } | null;
    fundType?: string | null;
    interestType?: string | null;
    maturityDate?: number | null;
    redemptionPeriod?: number | null;
    isTransferable?: boolean | null;
    // fundraisingStartTime: Int
    // fundraisingEndTime: Int
    totalAmount?: string | null;
    // repaidValue: String
    // claimedValue: String
    nav?: string | null;
    apy?: string | null;
    historyApy?: string | null;
    aum?: string | null;
    couponRate?: string | null;
    isInterestRateSet?: boolean | null;
    totalRepaidValue?: string | null;
    manualOrder?: number | null;
    compositeIcon?: string | null;
    additionalRewards?: string | null;
    subtype?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    pointRatio?: string | null;
    isYieldPool?: boolean | null;
    yieldType?: string | null;
    aumUSD?: string | null;
    isUpgradedRouterV2?: boolean | null;
  } | null;
};

export type AfterCreatePoolMutationVariables = {
  afterCreatePoolInput?: AfterCreatePoolInput | null;
};

export type AfterCreatePoolMutation = {
  afterCreatePool?: {
    __typename: "PoolSlotInfo";
    id: number;
    productInfo?: {
      __typename: "ProductInfo";
      id: number;
      chainId?: number | null;
      // contractType: String
      productType?: string | null;
      name?: string | null;
      description?: string | null;
      image?: string | null;
      properties?: string | null;
      slot?: string | null;
      symbol?: string | null;
      createTxHash?: string | null;
      txStatus?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    issuerInfo?: {
      __typename: "IssuerInfo";
      id: number;
      category?: string | null;
      // institutionUrl: String
      description?: string | null;
      isKyb?: boolean | null;
      kybInfo?: string | null;
      creator?: string | null;
      extraInfo?: string | null;
      state?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    poolOrderInfo?: {
      __typename: "PoolOrderInfo";
      id: number;
      poolId?: string | null;
      openFundShare?: string | null;
      openFundRedemption?: string | null;
      openFundShareSlot?: string | null;
      latestRedeemSlot?: string | null;
      carryRate?: string | null;
      carryCollector?: string | null;
      latestProtocolFeeSettleTime?: number | null;
      poolManager?: string | null;
      subscribeNavManager?: string | null;
      redeemNavManager?: string | null;
      hardCap?: string | null;
      softCap?: string | null;
      subscribeMin?: string | null;
      subscribeMax?: string | null;
      fundraisingStartTime?: number | null;
      fundraisingEndTime?: number | null;
      vault?: string | null;
      currency?: string | null;
      navOracle?: string | null;
      valueDate?: number | null;
      permissionless?: boolean | null;
      fundraisingAmount?: string | null;
      whitelist?: string | null;
      poolStatus?: string | null;
      auditStatus?: string | null;
      isUnlisted?: boolean | null;
      createTxHash?: string | null;
      txStatus?: string | null;
      estimatedAprMin?: string | null;
      estimatedAprMax?: string | null;
      highWatermark?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    supervisorInfo?: {
      __typename: "SupervisorInfo";
      id: number;
      name?: string | null;
      label?: string | null;
      address?: string | null;
      chainId?: number | null;
      state?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    currencyInfo?: {
      __typename: "Currency";
      symbol?: string | null;
      currencyAddress?: string | null;
      decimals?: number | null;
    } | null;
    fundType?: string | null;
    interestType?: string | null;
    maturityDate?: number | null;
    redemptionPeriod?: number | null;
    isTransferable?: boolean | null;
    // fundraisingStartTime: Int
    // fundraisingEndTime: Int
    totalAmount?: string | null;
    // repaidValue: String
    // claimedValue: String
    nav?: string | null;
    apy?: string | null;
    historyApy?: string | null;
    aum?: string | null;
    couponRate?: string | null;
    isInterestRateSet?: boolean | null;
    totalRepaidValue?: string | null;
    manualOrder?: number | null;
    compositeIcon?: string | null;
    additionalRewards?: string | null;
    subtype?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    pointRatio?: string | null;
    isYieldPool?: boolean | null;
    yieldType?: string | null;
    aumUSD?: string | null;
    isUpgradedRouterV2?: boolean | null;
  } | null;
};

export type OriginalNavAddMutationVariables = {
  originalNavInput?: OriginalNavInput | null;
};

export type OriginalNavAddMutation = {
  originalNavAdd?: {
    __typename: "OriginalNavInfo";
    id: number;
    poolId?: string | null;
    navDate?: number | null;
    originalNav?: string | null;
    nav?: string | null;
    txHash?: string | null;
  } | null;
};

export type OriginalNavUpdateHashMutationVariables = {
  originalNavUpdateInput?: OriginalNavUpdateInput | null;
};

export type OriginalNavUpdateHashMutation = {
  originalNavUpdateHash?: {
    __typename: "OriginalNavInfo";
    id: number;
    poolId?: string | null;
    navDate?: number | null;
    originalNav?: string | null;
    nav?: string | null;
    txHash?: string | null;
  } | null;
};

export type CreateAccountMutationVariables = {
  address?: string | null;
};

export type CreateAccountMutation = {
  createAccount?: {
    __typename: "AccountInfo";
    id?: number | null;
    address?: string | null;
    // latestLoginId: Int
    username?: string | null;
    ensName?: string | null;
    avatar?: string | null;
    isIssuer?: boolean | null;
    bio?: string | null;
    // email: String
    // twitter: String
    // discord: String
    needBind?: boolean | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateReferralMutationVariables = {
  referralInput?: ReferralInput | null;
};

export type CreateReferralMutation = {
  // updateRewardApy(poolSlotInfoId: Int, apy: String): Boolean
  createReferral?: {
    __typename: "ReferralInfo";
    id?: number | null;
    referralCode?: string | null;
    userAddress?: string | null;
    bindTime?: string | null;
    state?: string | null;
  } | null;
};

export type PointSysBindRegMutationVariables = {
  binRegInput?: PointSysBindRegInput | null;
};

export type PointSysBindRegMutation = {
  pointSysBindReg?: {
    __typename: "PointSysAccountInfo";
    address?: string | null;
    isRegistered?: boolean | null;
    seedUserInviteCode?: string | null;
    inviteCode?: string | null;
    inviteCount?: number | null;
    totalPointsEarned?: string | null;
    availablePoints?: string | null;
    isPointsAccelerationActive?: boolean | null;
    todayHoldingTVL?: string | null;
    todayHoldingAccelerationRatio?: string | null;
    isHighestLevel?: boolean | null;
    nextLevelHoldingTVL?: string | null;
    nextLevelHoldingAccelerationRatio?: string | null;
    activityCards?: Array<{
      __typename: "PointSysActivityCard";
      type?: string | null;
      accelerationRatio?: string | null;
      startTime?: string | null;
      endTime?: string | null;
    } | null> | null;
  } | null;
};

export type Phase2PointSysBindRegMutationVariables = {
  binRegInput?: PointSysBindRegInput | null;
};

export type Phase2PointSysBindRegMutation = {
  phase2PointSysBindReg?: {
    __typename: "PointSysAccountInfo";
    address?: string | null;
    isRegistered?: boolean | null;
    seedUserInviteCode?: string | null;
    inviteCode?: string | null;
    inviteCount?: number | null;
    totalPointsEarned?: string | null;
    availablePoints?: string | null;
    isPointsAccelerationActive?: boolean | null;
    todayHoldingTVL?: string | null;
    todayHoldingAccelerationRatio?: string | null;
    isHighestLevel?: boolean | null;
    nextLevelHoldingTVL?: string | null;
    nextLevelHoldingAccelerationRatio?: string | null;
    activityCards?: Array<{
      __typename: "PointSysActivityCard";
      type?: string | null;
      accelerationRatio?: string | null;
      startTime?: string | null;
      endTime?: string | null;
    } | null> | null;
  } | null;
};

export type SaveWalletInfoMutationVariables = {
  walletInfoInput?: WalletInfoInput | null;
};

export type SaveWalletInfoMutation = {
  saveWalletInfo?: {
    __typename: "WalletInfo";
    chainId?: number | null;
    userAddress?: string | null;
    txHash?: string | null;
    walletType?: string | null;
    recordDate?: string | null;
  } | null;
};

export type AddBtcRecordsMutationVariables = {
  btcRecordsInput?: BtcRecordsInput | null;
};

export type AddBtcRecordsMutation = {
  addBtcRecords?: {
    __typename: "BtcDepositMintRecord";
    id: number;
    depositAmount?: string | null;
    depositHash?: string | null;
    depositFromAddress?: string | null;
    transferToAddress?: string | null;
    chain?: string | null;
    state?: string | null;
    mintHash?: string | null;
    transferHash?: string | null;
    createTime?: string | null;
    btcContractAddress?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type UpdateAirdropClaimStateMutationVariables = {
  address?: string | null;
  stageNo?: number | null;
  rewardType?: string | null;
  claimTxHash?: string | null;
};

export type UpdateAirdropClaimStateMutation = {
  updateAirdropClaimState?: boolean | null;
};

export type AddStakeBtcRecordMutationVariables = {
  btcStakeRecordsInput?: BtcStakeRecordsInput | null;
};

export type AddStakeBtcRecordMutation = {
  addStakeBtcRecord?: {
    __typename: "BtcStakeRecord";
    id: number;
    chainId: number;
    poolId: string;
    recordType: string;
    depositAmount: string;
    depositTxHash: string;
    depositFromAddress: string;
    depositToAddress: string;
    transferToAddress?: string | null;
    createdAt?: string | null;
  } | null;
};

export type UpdateStakeBtcRecordMutationVariables = {
  id: number;
  updateBtcStakeRecordInput?: UpdateBtcStakeRecordInput | null;
};

export type UpdateStakeBtcRecordMutation = {
  updateStakeBtcRecord?: {
    __typename: "BtcStakeRecord";
    id: number;
    chainId: number;
    poolId: string;
    recordType: string;
    depositAmount: string;
    depositTxHash: string;
    depositFromAddress: string;
    depositToAddress: string;
    transferToAddress?: string | null;
    createdAt?: string | null;
  } | null;
};

export type UpdateStateToDepositedMutationVariables = {
  depositTxHash: string;
  opReturnHash: string;
};

export type UpdateStateToDepositedMutation = {
  updateStateToDeposited?: boolean | null;
};

export type UpdateSignatureMutationVariables = {
  depositTxHash: string;
  signature: string;
  signer: string;
};

export type UpdateSignatureMutation = {
  // updateSignType(depositTxHash: String!, signType: String!): Boolean
  updateSignature?: boolean | null;
};

export type UpdateClaimTxHashMutationVariables = {
  id: number;
  claimTxHash: string;
};

export type UpdateClaimTxHashMutation = {
  updateClaimTxHash?: boolean | null;
};

export type SignRegisterMutationVariables = {
  depositTxHash: string;
  signMessageHash: string;
};

export type SignRegisterMutation = {
  signRegister?: boolean | null;
};

export type SignRollbackMutationVariables = {
  depositTxHash: string;
};

export type SignRollbackMutation = {
  signRollback?: boolean | null;
};

export type BtcMintRegisterMutationVariables = {
  btcMintRegisterInput?: BtcMintRegisterInput | null;
};

export type BtcMintRegisterMutation = {
  btcMintRegister?: {
    __typename: "BtcMintRegisterInfo";
    id?: number | null;
    btcAddress?: string | null;
    chainId?: number | null;
    tokenAddress?: string | null;
    evmAddress?: string | null;
    opReturnHash?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type AddEvmBabylonConnectionMutationVariables = {
  evmBabylonConnectionInput?: EvmBabylonConnectionInput | null;
};

export type AddEvmBabylonConnectionMutation = {
  addEvmBabylonConnection?: {
    __typename: "EvmBabylonConnectionInfo";
    evmAddress?: string | null;
    babylonAddress?: string | null;
    signMessage?: string | null;
    signature?: string | null;
  } | null;
};

export type AddInstitutionalRecordsMutationVariables = {
  institutionalRecordsInput?: InstitutionalRecordsInput | null;
};

export type AddInstitutionalRecordsMutation = {
  addInstitutionalRecords?: boolean | null;
};

export type AddNewsletterRecordsMutationVariables = {
  newsletterRecordsInput?: NewsletterRecordsInput | null;
};

export type AddNewsletterRecordsMutation = {
  addNewsletterRecords?: boolean | null;
};

export type LoginMessageQueryVariables = {
  address?: string | null;
};

export type LoginMessageQuery = {
  loginMessage?: {
    __typename: "LoginMessage";
    message: string;
  } | null;
};

export type UserAccountInfoQueryVariables = {
  address?: string | null;
};

export type UserAccountInfoQuery = {
  userAccountInfo?: {
    __typename: "AccountInfo";
    id?: number | null;
    address?: string | null;
    // latestLoginId: Int
    username?: string | null;
    ensName?: string | null;
    avatar?: string | null;
    isIssuer?: boolean | null;
    bio?: string | null;
    // email: String
    // twitter: String
    // discord: String
    needBind?: boolean | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type AccountsQueryVariables = {
  filter?: Filter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type AccountsQuery = {
  accounts?: {
    __typename: "Accounts";
    totalCount?: number | null;
    accountsInfo: Array<{
      __typename: "AccountInfo";
      id?: number | null;
      address?: string | null;
      // latestLoginId: Int
      username?: string | null;
      ensName?: string | null;
      avatar?: string | null;
      isIssuer?: boolean | null;
      bio?: string | null;
      // email: String
      // twitter: String
      // discord: String
      needBind?: boolean | null;
      createdAt: string;
      updatedAt: string;
    }>;
  } | null;
};

export type IssuancesQueryVariables = {
  filter?: IssuanceFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type IssuancesQuery = {
  issuances?: {
    __typename: "Bonds";
    totalCount: number;
    bondsInfo: Array<{
      __typename: "BondInfo";
      id: number;
      interestType?: string | null;
      convertibility?: boolean | null;
      creditType?: string | null;
      term?: number | null;
      couponRate?: string | null;
      valueDate?: number | null;
      maturityDate?: number | null;
      issueSize?: string | null;
      totalValue?: string | null;
      isTransferable?: boolean | null;
      expectedToPay?: string | null;
      repaidValue?: string | null;
      claimedValue?: string | null;
      // todo
      // imageUrl: String
      extraInfo?: string | null;
      payoffDate?: number | null;
      fundType?: string | null;
      showNav?: boolean | null;
      carriedInterest?: string | null;
      isInterestRateSet?: boolean | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    }>;
  } | null;
};

export type AssetsQueryVariables = {
  filter?: AssetFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type AssetsQuery = {
  assets?: {
    __typename: "Assets";
    totalCount?: number | null;
    assetsInfo: Array<{
      __typename: "AssetInfo";
      id?: number | null;
      // 有的需要从bondInfo中拿
      poolSlotInfoId?: number | null;
      holder?: string | null;
      tokenId?: string | null;
      chainId?: number | null;
      contractId?: number | null;
      contractAddress?: string | null;
      productType?: string | null;
      name?: string | null;
      description?: string | null;
      imageUri?: string | null;
      image?: string | null;
      // Amount#
      balance?: string | null;
      slot?: string | null;
      properties?: string | null;
      mintTime?: number | null;
      // isBurned: Boolean
      rate?: string | null;
      valueDate?: number | null;
      maturityDate?: number | null;
      bondId?: number | null;
      isTransferable?: boolean | null;
      term?: number | null;
      interestType?: string | null;
      isInterestRateSet?: boolean | null;
      // new add
      // claimableValue: String
      poolId?: string | null;
      nav?: string | null;
      redeemState?: string | null;
      redemptionPeriod?: number | null;
      subtype?: string | null;
      erc20TokenAddress?: string | null;
      isYieldPool?: boolean | null;
      routerContractAddress?: string | null;
      usdValue?: string | null;
      routerVersion?: string | null;
      yieldType?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    }>;
  } | null;
};

export type ProductNamesQueryVariables = {
  address?: string | null;
};

export type ProductNamesQuery = {
  productNames?: Array<string | null> | null;
};

export type ProductNamesForActivityQueryVariables = {
  address?: string | null;
};

export type ProductNamesForActivityQuery = {
  productNamesForActivity?: Array<string | null> | null;
};

export type ProductQueryVariables = {
  slot?: string | null;
};

export type ProductQuery = {
  product?: {
    __typename: "ProductInfo";
    id: number;
    chainId?: number | null;
    contractInfo?: {
      __typename: "ContractInfo";
      id: number;
      contractAddress?: string | null;
      contractType?: string | null;
      chainId: number;
      productType?: string | null;
      name?: string | null;
      description?: string | null;
      image?: string | null;
      externalLink?: string | null;
      decimals?: number | null;
      symbol?: string | null;
      totalSupply?: string | null;
      properties?: string | null;
      owner?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      fee?: string | null;
    } | null;
    // contractType: String
    productType?: string | null;
    name?: string | null;
    description?: string | null;
    image?: string | null;
    properties?: string | null;
    slot?: string | null;
    symbol?: string | null;
    createTxHash?: string | null;
    txStatus?: string | null;
    tags?: Array<{
      __typename: "Tag";
      tag?: string | null;
    } | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type IssueContractQueryVariables = {
  issueContractInput?: IssueContractInput | null;
};

export type IssueContractQuery = {
  issueContract?: {
    __typename: "IssueContracts";
    totalCount?: number | null;
    issueContracts?: Array<{
      __typename: "IssueContract";
    } | null> | null;
  } | null;
};

export type IssuerInfoQueryVariables = {
  address?: string | null;
};

export type IssuerInfoQuery = {
  issuerInfo?: {
    __typename: "IssuerInfo";
    id: number;
    accountInfo?: {
      __typename: "AccountInfo";
      id?: number | null;
      address?: string | null;
      // latestLoginId: Int
      username?: string | null;
      ensName?: string | null;
      avatar?: string | null;
      isIssuer?: boolean | null;
      bio?: string | null;
      // email: String
      // twitter: String
      // discord: String
      needBind?: boolean | null;
      createdAt: string;
      updatedAt: string;
    } | null;
    category?: string | null;
    // institutionUrl: String
    description?: string | null;
    isKyb?: boolean | null;
    kybInfo?: string | null;
    creator?: string | null;
    extraInfo?: string | null;
    state?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type RoadshowsQueryVariables = {
  filter?: RoadshowFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type RoadshowsQuery = {
  roadshows?: {
    __typename: "Roadshows";
    totalCount?: number | null;
    roadshowsInfo: Array<{
      __typename: "Roadshow";
      id?: number | null;
      chainId?: number | null;
      roadshowType?: string | null;
      from?: string | null;
      creator?: string | null;
      amount?: string | null;
      currencySymbol?: string | null;
      targetApr?: string | null;
      description?: string | null;
      status?: string | null;
      inquireCount?: number | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    }>;
  } | null;
};

export type ActivitiesQueryVariables = {
  filter?: ActivityFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type ActivitiesQuery = {
  activities?: {
    __typename: "Activities";
    totalCount?: number | null;
    activitiesInfo: Array<{
      __typename: "Activity";
      id: number;
      chainId?: number | null;
      contractAddress?: string | null;
      tokenId?: string | null;
      txHash?: string | null;
      fromAddress?: string | null;
      toAddress?: string | null;
      amount?: string | null;
      decimals?: number | null;
      currencySymbol?: string | null;
      currencyDecimals?: number | null;
      slot?: string | null;
      transactionType?: string | null;
      productName?: string | null;
      blockTimestamp?: number | null;
      // transactionIndex: Int
      // eventIndex: Int
      // #activity#
      // eventName: String
      // # get amount from eventValue._value#
      // eventValue: AWSJSON
      lastUpdated?: number | null;
      nav?: string | null;
      poolId?: string | null;
      productType?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    }>;
  } | null;
};

export type StableCoinsQueryVariables = {};

export type StableCoinsQuery = {
  stableCoins?: Array<string | null> | null;
};

export type IssuerStatsQueryVariables = {
  issuerId?: number | null;
};

export type IssuerStatsQuery = {
  issuerStats?: {
    __typename: "IssuerStats";
    totalIssued?: string | null;
    totalRepaid?: string | null;
    totalInterest?: string | null;
  } | null;
};

export type SupervisorsQueryVariables = {
  filter?: SupervisorFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type SupervisorsQuery = {
  supervisors?: {
    __typename: "Supervisors";
    totalCount: number;
    supervisorsInfo: Array<{
      __typename: "SupervisorInfo";
      id: number;
      name?: string | null;
      label?: string | null;
      address?: string | null;
      chainId?: number | null;
      state?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    }>;
  } | null;
};

export type NavsQueryVariables = {
  filter?: NavFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type NavsQuery = {
  navs?: {
    __typename: "NavInfo";
    bondId?: number | null;
    symbol?: string | null;
    serialData?: Array<{
      __typename: "NavData";
      nav?: string | null;
      yield?: string | null;
      fetchDate?: string | null;
    } | null> | null;
  } | null;
};

export type MarketContractQueryVariables = {
  chainId?: number | null;
  contractAddress?: string | null;
};

export type MarketContractQuery = {
  marketContract?: {
    __typename: "MarketContractInfo";
    marketContractAddress?: string | null;
    decimals?: number | null;
    defautFeeRate?: string | null;
  } | null;
};

export type PoolsQueryVariables = {
  filter?: PoolFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type PoolsQuery = {
  pools?: {
    __typename: "Pools";
    totalCount: number;
    poolsInfo: Array<{
      __typename: "PoolSlotInfo";
      id: number;
      fundType?: string | null;
      interestType?: string | null;
      maturityDate?: number | null;
      redemptionPeriod?: number | null;
      isTransferable?: boolean | null;
      // fundraisingStartTime: Int
      // fundraisingEndTime: Int
      totalAmount?: string | null;
      // repaidValue: String
      // claimedValue: String
      nav?: string | null;
      apy?: string | null;
      historyApy?: string | null;
      aum?: string | null;
      couponRate?: string | null;
      isInterestRateSet?: boolean | null;
      totalRepaidValue?: string | null;
      manualOrder?: number | null;
      compositeIcon?: string | null;
      additionalRewards?: string | null;
      subtype?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      pointRatio?: string | null;
      isYieldPool?: boolean | null;
      yieldType?: string | null;
      aumUSD?: string | null;
      isUpgradedRouterV2?: boolean | null;
    }>;
  } | null;
};

export type NavHistoryQueryVariables = {
  filter?: NavHistoryFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type NavHistoryQuery = {
  navHistory?: {
    __typename: "NavHistoryInfo";
    totalCount?: number | null;
    poolSlotInfoId?: number | null;
    symbol?: string | null;
    currencyDecimals?: number | null;
    allTimeHigh?: string | null;
    serialData?: Array<{
      __typename: "NavHistoryData";
      nav?: string | null;
      adjustedNav?: string | null;
      navDate?: string | null;
    } | null> | null;
  } | null;
};

export type NavsOpenFundQueryVariables = {
  filter?: NavOpenFundFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type NavsOpenFundQuery = {
  navsOpenFund?: {
    __typename: "NavHistoryInfo";
    totalCount?: number | null;
    poolSlotInfoId?: number | null;
    symbol?: string | null;
    currencyDecimals?: number | null;
    allTimeHigh?: string | null;
    serialData?: Array<{
      __typename: "NavHistoryData";
      nav?: string | null;
      adjustedNav?: string | null;
      navDate?: string | null;
    } | null> | null;
  } | null;
};

export type AssetsCountQueryVariables = {
  address?: string | null;
};

export type AssetsCountQuery = {
  assetsCount?: Array<{
    __typename: "AssetsCountInfo";
    productType?: string | null;
    count?: number | null;
  } | null> | null;
};

export type RedemptionsQueryVariables = {
  filter?: RedemptionFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type RedemptionsQuery = {
  redemptions?: {
    __typename: "Redemptions";
    totalCount: number;
    redemptionsInfo: Array<{
      __typename: "RedeemInfo";
      id: number;
      poolId?: string | null;
      redeemSlot?: string | null;
      redeemAmount?: string | null;
      nav?: string | null;
      repaidValue?: string | null;
      claimedAmount?: string | null;
      state?: string | null;
      startTime?: number | null;
      orders?: number | null;
      performanceFee?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      contractAddress?: string | null;
    }>;
  } | null;
};

export type StatsQueryVariables = {};

export type StatsQuery = {
  stats?: {
    __typename: "Stats";
    totalAssetsValue?: string | null;
    totalBtcStaked?: string | null;
    totalBtcTvlUSD?: string | null;
    totalProducts?: number | null;
    totalUsers?: number | null;
  } | null;
};

export type AumsQueryVariables = {
  filter?: AumFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type AumsQuery = {
  aums?: {
    __typename: "AumHistoryInfo";
    totalCount?: number | null;
    totalShares?: string | null;
    investors?: number | null;
    poolSlotInfoId?: number | null;
    decimals?: number | null;
    symbol?: string | null;
    currencyDecimals?: number | null;
    serialData?: Array<{
      __typename: "AumHistoryData";
      aum?: string | null;
      nav?: string | null;
      fetchDate?: string | null;
    } | null> | null;
  } | null;
};

export type GetLatestNavQueryVariables = {
  chainId?: number | null;
  contractAddress?: string | null;
  poolId?: string | null;
};

export type GetLatestNavQuery = {
  getLatestNav?: string | null;
};

export type NavRecordsQueryVariables = {
  filter?: NavRecordsFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type NavRecordsQuery = {
  navRecords?: {
    __typename: "NavRecordsInfo";
    totalCount?: number | null;
    symbol?: string | null;
    currencyDecimals?: number | null;
    serialData?: Array<{
      __typename: "NavRecordsData";
      nav?: string | null;
      navType?: string | null;
      time?: number | null;
    } | null> | null;
  } | null;
};

export type CarryCollectorsQueryVariables = {
  chainId?: number | null;
};

export type CarryCollectorsQuery = {
  carryCollectors?: Array<{
    __typename: "CarryCollectorInfo";
    id: number;
    chainId?: number | null;
    carryCollector?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null> | null;
};

export type AllocationsQueryVariables = {
  chainId?: number | null;
  contractAddress?: string | null;
  slot?: string | null;
};

export type AllocationsQuery = {
  allocations?: Array<{
    __typename: "AllocationInfo";
    name?: string | null;
    percentage?: string | null;
    value?: string | null;
    color?: string | null;
    subcolor?: string | null;
  } | null> | null;
};

export type AssetsByHolderQueryVariables = {
  holder?: string | null;
};

export type AssetsByHolderQuery = {
  assetsByHolder?: {
    __typename: "UserAssetsInfo";
    totalBalanceUSD?: string | null;
    assetsInfo?: Array<{
      __typename: "PoolAssetInfo";
      poolId?: string | null;
      balance?: string | null;
      // currencyPrice: String
      routerVersion?: string | null;
    } | null> | null;
  } | null;
};

export type GetWrappedTokenQueryVariables = {
  slot?: string | null;
};

export type GetWrappedTokenQuery = {
  getWrappedToken?: {
    __typename: "WrappedTokenInfo";
    tokenAddress?: string | null;
    symbol?: string | null;
    decimals?: number | null;
    name?: string | null;
  } | null;
};

export type WrappedAssetsQueryVariables = {
  filter?: WrappedAssetFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type WrappedAssetsQuery = {
  wrappedAssets?: {
    __typename: "WrappedAssets";
    totalCount?: number | null;
    wrappedAssets?: Array<{
      __typename: "WrappedAssetInfo";
      chainId?: number | null;
      tokenAddress?: string | null;
      holder?: string | null;
      symbol?: string | null;
      balance?: string | null;
      mintTime?: number | null;
      lastUpdated?: number | null;
      decimals?: number | null;
      sftAddress?: string | null;
      slot?: string | null;
      name?: string | null;
      nav?: string | null;
      routerContract?: string | null;
      poolId?: string | null;
      genesisDate?: number | null;
      currencyDecimals?: number | null;
      currencySymbol?: string | null;
      poolSlotInfoId?: number | null;
      isYieldPool?: boolean | null;
      usdValue?: string | null;
      fundraisingStartTime?: number | null;
      fundraisingEndTime?: number | null;
      maturityDate?: number | null;
      routerVersion?: string | null;
      yieldType?: string | null;
      xpoolAddress?: string | null;
    } | null> | null;
  } | null;
};

export type GetPoolCurrenciesQueryVariables = {
  poolId?: string | null;
};

export type GetPoolCurrenciesQuery = {
  getPoolCurrencies?: {
    __typename: "PoolCurrencies";
    totalCount?: number | null;
    currencies?: Array<{
      __typename: "PoolCurrencyInfo";
      chainId?: number | null;
      poolId?: string | null;
      currencyAddress?: string | null;
      symbol?: string | null;
      decimals?: number | null;
      isSupported?: boolean | null;
    } | null> | null;
  } | null;
};

export type SigVerifyQueryVariables = {
  sig?: string | null;
};

export type SigVerifyQuery = {
  sigVerify?: boolean | null;
};

export type RouterContractQueryVariables = {
  chainId?: number | null;
  poolSlotInfoId?: number | null;
};

export type RouterContractQuery = {
  routerContract?: {
    __typename: "RouterContractInfo";
    chainId?: number | null;
    contractAddress?: string | null;
  } | null;
};

export type MarketCoreDataQueryVariables = {};

export type MarketCoreDataQuery = {
  marketCoreData?: {
    __typename: "MarketCoreData";
    totalValueLocked?: string | null;
    totalYieldGenerated?: string | null;
    totalUsers?: string | null;
    totalSolvBtcAmount?: string | null;
    totalSolvBTCTvl?: string | null;
    totalBabylonTvl?: string | null;
    totalBabylonAmount?: string | null;
    totalEthenaTvl?: string | null;
    totalEthenaAmount?: string | null;
    totalCoreTvl?: string | null;
    totalCoreAmount?: string | null;
    totalJupTvl?: string | null;
    totalJupAmount?: string | null;
    totalBeraTvl?: string | null;
    totalBeraAmount?: string | null;
    totalBnbTvl?: string | null;
    totalBnbAmount?: string | null;
    totalBTCStaked?: string | null;
    totalLSTTvl?: string | null;
    totalLSTAmount?: string | null;
    lastTime?: number | null;
  } | null;
};

export type PointSysInviteCodeVerifyQueryVariables = {
  inviteCode?: string | null;
};

export type PointSysInviteCodeVerifyQuery = {
  pointSysInviteCodeVerify?: boolean | null;
};

export type PointSysAccountInfoQueryVariables = {
  address?: string | null;
};

export type PointSysAccountInfoQuery = {
  pointSysAccountInfo?: {
    __typename: "PointSysAccountInfo";
    address?: string | null;
    isRegistered?: boolean | null;
    seedUserInviteCode?: string | null;
    inviteCode?: string | null;
    inviteCount?: number | null;
    totalPointsEarned?: string | null;
    availablePoints?: string | null;
    isPointsAccelerationActive?: boolean | null;
    todayHoldingTVL?: string | null;
    todayHoldingAccelerationRatio?: string | null;
    isHighestLevel?: boolean | null;
    nextLevelHoldingTVL?: string | null;
    nextLevelHoldingAccelerationRatio?: string | null;
    activityCards?: Array<{
      __typename: "PointSysActivityCard";
      type?: string | null;
      accelerationRatio?: string | null;
      startTime?: string | null;
      endTime?: string | null;
    } | null> | null;
  } | null;
};

export type PointSysRankingQueryVariables = {};

export type PointSysRankingQuery = {
  pointSysRanking?: Array<{
    __typename: "PointSysRankingInfo";
    address?: string | null;
    avatar?: string | null;
    username?: string | null;
    twitterUsername?: string | null;
    totalPointsEarned?: string | null;
    inviterAvatar?: string | null;
    inviterUsername?: string | null;
    inviterTwitterUsername?: string | null;
  } | null> | null;
};

export type Phase2PointSysInviteCodeVerifyQueryVariables = {
  inviteCode?: string | null;
};

export type Phase2PointSysInviteCodeVerifyQuery = {
  phase2PointSysInviteCodeVerify?: boolean | null;
};

export type Phase2PointSysAccountInfoQueryVariables = {
  address?: string | null;
};

export type Phase2PointSysAccountInfoQuery = {
  phase2PointSysAccountInfo?: {
    __typename: "PointSysAccountInfo";
    address?: string | null;
    isRegistered?: boolean | null;
    seedUserInviteCode?: string | null;
    inviteCode?: string | null;
    inviteCount?: number | null;
    totalPointsEarned?: string | null;
    availablePoints?: string | null;
    isPointsAccelerationActive?: boolean | null;
    todayHoldingTVL?: string | null;
    todayHoldingAccelerationRatio?: string | null;
    isHighestLevel?: boolean | null;
    nextLevelHoldingTVL?: string | null;
    nextLevelHoldingAccelerationRatio?: string | null;
    activityCards?: Array<{
      __typename: "PointSysActivityCard";
      type?: string | null;
      accelerationRatio?: string | null;
      startTime?: string | null;
      endTime?: string | null;
    } | null> | null;
  } | null;
};

export type Phase2PointSysRankingQueryVariables = {};

export type Phase2PointSysRankingQuery = {
  phase2PointSysRanking?: Array<{
    __typename: "PointSysRankingInfo";
    address?: string | null;
    avatar?: string | null;
    username?: string | null;
    twitterUsername?: string | null;
    totalPointsEarned?: string | null;
    inviterAvatar?: string | null;
    inviterUsername?: string | null;
    inviterTwitterUsername?: string | null;
  } | null> | null;
};

export type BtcStatsQueryVariables = {};

export type BtcStatsQuery = {
  btcStats?: {
    __typename: "BTCStats";
    supportedChains?: Array<{
      __typename: "BtcFofInfo";
      chainId?: number | null;
      poolSlotInfoId?: number | null;
      order?: number | null;
    } | null> | null;
    totalInvestors?: number | null;
    totalTvlUSD?: string | null;
    totalAmount?: string | null;
    totalSolvBtcAmount?: string | null;
    tvlDetail?: Array<{
      __typename: "TvlDetail";
      chainId?: number | null;
      amount?: string | null;
      tvl?: string | null;
    } | null> | null;
    detail?: Array<{
      __typename: "BTCDetail";
      chainId?: number | null;
      slot?: string | null;
      symbol?: string | null;
      amount?: string | null;
      currentPrice?: string | null;
    } | null> | null;
  } | null;
};

export type PoolsApyQueryVariables = {
  filter?: PoolFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type PoolsApyQuery = {
  poolsApy?: {
    __typename: "Pools";
    totalCount: number;
    poolsInfo: Array<{
      __typename: "PoolSlotInfo";
      id: number;
      fundType?: string | null;
      interestType?: string | null;
      maturityDate?: number | null;
      redemptionPeriod?: number | null;
      isTransferable?: boolean | null;
      // fundraisingStartTime: Int
      // fundraisingEndTime: Int
      totalAmount?: string | null;
      // repaidValue: String
      // claimedValue: String
      nav?: string | null;
      apy?: string | null;
      historyApy?: string | null;
      aum?: string | null;
      couponRate?: string | null;
      isInterestRateSet?: boolean | null;
      totalRepaidValue?: string | null;
      manualOrder?: number | null;
      compositeIcon?: string | null;
      additionalRewards?: string | null;
      subtype?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      pointRatio?: string | null;
      isYieldPool?: boolean | null;
      yieldType?: string | null;
      aumUSD?: string | null;
      isUpgradedRouterV2?: boolean | null;
    }>;
  } | null;
};

export type BtcTvlByChainQueryVariables = {
  chainId?: number | null;
};

export type BtcTvlByChainQuery = {
  btcTvlByChain?: {
    __typename: "BTCTvlInfo";
    chainId?: number | null;
    tvl?: string | null;
    investors?: number | null;
  } | null;
};

export type BtcPoolInfoQueryVariables = {
  filter?: PoolFilter | null;
};

export type BtcPoolInfoQuery = {
  btcPoolInfo?: {
    __typename: "BtcPoolInfo";
    poolInfo?: {
      __typename: "PoolSlotInfo";
      id: number;
      fundType?: string | null;
      interestType?: string | null;
      maturityDate?: number | null;
      redemptionPeriod?: number | null;
      isTransferable?: boolean | null;
      // fundraisingStartTime: Int
      // fundraisingEndTime: Int
      totalAmount?: string | null;
      // repaidValue: String
      // claimedValue: String
      nav?: string | null;
      apy?: string | null;
      historyApy?: string | null;
      aum?: string | null;
      couponRate?: string | null;
      isInterestRateSet?: boolean | null;
      totalRepaidValue?: string | null;
      manualOrder?: number | null;
      compositeIcon?: string | null;
      additionalRewards?: string | null;
      subtype?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      pointRatio?: string | null;
      isYieldPool?: boolean | null;
      yieldType?: string | null;
      aumUSD?: string | null;
      isUpgradedRouterV2?: boolean | null;
    } | null;
    wrappedTokenInfo?: {
      __typename: "WrappedTokenInfo";
      tokenAddress?: string | null;
      symbol?: string | null;
      decimals?: number | null;
      name?: string | null;
    } | null;
    routerContract?: {
      __typename: "RouterContractInfo";
      chainId?: number | null;
      contractAddress?: string | null;
    } | null;
    xpoolAddress?: string | null;
  } | null;
};

export type SupportedChainsQueryVariables = {};

export type SupportedChainsQuery = {
  supportedChains?: Array<{
    __typename: "BtcFofInfo";
    chainId?: number | null;
    poolSlotInfoId?: number | null;
    order?: number | null;
  } | null> | null;
};

export type YieldPoolInfoQueryVariables = {
  fofPoolSlotInfoId?: number | null;
};

export type YieldPoolInfoQuery = {
  yieldPoolInfo?: {
    __typename: "YieldPoolInfo";
    chainId?: number | null;
    poolSlotInfoId?: number | null;
    poolId?: string | null;
    tokenAddress?: string | null;
    routerContractAddress?: string | null;
    symbol?: string | null;
    decimals?: number | null;
    name?: string | null;
    slot?: string | null;
  } | null;
};

export type IsBtcWhitelistQueryVariables = {
  walletAddress: string;
};

export type IsBtcWhitelistQuery = {
  // yieldPools(filter: YieldPoolFilter): YieldPools
  isBtcWhitelist?: boolean | null;
};

export type BtcMainnetInfoQueryVariables = {};

export type BtcMainnetInfoQuery = {
  btcMainnetInfo?: {
    __typename: "BtcMainnetInfo";
    depositAddress?: string | null;
    depositNetwork?: string | null;
  } | null;
};

export type BtcWhitelistInfoQueryVariables = {
  walletAddress: string;
};

export type BtcWhitelistInfoQuery = {
  btcWhitelistInfo?: {
    __typename: "BtcWhitelistInfo";
    isBtcWhitelist: boolean;
    btcDepositPlatForm?: string | null;
    btcDepositAddress?: string | null;
  } | null;
};

export type DefiPointRatioQueryVariables = {};

export type DefiPointRatioQuery = {
  defiPointRatio?: Array<{
    __typename: "DefiPointRatioInfo";
    chainId?: number | null;
    chainName?: string | null;
    protocol?: string | null;
    task?: string | null;
    // symbol: String
    // tokenAddress: String
    pointRatio?: number | null;
    url?: string | null;
    order?: number | null;
  } | null> | null;
};

export type YieldPoolSupportedChainsQueryVariables = {
  yieldType?: string | null;
};

export type YieldPoolSupportedChainsQuery = {
  yieldPoolSupportedChains?: Array<{
    __typename: "BtcYieldPoolInfo";
    chainId?: number | null;
    poolSlotInfoId?: number | null;
    yieldType?: string | null;
    routerVersion?: string | null;
    order?: number | null;
  } | null> | null;
};

export type YieldPoolStatsQueryVariables = {
  yieldType?: string | null;
};

export type YieldPoolStatsQuery = {
  yieldPoolStats?: {
    __typename: "YieldPoolStats";
    yieldType?: string | null;
    tvl?: string | null;
    apy?: string | null;
    estimatedAprMin?: string | null;
    estimatedAprMax?: string | null;
    pointsEarned?: string | null;
  } | null;
};

export type SupportedChainsMQueryVariables = {};

export type SupportedChainsMQuery = {
  supportedChainsM?: Array<{
    __typename: "BtcFofInfoM";
    chainId?: number | null;
    idAndCurrency?: Array<{
      __typename: "IdAndCurrency";
      poolSlotInfoId?: number | null;
      currencySymbol?: string | null;
    } | null> | null;
    order?: number | null;
  } | null> | null;
};

export type LiquidityByChainQueryVariables = {
  phase?: number | null;
  assetType?: Array<string | null> | null;
  protocol?: string | null;
};

export type LiquidityByChainQuery = {
  liquidityByChain?: Array<{
    __typename: "ChainLiquidityInfo";
    chainId?: number | null;
    chainName?: string | null;
    totalTvl?: string | null;
    highestApy?: string | null;
    highestPointRatio?: number | null;
    url?: string | null;
    order?: number | null;
    details?: Array<{
      __typename: "LiquidityInfo";
      chainId?: number | null;
      chainName?: string | null;
      protocol?: string | null;
      task?: string | null;
      tvl?: string | null;
      apy?: string | null;
      url?: string | null;
      pointRatio?: number | null;
      description?: string | null;
      extraPointsReward?: boolean | null;
      pointsRewardTitle?: string | null;
      pointsRewardContent?: string | null;
      extraTokenReward?: boolean | null;
      tokenRewardTitle?: string | null;
      tokenRewardContent?: string | null;
      boosting?: boolean | null;
      assetType?: string | null;
      rewardInfo?: string | null;
      logoUrl?: string | null;
    } | null> | null;
    chainReward?: string | null;
    description?: string | null;
  } | null> | null;
};

export type LiquidityByProtocolQueryVariables = {
  phase?: number | null;
  assetType?: Array<string | null> | null;
};

export type LiquidityByProtocolQuery = {
  liquidityByProtocol?: Array<{
    __typename: "ProtocolLiquidityInfo";
    protocol?: string | null;
    totalTvl?: string | null;
    highestApy?: string | null;
    highestPointRatio?: number | null;
    order?: number | null;
    details?: Array<{
      __typename: "LiquidityInfo";
      chainId?: number | null;
      chainName?: string | null;
      protocol?: string | null;
      task?: string | null;
      tvl?: string | null;
      apy?: string | null;
      url?: string | null;
      pointRatio?: number | null;
      description?: string | null;
      extraPointsReward?: boolean | null;
      pointsRewardTitle?: string | null;
      pointsRewardContent?: string | null;
      extraTokenReward?: boolean | null;
      tokenRewardTitle?: string | null;
      tokenRewardContent?: string | null;
      boosting?: boolean | null;
      assetType?: string | null;
      rewardInfo?: string | null;
      logoUrl?: string | null;
    } | null> | null;
  } | null> | null;
};

export type LiquidityByAssetQueryVariables = {
  phase?: number | null;
};

export type LiquidityByAssetQuery = {
  liquidityByAsset?: Array<{
    __typename: "AssetsLiquidityInfo";
    assetType?: string | null;
    totalTvl?: string | null;
    highestApy?: string | null;
    highestPointRatio?: number | null;
    url?: string | null;
    order?: number | null;
    details?: Array<{
      __typename: "LiquidityInfo";
      chainId?: number | null;
      chainName?: string | null;
      protocol?: string | null;
      task?: string | null;
      tvl?: string | null;
      apy?: string | null;
      url?: string | null;
      pointRatio?: number | null;
      description?: string | null;
      extraPointsReward?: boolean | null;
      pointsRewardTitle?: string | null;
      pointsRewardContent?: string | null;
      extraTokenReward?: boolean | null;
      tokenRewardTitle?: string | null;
      tokenRewardContent?: string | null;
      boosting?: boolean | null;
      assetType?: string | null;
      rewardInfo?: string | null;
      logoUrl?: string | null;
    } | null> | null;
  } | null> | null;
};

export type SolvbtcAssetsQueryVariables = {};

export type SolvbtcAssetsQuery = {
  solvbtcAssets?: {
    __typename: "SolvBtcAssets";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    assets?: Array<{
      __typename: "SolvBtcAsset";
      assetName?: string | null;
      assetAmount?: string | null;
      order: number;
    } | null> | null;
  } | null;
};

export type SolvbtcLiabilitiesQueryVariables = {};

export type SolvbtcLiabilitiesQuery = {
  solvbtcLiabilities?: {
    __typename: "SolvBtcLiabilities";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    liabilities?: Array<{
      __typename: "SolvBtcLiability";
      chainName?: string | null;
      tokenAddress?: string | null;
      url?: string | null;
      totalSupply?: string | null;
      order: number;
    } | null> | null;
  } | null;
};

export type DexsQueryVariables = {
  filter?: DexFilter | null;
};

export type DexsQuery = {
  dexs?: Array<{
    __typename: "DexInfo";
    chainId?: number | null;
    chainName?: string | null;
    assetName?: string | null;
    dexName?: string | null;
    tokenPair?: string | null;
    dexUrl?: string | null;
    tvl?: string | null;
  } | null> | null;
};

export type RedeemablesQueryVariables = {
  assetName?: string | null;
  redeemAmount?: string | null;
};

export type RedeemablesQuery = {
  redeemables?: Array<{
    __typename: "RedeemableInfo";
    chainId?: number | null;
    chainName?: string | null;
    redeemableAmount?: string | null;
    curencySymbol?: string | null;
    assetName?: string | null;
    bridge?: string | null;
  } | null> | null;
};

export type SolvbtcReservesQueryVariables = {};

export type SolvbtcReservesQuery = {
  solvbtcReserves?: {
    __typename: "SolvBtcAssets";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    assets?: Array<{
      __typename: "SolvBtcAsset";
      assetName?: string | null;
      assetAmount?: string | null;
      order: number;
    } | null> | null;
  } | null;
};

export type SolvbtcIssuancesQueryVariables = {};

export type SolvbtcIssuancesQuery = {
  solvbtcIssuances?: {
    __typename: "SolvBtcLiabilities";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    liabilities?: Array<{
      __typename: "SolvBtcLiability";
      chainName?: string | null;
      tokenAddress?: string | null;
      url?: string | null;
      totalSupply?: string | null;
      order: number;
    } | null> | null;
  } | null;
};

export type SolvbtcBbnReservesQueryVariables = {};

export type SolvbtcBbnReservesQuery = {
  solvbtcBbnReserves?: {
    __typename: "SolvBtcYTReserves";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    reserves?: Array<{
      __typename: "SolvBtcYTReserve";
      vault?: string | null;
      vaultAddress?: string | null;
      url?: string | null;
      amount?: string | null;
    } | null> | null;
  } | null;
};

export type SolvbtcBbnIssuancesQueryVariables = {};

export type SolvbtcBbnIssuancesQuery = {
  solvbtcBbnIssuances?: {
    __typename: "SolvBtcYTIssuances";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    issuances?: Array<{
      __typename: "SolvBtcYTIssuance";
      chainName?: string | null;
      tokenAddress?: string | null;
      url?: string | null;
      totalSupply?: string | null;
      order: number;
    } | null> | null;
  } | null;
};

export type SolvbtcEnaReservesQueryVariables = {};

export type SolvbtcEnaReservesQuery = {
  solvbtcEnaReserves?: {
    __typename: "SolvBtcYTReserves";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    reserves?: Array<{
      __typename: "SolvBtcYTReserve";
      vault?: string | null;
      vaultAddress?: string | null;
      url?: string | null;
      amount?: string | null;
    } | null> | null;
  } | null;
};

export type SolvbtcEnaIssuancesQueryVariables = {};

export type SolvbtcEnaIssuancesQuery = {
  solvbtcEnaIssuances?: {
    __typename: "SolvBtcYTIssuances";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    issuances?: Array<{
      __typename: "SolvBtcYTIssuance";
      chainName?: string | null;
      tokenAddress?: string | null;
      url?: string | null;
      totalSupply?: string | null;
      order: number;
    } | null> | null;
  } | null;
};

export type NeedRegisterQueryVariables = {
  address?: string | null;
};

export type NeedRegisterQuery = {
  needRegister?: boolean | null;
};

export type LstsQueryVariables = {};

export type LstsQuery = {
  lsts?: {
    __typename: "Lsts";
    stakingBTCAmount?: string | null;
    users?: number | null;
    ecosystems?: string | null;
    details?: Array<{
      __typename: "LstInfo";
      protocol?: string | null;
      alias?: string | null;
      category?: string | null;
      btcAmount?: string | null;
      tvlUsd?: string | null;
      validator?: string | null;
      apy?: string | null;
      estApy?: string | null;
      apyText?: Array<string | null> | null;
      rewards?: string | null;
      yieldDistributor?: string | null;
      url?: string | null;
      order?: number | null;
      apyUpdateTime?: number | null;
    } | null> | null;
  } | null;
};

export type BridgeSupportedAssetsQueryVariables = {};

export type BridgeSupportedAssetsQuery = {
  bridgeSupportedAssets?: Array<string | null> | null;
};

export type BridgeSupportedChainsQueryVariables = {
  assetName: string;
};

export type BridgeSupportedChainsQuery = {
  bridgeSupportedChains?: {
    __typename: "Chains";
    fromChains?: Array<{
      __typename: "ChainInfo";
      chainName: string;
      chainId: number;
      tokenAddress?: string | null;
    } | null> | null;
    toChains?: Array<{
      __typename: "ChainInfo";
      chainName: string;
      chainId: number;
      tokenAddress?: string | null;
    } | null> | null;
  } | null;
};

export type GetSupportedBridgesQueryVariables = {
  assetName?: string | null;
  sourceChain?: string | null;
  targetChain?: string | null;
};

export type GetSupportedBridgesQuery = {
  getSupportedBridges?: Array<{
    __typename: "Bridge";
    bridgeName: string;
    bridgeUrl: string;
    description: string;
  } | null> | null;
};

export type EligibilityCheckQueryVariables = {
  address: string;
  rewardType?: string | null;
};

export type EligibilityCheckQuery = {
  eligibilityCheck?: {
    __typename: "AirdropInfo";
    totalPoints?: string | null;
    userType?: string | null;
    chainId?: number | null;
    tokenAddress?: string | null;
    signer?: string | null;
    stagesInfo?: Array<{
      __typename: "StageInfo";
      stageNo?: number | null;
      rewardType?: string | null;
      totalClaimable?: string | null;
      pointSysReward?: string | null;
      earlyUserReward?: string | null;
      campaignReward?: string | null;
      baseBtcAmount?: string | null;
      averageHoldingAmount?: string | null;
      claimableBeginTime?: number | null;
      expireTime?: number | null;
      nonce?: string | null;
      signature?: string | null;
      state?: string | null;
      startTime?: string | null;
      endTime?: string | null;
    } | null> | null;
  } | null;
};

export type ManagementBtcStakeRecordsQueryVariables = {
  btcRecordsFilter: BtcRecordsFilter;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type ManagementBtcStakeRecordsQuery = {
  managementBtcStakeRecords?: {
    __typename: "ManagementBtcStakeRecords";
    totalCount?: number | null;
    btcStakeMintRecord?: Array<{
      __typename: "ManagementBtcStakeRecord";
      id: number;
      chainId: number;
      recordType: string;
      depositAmount: string;
      depositTxHash: string;
      depositFromAddress: string;
      depositToAddress: string;
      transferToAddress?: string | null;
      claimTxHash?: string | null;
      state?: string | null;
      signState?: string | null;
      btcMinterContractAddress?: string | null;
      createdAt?: string | null;
    } | null> | null;
  } | null;
};

export type UserBtcStakeRecordsQueryVariables = {
  btcRecordsFilter: UserBtcRecordsFilter;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type UserBtcStakeRecordsQuery = {
  userBtcStakeRecords?: {
    __typename: "UserBtcStakeRecords";
    totalCount?: number | null;
    btcStakeMintRecord?: Array<{
      __typename: "UserBtcStakeRecord";
      id: number;
      chainId: number;
      tokenAddress: string;
      depositAmount: string;
      depositTxHash: string;
      state?: string | null;
      signature?: string | null;
      btcMinterContractAddress?: string | null;
      opReturnHash?: string | null;
      signer?: string | null;
      claimTxHash?: string | null;
      createdAt?: string | null;
    } | null> | null;
  } | null;
};

export type GetBtcTxInfoQueryVariables = {
  txHash: string;
};

export type GetBtcTxInfoQuery = {
  getBtcTxInfo?: {
    __typename: "BtcTxInfo";
    depositFromAddress?: string | null;
    depositToAddress?: string | null;
    depositAmount?: string | null;
    depositTxHash?: string | null;
    blockHeight?: number | null;
    lastHeight?: number | null;
    txInfo?: string | null;
  } | null;
};

export type GetSigningMessageQueryVariables = {
  depositTxHash: string;
  signer?: string | null;
};

export type GetSigningMessageQuery = {
  getSigningMessage?: string | null;
};

export type GetVaultRetailAddressQueryVariables = {};

export type GetVaultRetailAddressQuery = {
  getVaultRetailAddress?: string | null;
};

export type GetRedemptionFeeRateQueryVariables = {
  chainId?: number | null;
  poolId?: string | null;
};

export type GetRedemptionFeeRateQuery = {
  getRedemptionFeeRate?: string | null;
};

export type SigningRecordsQueryVariables = {
  pagination?: Pagination | null;
};

export type SigningRecordsQuery = {
  signingRecords?: {
    __typename: "SigningRecords";
    totalCount?: number | null;
    signingRecords?: Array<{
      __typename: "SigningRecord";
      depositTxHash?: string | null;
      message?: string | null;
      signMessageHash?: string | null;
      updatedAt?: string | null;
    } | null> | null;
  } | null;
};

export type TotalPointsQueryVariables = {};

export type TotalPointsQuery = {
  totalPoints?: string | null;
};

export type StakingStatsQueryVariables = {
  poolId: string;
  stageNo: number;
};

export type StakingStatsQuery = {
  stakingStats?: {
    __typename: "StakingStats";
    stakingTvl?: string | null;
    totalStakingRewards?: string | null;
    airdropRewards?: string | null;
    currentTotalStakingPower?: string | null;
    stakingAPR?: string | null;
    startDate?: string | null;
    endDate?: string | null;
  } | null;
};

export type EstimatedRewardsQueryVariables = {
  address: string;
  stageNo: number;
};

export type EstimatedRewardsQuery = {
  estimatedRewards?: {
    __typename: "EstimatedReward";
    stakingPower?: string | null;
    currentTotalStakingPower?: string | null;
    estimatedReward?: string | null;
  } | null;
};

export type SolvbtcCoreReservesQueryVariables = {};

export type SolvbtcCoreReservesQuery = {
  solvbtcCoreReserves?: {
    __typename: "SolvBtcYTReserves";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    reserves?: Array<{
      __typename: "SolvBtcYTReserve";
      vault?: string | null;
      vaultAddress?: string | null;
      url?: string | null;
      amount?: string | null;
    } | null> | null;
  } | null;
};

export type SolvbtcCoreIssuancesQueryVariables = {};

export type SolvbtcCoreIssuancesQuery = {
  solvbtcCoreIssuances?: {
    __typename: "SolvBtcYTIssuances";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    issuances?: Array<{
      __typename: "SolvBtcYTIssuance";
      chainName?: string | null;
      tokenAddress?: string | null;
      url?: string | null;
      totalSupply?: string | null;
      order: number;
    } | null> | null;
  } | null;
};

export type SolvbtcJupReservesQueryVariables = {};

export type SolvbtcJupReservesQuery = {
  solvbtcJupReserves?: {
    __typename: "SolvBtcJupReserves";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    reserves?: Array<{
      __typename: "SolvBtcJupReserve";
      vault?: string | null;
      vaultAddress?: string | null;
      url?: string | null;
      amount?: string | null;
      assetName?: string | null;
      btcAmount?: string | null;
    } | null> | null;
  } | null;
};

export type SolvbtcJupIssuancesQueryVariables = {};

export type SolvbtcJupIssuancesQuery = {
  solvbtcJupIssuances?: {
    __typename: "SolvBtcYTIssuances";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    issuances?: Array<{
      __typename: "SolvBtcYTIssuance";
      chainName?: string | null;
      tokenAddress?: string | null;
      url?: string | null;
      totalSupply?: string | null;
      order: number;
    } | null> | null;
  } | null;
};

export type SolvbtcMReservesQueryVariables = {};

export type SolvbtcMReservesQuery = {
  solvbtcMReserves?: {
    __typename: "SolvBtcYTReserves";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    reserves?: Array<{
      __typename: "SolvBtcYTReserve";
      vault?: string | null;
      vaultAddress?: string | null;
      url?: string | null;
      amount?: string | null;
    } | null> | null;
  } | null;
};

export type SolvbtcMIssuancesQueryVariables = {};

export type SolvbtcMIssuancesQuery = {
  solvbtcMIssuances?: {
    __typename: "SolvBtcYTIssuances";
    snapshotTime?: number | null;
    totalAmount?: string | null;
    issuances?: Array<{
      __typename: "SolvBtcYTIssuance";
      chainName?: string | null;
      tokenAddress?: string | null;
      url?: string | null;
      totalSupply?: string | null;
      order: number;
    } | null> | null;
  } | null;
};

export type BabylonRelationQueryVariables = {
  evmAddress: string;
};

export type BabylonRelationQuery = {
  babylonRelation?: {
    __typename: "BabylonRelationInfo";
    isRelation?: boolean | null;
    evmAddress?: string | null;
    babylonAddress?: string | null;
    points?: string | null;
  } | null;
};

export type ProtocolListQueryVariables = {};

export type ProtocolListQuery = {
  protocolList?: Array<string | null> | null;
};

export type ProtocolInfoListQueryVariables = {};

export type ProtocolInfoListQuery = {
  protocolInfoList?: Array<{
    __typename: "ProtocolInfo";
    protocol?: string | null;
    logoUrl?: string | null;
  } | null> | null;
};

export type BroInfoQueryVariables = {};

export type BroInfoQuery = {
  broInfo?: {
    __typename: "BroInfo";
    totalRaised?: string | null;
    revenueFromBRO?: string | null;
    pieChartData?: Array<{
      __typename: "FundDistribution";
      name?: string | null;
      value?: string | null;
    } | null> | null;
  } | null;
};

export type SolvbtcFeeQueryVariables = {
  poolId?: string | null;
  symbol?: string | null;
};

export type SolvbtcFeeQuery = {
  solvbtcFee?: string | null;
};

export type NonEvmAssetsQueryVariables = {
  filter?: NonEvmAssetFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type NonEvmAssetsQuery = {
  nonEvmAssets?: {
    __typename: "NonEvmAssets";
    totalCount?: number | null;
    nonEvmAssets?: Array<{
      __typename: "NonEvmAssetInfo";
      chainId?: number | null;
      tokenAddress?: string | null;
      holder?: string | null;
      symbol?: string | null;
      name?: string | null;
      balance?: string | null;
      decimals?: number | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null> | null;
  } | null;
};

export type NonEvmAssetsByHolderQueryVariables = {
  holder?: string | null;
  vaultName?: string | null;
};

export type NonEvmAssetsByHolderQuery = {
  nonEvmAssetsByHolder?: {
    __typename: "UserNonEvmAssetsInfo";
    totalBalanceUSD?: string | null;
    numberOfVaults?: number | null;
  } | null;
};

export type NonEvmActivitiesQueryVariables = {
  filter?: NonEvmActivityFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type NonEvmActivitiesQuery = {
  nonEvmActivities?: {
    __typename: "NonEvmActivities";
    totalCount?: number | null;
    activitiesInfo: Array<{
      __typename: "NonEvmActivity";
      id: number;
      chainId?: number | null;
      txHash?: string | null;
      fromAddress?: string | null;
      toAddress?: string | null;
      amount?: string | null;
      decimals?: number | null;
      name?: string | null;
      symbol?: string | null;
      productName?: string | null;
      blockTimestamp?: number | null;
      txDetail?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    }>;
  } | null;
};

export type NonEvmVaultInfoQueryVariables = {
  vaultName?: string | null;
};

export type NonEvmVaultInfoQuery = {
  nonEvmVaultInfo?: {
    __typename: "NonEvmVaultInfo";
    vaultAddress?: string | null;
    vaultName?: string | null;
    description?: string | null;
    pointRatio?: string | null;
    tokenAddress?: string | null;
    symbol?: string | null;
    decimals?: number | null;
    tvl?: string | null;
    tvlUSD?: string | null;
    apy?: string | null;
  } | null;
};

export type NonEvmSaleInfoQueryVariables = {
  vaultName?: string | null;
};

export type NonEvmSaleInfoQuery = {
  nonEvmSaleInfo?: {
    __typename: "NonEvmSaleInfo";
    amountRaised?: string | null;
    amountRemaining?: string | null;
  } | null;
};

export type SolvBtcGenernalQueryVariables = {};

export type SolvBtcGenernalQuery = {
  solvBtcGenernal?: {
    __typename: "SolvBtcData";
    tvl?: string | null;
    tvlUSD?: string | null;
    users?: number | null;
    timestamp?: number | null;
  } | null;
};

export type XSolvBtcGenernalQueryVariables = {};

export type XSolvBtcGenernalQuery = {
  xSolvBtcGenernal?: {
    __typename: "XSolvBtcData";
    tvl?: string | null;
    tvlUSD?: string | null;
    price?: string | null;
    apy?: string | null;
    timestamp?: number | null;
  } | null;
};

export type SolvbtcInCirculationQueryVariables = {};

export type SolvbtcInCirculationQuery = {
  solvbtcInCirculation?: {
    __typename: "SolvBtcInCirculation";
    tvl?: string | null;
    details?: Array<{
      __typename: "PercentageByChain";
      chainName?: string | null;
      percentage?: string | null;
    } | null> | null;
  } | null;
};

export type XSolvbtcInCirculationQueryVariables = {};

export type XSolvbtcInCirculationQuery = {
  xSolvbtcInCirculation?: {
    __typename: "XSolvBtcInCirculation";
    tvl?: string | null;
    details?: Array<{
      __typename: "PercentageByChain";
      chainName?: string | null;
      percentage?: string | null;
    } | null> | null;
  } | null;
};

export type SolvBtcBackingQueryVariables = {};

export type SolvBtcBackingQuery = {
  solvBtcBacking?: {
    __typename: "SolvBtcBacking";
    tvl?: string | null;
    details?: Array<{
      __typename: "PercentageByAsset";
      assetName?: string | null;
      percentage?: string | null;
    } | null> | null;
  } | null;
};

export type IsBtcRedeemWhitelistQueryVariables = {
  address?: string | null;
};

export type IsBtcRedeemWhitelistQuery = {
  isBtcRedeemWhitelist?: boolean | null;
};

export type GetBtcRedeemContractQueryVariables = {
  chainId?: number | null;
};

export type GetBtcRedeemContractQuery = {
  getBtcRedeemContract?: {
    __typename: "RedeemContractInfo";
    redeemContract?: string | null;
    solvbtcAddress?: string | null;
  } | null;
};

export type BtcWithdrawHistoryQueryVariables = {
  filter?: BtcRedeemFilter | null;
  pagination?: Pagination | null;
  sort?: Sort | null;
};

export type BtcWithdrawHistoryQuery = {
  btcWithdrawHistory?: {
    __typename: "BtcRedeemRecords";
    totalCount?: number | null;
    records?: Array<{
      __typename: "BtcRedeemRecord";
      id?: number | null;
      burnAmount?: string | null;
      burnHash?: string | null;
      fromAddress?: string | null;
      withdrawToAddress?: string | null;
      withdrawAmount?: string | null;
      chainId?: number | null;
      chainName?: string | null;
      state?: string | null;
      btcTransferHash?: string | null;
      withdrawTime?: number | null;
      completionTime?: number | null;
    } | null> | null;
  } | null;
};
