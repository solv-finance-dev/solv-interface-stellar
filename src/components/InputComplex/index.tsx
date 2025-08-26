"use client";

import * as React from "react";
import cn from "classnames";
import { Input } from "@solvprotocol/ui-v2";
import { ReactNode } from "react";

export interface InputSelectButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /* input */
  inputValue?: string;
  onInputChange?: (val: string) => void;
  inputProps?: Omit<
    React.ComponentProps<"input">,
    "value" | "onChange" | "disabled"
  >;

  iPrefix?: ReactNode;
  iSuffix?: ReactNode;

  /* disabled */
  disabled?: boolean;
}

/* ----------------- 组件实现 ----------------- */
export const InputComplex = React.forwardRef<
  HTMLDivElement,
  InputSelectButtonProps
>((props, ref) => {
  const {
    inputValue,
    onInputChange,
    inputProps,
    iPrefix,
    iSuffix,
    disabled = false,
    className,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full items-stretch rounded-md border border-input bg-transparent",
        "transition-colors duration-150  pr-3",
        "hover:border-brand-500",
        "active:border-brand-500",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...rest}
    >
      {iPrefix && <div className="flex-y-center mr-4 h-full">{iPrefix}</div>}
      {/* input */}
      <Input
        value={inputValue}
        onChange={(e) => onInputChange?.(e.target.value)}
        disabled={disabled}
        className="min-w-0 flex-1 rounded-none rounded-l-md border-0 shadow-none focus-visible:ring-0 !bg-transparent !px-0  dark:!bg-transparent"
        {...inputProps}
      />
      {iSuffix && <div className="flex-y-center h-full">{iSuffix}</div>}
    </div>
  );
});
InputComplex.displayName = "InputComplex";
