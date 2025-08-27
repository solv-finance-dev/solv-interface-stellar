"use client";

import { Card } from "@solvprotocol/ui-v2";
import cn from "classnames";
import { ReactNode } from "react";

interface BannerProps {
  title?: string;
  subTitle?: string;
  description?: string;
  slot?: string | ReactNode;
  showBg?: boolean;
  className?: string;
}

const Banner = ({
  title = "",
  subTitle = "",
  description = "",
  slot = "",
  showBg = false,
  className = "",
}: BannerProps) => {
  return (
    <Card
      className={cn(
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
            <span className="md:ml-4 text-[2.5rem] leading-[3rem] text-grayColor">
              {subTitle}
            </span>
          )}
        </div>
        {description && (
          <div
            className={cn(
              slot
                ? "text-[1.125rem] leading-[1.5rem]"
                : "text-[1.25rem] leading-[1.75rem]"
            )}
          >
            {description}
          </div>
        )}

        {slot && (
          <div className="text-[1.25rem] leading-[1.4375rem] mt-4 font-MatterSQ-Medium">
            {slot}
          </div>
        )}
      </div>
    </Card>
  );
};
export default Banner;
