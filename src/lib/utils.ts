import { BigNumber } from "bignumber.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

interface BeautyAmountProps {
  value: string | number | BigNumber;
  thousands?: boolean;
  mantissa?: boolean;
  poly?: boolean;
  fixed?: number;
  minimumFractionDigits?: number;
  needBillion?: boolean;
}

export function isEmpty(value: string | number | boolean) {
  return (value ?? "") === "";
}

export function slotFormat(value: string, digits = 6): string {
  if (isEmpty(value)) {
    return "";
  }
  const data =
    value.toString().substring(0, digits) +
    "..." +
    value.substring(value.length, value.length - digits);
  return data;
}

export function addressFormat(value: string, digits = 4): string {
  if (isEmpty(value)) {
    return "";
  }
  const data =
    "0x" +
    value.toString().substring(2, digits + 2) +
    "..." +
    value.substring(value.length, value.length - digits);
  return data;
}

export function otherAddressFormat(value: string, digits = 6): string {
  if (isEmpty(value)) {
    return "";
  }
  const data =
    value.toString().substring(0, digits) +
    "..." +
    value.substring(value.length, value.length - digits);
  return data;
}

export function isGreaterThanOrEqualTo(
  val1: string | number | BigNumber,
  val2: string | number | BigNumber
): boolean {
  return (
    new BigNumber(val1).comparedTo(new BigNumber(val2)) == 1 ||
    new BigNumber(val1).comparedTo(new BigNumber(val2)) == 0
  );
}

export function isGreaterThan(
  val1: string | number | BigNumber,
  val2: string | number | BigNumber
): boolean {
  const res = new BigNumber(val1).comparedTo(new BigNumber(val2)) == 1;
  return res;
}

export function isEqual(
  val1: string | number | BigNumber,
  val2: string | number | BigNumber
): boolean {
  const res = new BigNumber(val1).comparedTo(new BigNumber(val2)) == 0;
  return res;
}

export function getCurrentTimestamp(): number {
  const currentDateTime: number = new Date().getTime();
  return Math.floor(currentDateTime / 1000);
}

export function viewTokenAmount(
  value: number | string,
  decimals: number,
  fixed = 6
) {
  if (isEmpty(value) || value === "0") {
    return "0";
  }

  const bigVal: BigNumber = new BigNumber(value);
  const pow: BigNumber = new BigNumber("10").pow(decimals);
  const res: string = bigVal.dividedBy(pow).toFixed(fixed, 1);

  return res === "NaN" ? "0" : res;
}

export function inputTokenAmount(value: number | string, decimals: number) {
  if (isEmpty(value) || value === "0") {
    return "0";
  }

  const bigVal: BigNumber = new BigNumber(value);
  const pow: BigNumber = new BigNumber("10").pow(decimals);
  const res: string = bigVal.multipliedBy(pow).toString(10);

  return res === "NaN" ? "0" : res;
}

export function outputTokenAmount(
  value: number | string,
  decimals: number | string
) {
  if (isEmpty(value) || value === "0") {
    return "0";
  }

  const bigVal: BigNumber = new BigNumber(value);
  const pow: BigNumber = new BigNumber("10").pow(decimals);
  const res: string = bigVal.dividedBy(pow).toString(10);

  return res === "NaN" ? "0" : res;
}

export function addressFormatAccountName(value: string, digits = 4): string {
  if (isEmpty(value)) {
    return "";
  }
  const data =
    value
      .toString()
      .substring(value.toString().includes("0x") ? 2 : 0, digits + 2) +
    value.substring(value.length, value.length - digits);
  return data;
}

// 35250000.123400 => 35,250,000.123400
export function thousandsValueFormat(value: string): string {
  const res = value.toString().replace(/\d+/, (n) => {
    return n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => {
      return $1 + ",";
    });
  });
  return res;
}

// 35250000.123400 => 35250000.1234
export function hideMantissa(value: string): string {
  value = value.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1");
  return value;
}

export const formatNumber = (value: string, fixed = 1): string => {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" }
  ];
  let i;

  for (i = si.length - 1; i > 0; i--) {
    if (isGreaterThanOrEqualTo(value, si[i].value)) {
      break;
    }
  }

  value = new BigNumber(value)
    .dividedBy(new BigNumber(si[i].value))
    .toFixed(fixed, 3);
  value = value.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1");

  return value + si[i].symbol;
};
export function tokenDivDecimals(
  value: string | number | BigNumber,
  decimals: number,
  fixed?: number
): string {
  if (!value) {
    return "0";
  }

  const bigVal: BigNumber = new BigNumber(value);
  const pow: BigNumber = new BigNumber("10").pow(decimals);
  const res: string = fixed
    ? bigVal.dividedBy(pow).toFixed(fixed, 1)
    : bigVal.dividedBy(pow).toString(10);

  return res === "NaN" ? "0" : res;
}
export function dateFormat(
  value: string | number,
  format = "YYYY/MM/DD"
): string {
  if (!value) {
    return "";
  }
  const res: string = dayjs(Number(value)).format(format);
  return res;
}

export function dateTimeFormat(value: string | number): string {
  if (!value) {
    return "";
  }
  return dayjs(Number(value)).format("YYYY/MM/DD HH:mm:ss");
}

export function dateUTCFormat(
  value: string | number,
  format = "YYYY/MM/DD"
): string {
  if (!value) {
    return "";
  }
  dayjs.extend(utc);
  const res: string = dayjs(Number(value)).utc().format(format);
  return res;
}

export function dateTimeUTCFormat(value: string | number): string {
  if (!value) {
    return "";
  }
  dayjs.extend(utc);
  return dayjs(Number(value)).utc().format("YYYY/MM/DD HH:mm:ss");
}

export function viewNull(str?: string) {
  return !str || str == "N/A" ? "--" : "--";
}
export function getDayjs(date?: string | number, isUTC?: boolean) {
  if (isUTC) {
    dayjs.extend(utc);
  }
  return date ? dayjs(date) : dayjs();
}

export function compareSort<T>(
  key: string,
  sortBy = "desc"
): (val1: T, val2: T) => number {
  return function (val1: T, val2: T) {
    const val1Data = val1 as unknown as Record<string, number>;
    const val2Data = val2 as unknown as Record<string, number>;
    const id1 = val1Data[key];
    const id2 = val2Data[key];
    return sortBy === "desc"
      ? Number(id2) - Number(id1)
      : Number(id1) - Number(id2);
  };
}

export function getSinglePropertyObj(arr: any, key: string) {
  let propertyObj: any = {};
  if (arr.length > 0) {
    propertyObj = arr.find((item: any) => {
      return item.name === key;
    });
  }
  return propertyObj || "";
}

export function getPropertyObj(arr: any) {
  const res: Record<string, unknown> = {};
  for (let i = 0; i < arr.length; i++) {
    res[arr[i].name] = {
      name: arr[i].name,
      value: arr[i].value,
      description: arr[i].description
    };
  }
  return res;
}

export function multipliedBy(val1: string | number, val2: string | number) {
  return new BigNumber(val1).multipliedBy(val2).toString(10);
}

export function dividedBy(
  val1: string | number,
  val2: string | number,
  fixed?: number
) {
  const value = new BigNumber(val1).dividedBy(val2);
  return fixed ? value.toFixed(fixed, 2) : value.toString(10);
}

export function isMaturity(maturity: number) {
  return isGreaterThanOrEqualTo(
    getCurrentTimestamp(),
    new Date(maturity * 1000).getTime() / 1000
  );
}

export function minus(
  val1: string | number,
  val2: string | number,
  fixed?: number
) {
  const value = new BigNumber(val1).minus(val2);
  return fixed ? value.toFixed(fixed, 2) : value.toString(10);
}

export function plus(
  val1: string | number,
  val2: string | number,
  fixed?: number
) {
  const value = new BigNumber(val1).plus(val2);
  return fixed ? value.toFixed(fixed, 2) : value.toString(10);
}

export const scrollTop = () => {
  const Timer = setInterval(() => {
    const toTop = document.body.scrollTop || document.documentElement.scrollTop;
    const speed = Math.ceil(toTop / 2);
    document.body.scrollTop = document.documentElement.scrollTop =
      toTop - speed;
    if (toTop < 0 || toTop == 0) {
      clearInterval(Timer);
    }
  }, 60);
};

export const toFixed = (
  value: string | number,
  roundingMode?: BigNumber.RoundingMode,
  fixed?: number
) => {
  return new BigNumber(value).toFixed(fixed || 0, roundingMode || 1);
};

export function comparisonDate(
  startTime: string | number,
  endTime: string | number,
  maturityDate?: string | number
) {
  const upcoming = isGreaterThan(startTime, getCurrentTimestamp());
  const active =
    isGreaterThanOrEqualTo(getCurrentTimestamp(), startTime) &&
    isGreaterThan(endTime, getCurrentTimestamp());
  const closed =
    maturityDate &&
    isGreaterThanOrEqualTo(getCurrentTimestamp(), endTime) &&
    isGreaterThan(getCurrentTimestamp(), maturityDate)
      ? true
      : false;
  const fundraising =
    maturityDate &&
    isGreaterThanOrEqualTo(getCurrentTimestamp(), endTime) &&
    isGreaterThan(maturityDate, getCurrentTimestamp())
      ? true
      : false;

  return { upcoming, active, closed, fundraising };
}

// '电子邮件地址必须包括 ( @ 和 . )';
export function emailCheck(emailStr: string) {
  const emailPat = /^(.+)@(.+)$/;
  const matchArray = emailPat.exec(emailStr);
  if (matchArray == null) {
    return false;
  }
  return true;
}

export function emailVerify(value: string) {
  const check = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
  return check.test(value);
}

export function formatHttpURL(value: string) {
  if (!value) value;
  if (value.startsWith("http:") || value.startsWith("https:")) return value;
  return `https://${value}`;
}

export function timeDifference(startTime: number, endTime: number) {
  const diff = endTime - startTime;

  const d = Math.floor(diff / 24 / 60 / 60);
  const h = Math.floor(diff / 60 / 60) % 24;
  const m = Math.floor(diff / 60) % 60;
  const s = Math.floor(diff) % 60;

  return {
    d,
    h,
    m,
    s,
    diff
  };
}

export function activityTransactionType(type: string) {
  const types: Record<string, string> = {
    SetInterestRate: "SetAPR"
  };

  return types[type] || type;
}

// APY 计算
export function calculateAPY(today: number, pastTime: number, days: number) {
  const growthRate =
    (Number(today) - Number(pastTime)) / Number(pastTime) / days;
  const myAPY = Math.pow(1 + growthRate, 360) - 1;

  return `${(myAPY * 100).toFixed(2)} %`;
}

export function formatRoundNumbers(number: number | string) {
  // const _number = Number(number).toFixed(0);
  // const str = _number.toString();
  // const first = str[0];
  // const value = first.padEnd(str.length, '0');
  return parseInt("0");
}

/**
 * 绩效费增发份额
 * 当录入净值（录入净值=录入基金总金额/录入基金总份额）大于HWM时，需要计算绩效费增发份额并展示
 * 绩效费=（录入基金总金额/录入基金增份额 - HWM ）* 录入基金总份额 * 表现费比例
 */
export function calcPerformanceFee(
  nav: string,
  hwm: string,
  totalAmount: string,
  carryRate: string
) {
  return multipliedBy(multipliedBy(minus(nav, hwm), totalAmount), carryRate);
}

/**
 * 平台费增发份额
 * 根据当前时间与上一次平台费收取时间的时间间隔计算平台费并展示。
 * 平台费=录入基金总金额*平台费费率/360*间隔天数（距离上次计算平台费的间隔天数）
 */
export function calcProtocolFee(
  totalValue: string,
  protocolFee: string,
  days: number
) {
  return multipliedBy(
    dividedBy(multipliedBy(totalValue, protocolFee), "360"),
    days
  );
}

/**
 * 展示净值=(录入基金总金额-绩效费-平台费)/录入基金总份额
 */
export function calcShowNav(
  totalValue: string,
  totalAmount: string,
  performanceFee: string,
  protocolFee: string
) {
  return dividedBy(
    minus(minus(totalValue, performanceFee), protocolFee),
    totalAmount
  );
}

// 将hex颜色转成rgb
export function hexToRgba(hex: string, opacity: number) {
  const RGBA = `rgba(${parseInt("0x" + hex.slice(1, 3))},${parseInt(
    "0x" + hex.slice(3, 5)
  )},${parseInt("0x" + hex.slice(5, 7))}, ${opacity})`;
  return {
    red: parseInt("0x" + hex.slice(1, 3)),
    green: parseInt("0x" + hex.slice(3, 5)),
    blue: parseInt("0x" + hex.slice(5, 7)),
    rgba: RGBA
  };
}

export function diffDay(
  date1: string | number,
  date2: string | number,
  offset = 0
) {
  return (
    Number(
      dayjs(dayjs(Number(date1 + "000")).format("YYYY-MM-DD")).diff(
        dayjs(Number(date2 + "000")).format("YYYY-MM-DD"),
        "day"
      )
    ) + offset
  );
}

export interface AddTokenToMetamaskParams {
  type: string;
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
}

export async function addTokenToMetamask(
  tokenInfo: AddTokenToMetamaskParams,
  provider: any
) {
  await provider.request({
    method: "wallet_watchAsset",
    params: {
      type: tokenInfo.type,
      options: {
        address: tokenInfo.address,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        image: tokenInfo.image
      }
    }
  });
}

export function getYieldPoolUnlockDate(
  redemptionFreq?: number | string | null
) {
  const monthText = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  let redeemDay = Number(redemptionFreq || 14) / 100;
  redeemDay = [14, 28].includes(redeemDay) ? redeemDay : 14;

  let date = 15;
  const dateEntry = new Date();
  const currentMonth = dateEntry.getUTCMonth() + 1;
  const currentDate = dateEntry.getUTCDate();

  if (currentMonth === 2) {
    date = currentDate >= 15 ? 28 : 15;
  } else {
    date = currentDate >= 15 ? 30 : 15;
  }

  if (redeemDay === 28) {
    date = currentMonth === 2 ? 28 : 30;
  }

  return `${monthText[currentMonth - 1]} ${date}th`;
}

// export const formatUTCDate = (utcTimestamp: number, includeTime = false): string => {
//   dayjs.extend(utc);
//   if (includeTime) {
//     return dayjs(utcTimestamp).format('MMMM D, YYYY HH:00 [UTC]');
//   }
//   return dayjs(utcTimestamp).format('MMMM D, YYYY');
// };

export const formatUTCDate = (
  utcTimestamp: number,
  includeTime = false
): string => {
  dayjs.extend(utc);
  const date = dayjs.utc(utcTimestamp).utc();

  if (includeTime) {
    return date.format("MMMM DD, YYYY HH:00 [UTC]");
  }
  return date.format("MMMM DD, YYYY");
};

export const fixedDecimals = (
  value: string,
  options?: { fixed?: number; isFixed?: boolean; mantissa?: boolean }
) => {
  const fixed =
      (options?.fixed ?? 0) != 0 ? options?.fixed || 4 : options?.fixed || 4,
    isFixed = options?.isFixed != undefined ? options.isFixed : true,
    mantissa = options?.mantissa || false;

  let res = mantissa ? hideMantissa(value) : value;
  res = toFixed(value || "0", 1, fixed);

  const decimals = res.split(".")[1]?.length || 0;

  if (!isFixed) {
    res = decimals <= 2 ? toFixed(res, 1, 2) : toFixed(res, 1, fixed);
  }

  return thousandsValueFormat(res);
};

export function handleChainLabel(chainLabel: string) {
  return chainLabel.toString().toLocaleLowerCase().replaceAll(" ", "-");
}

export function getCurItem(list: any[], keyTitle: string, row: any) {
  const itemObj = list.filter((item) => {
    return item.key === keyTitle;
  })[0];

  if (itemObj?.colNode?.(row)) {
    return itemObj.colNode(row);
  } else {
    return ``;
  }
}

export function decryptLocalStore(encryptedText: string) {
  let decrypted = "";

  // 遍历字符串，每次取两个字符，第一个是真正的字符，第二个是插入的随机字符
  for (let i = 0; i < encryptedText.length; i += 2) {
    decrypted += encryptedText[i];
  }

  return decrypted;
}

const localStoreSuffix = "VERS";

export function splicingStr(str: string) {
  return "_" + str + "p_" + localStoreSuffix + "IONID";
}

export function beautyAmount(
  {
    value,
    fixed,
    mantissa = true,
    thousands = true,
    poly = true,
    minimumFractionDigits,
    needBillion = true
  }: BeautyAmountProps,
  type = "token"
): string {
  let data = new BigNumber((value + "").replace("$", ""));

  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" }
  ];
  if (needBillion) {
    si.push({ value: 1e9, symbol: "B" });
  }
  let i = si.length - 1;

  if (poly) {
    for (i = si.length - 1; i > 0; i--) {
      if (isGreaterThanOrEqualTo(data, si[i].value)) {
        break;
      }
    }
    data = new BigNumber(data).dividedBy(new BigNumber(si[i].value));
  }

  if (type === "token") {
    fixed = fixed ? fixed : isGreaterThan("1", value) ? 6 : 4;
  } else {
    fixed = 2;
  }

  let res = mantissa ? hideMantissa(data.toString()) : data.toString();

  res = data.toFixed(fixed, 1);

  res = res === "NaN" ? "0" : res;
  // res = mantissa ? hideMantissa(res) : res;

  if (type === "token") {
    res = Number(res) + "";
    res = !res.includes(".") ? new BigNumber(res).toFixed(2, 1) : res;
    if (res.split(".")[1]) {
      const resLastLen = res.split(".")[1].length;
      res =
        resLastLen < 2
          ? new BigNumber(res).toFixed(2, 1)
          : resLastLen == 3 || resLastLen == 5
          ? new BigNumber(res).toFixed(resLastLen + 1, 1)
          : res;
    }
  } else {
    res = !res.includes(".") ? new BigNumber(res).toFixed(2, 1) : res;
    res =
      res.split(".")[1] && res.split(".")[1].length < 2
        ? new BigNumber(res).toFixed(2, 1)
        : res;
  }

  res = thousands ? thousandsValueFormat(res) : res;

  if (minimumFractionDigits !== undefined) {
    const fraction = res.split(".")[1] ?? "";
    if (fraction.length < minimumFractionDigits) {
      res = res.padEnd(
        res.length + minimumFractionDigits - fraction.length,
        "0"
      );
    }
  }

  return res + (poly ? si[i].symbol : "");
}
