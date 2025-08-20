import {
  beautyAmount,
  dividedBy,
  minus,
  multipliedBy,
  outputTokenAmount
} from "./utils";

export const formatAddress = (
  address: string | undefined,
  prefixLength: number = 6,
  suffixLength: number = 4
): string => {
  if (!address || address.length < prefixLength + suffixLength) {
    return address || "";
  }

  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
};

export const truncateToDecimals = (
  value: number | string,
  decimals: number = 2
): string => {
  const str = String(value);
  const match = str.match(/^(-?\d+)(?:\.(\d*))?/);
  if (!match) return `${str}.${"0".repeat(decimals)}`;
  const [, integer, fraction = ""] = match;
  return `${integer}.${fraction.slice(0, decimals).padEnd(decimals, "0")}`;
};

export const formatNumber = (value: number | string): string => {
  const valueStr = value.toString().trim();
  if (!valueStr || valueStr === "." || !/^[0-9]*\.?[0-9]*$/.test(valueStr))
    return "";

  const [integerPart, decimalPart = ""] = valueStr.split(".");

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : `${formattedInteger}.00`;
};

export const restrictDecimals = (
  value: number | string,
  decimals: number
): string => {
  const valueStr = value.toString().trim();
  if (!valueStr || valueStr === ".") return "";
  if (!/^[0-9]*\.?[0-9]*$/.test(valueStr)) return "";
  const [integerPart, decimalPart = ""] = valueStr.split(".");
  if (!decimalPart || decimalPart.length <= decimals) {
    return valueStr;
  }
  const trimmedDecimal = decimalPart.slice(0, decimals);
  return trimmedDecimal ? `${integerPart}.${trimmedDecimal}` : integerPart;
};

export const GET_TOKEN_ICON = (symbol: string, fix = "png") => {
  return `https://res1.sft-api.com/token/${encodeURIComponent(symbol)}.${fix}`;
};

export const GET_NETWORK_ICON = (network: string, fix = "jpg") => {
  return `https://res1.sft-api.com/chain/${network}-network.${fix}`;
};

export const handleDepositExchangeRate = (
  depositFee: string,
  nav?: string,
  navDecimals?: number
) => {
  const res = beautyAmount({
    value: dividedBy(
      multipliedBy(1, minus(1, depositFee)),
      outputTokenAmount(nav ?? 1 * 1e18 + "", navDecimals ?? 18)
    )
  });

  return res;
};

export const realDepositExchangeRate = (
  depositFee: string,
  nav?: string,
  navDecimals?: number
) => {
  const res = dividedBy(
    multipliedBy(1, minus(1, depositFee)),
    outputTokenAmount(nav ?? 1 * 1e18 + "", navDecimals ?? 18)
  );
  return res;
};
