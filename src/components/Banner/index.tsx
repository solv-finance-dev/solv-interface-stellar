"use client";

import { Card } from "@solvprotocol/ui-v2";
import classNames from "classnames";

interface BannerProps {
  title?: string;
  subTitle?: string;
  description?: string; // 这里补上缺失的字段名
  showBg?: boolean;
  className?: string;
}

const Banner = ({
  title = "",
  subTitle = "",
  description = "",
  showBg = false,
  className = "",
}: BannerProps) => {
  return (
    <Card
      className={classNames(
        "box-border md:!p-8 !p-4 md:mb-8 mb-4 rounded-3xl ",
        showBg
          ? "bg-contain bg-no-repeat lg:bg-[url('../../assets/images/solvbtc-banner-bg.svg')] bg-[url('../../assets/images/solvbtc-banner-bg-h5.svg')] bg-right-top"
          : "",
        className
      )}
    >
      <div className="">
        <div className="text-[4rem] leading-[4rem] mb-4 flex flex-col md:flex-row md:items-end">
          {title}
          {subTitle && (
            <span className="md:ml-4 text-[2.5rem] leading-[3rem] text-[#A5A5A5]">
              {subTitle}
            </span>
          )}
        </div>
        <div className="text-[1.25rem] leading-[1.75rem]">{description}</div>
      </div>
    </Card>
  );
};
export default Banner;
