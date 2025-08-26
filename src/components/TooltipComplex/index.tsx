"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@solvprotocol/ui-v2";
import { Info } from "lucide-react";

export interface TooltipComplexProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  showIcon?: boolean;
  delayDuration?: number;
  tooltipProps?: React.ComponentProps<typeof Tooltip>;
}

export function TooltipComplex({
  content,
  children,
  showIcon = true,
  delayDuration = 300,
  tooltipProps,
}: TooltipComplexProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration} {...tooltipProps}>
        <TooltipTrigger asChild>
          <div className="flex justify-start items-center">
            {showIcon && (
              <Info className="text-grayColor w-[.875rem] h-[.875rem]" />
            )}
            {children && <div>{children}</div>}
          </div>
        </TooltipTrigger>
        <TooltipContent sideOffset={4}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
