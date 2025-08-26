"use client";

import * as React from "react";
import cn from "classnames";
import { Input } from "@solvprotocol/ui-v2";
import { ChangeEvent, ReactNode, useCallback, useState } from "react";

export interface InputComplexProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /* input */
  inputValue?: string;
  onInputChange?: (val: string) => void;
  onBlur?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onFocus?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  inputProps?: Omit<
    React.ComponentProps<"input">,
    "value" | "onChange" | "disabled"
  >;
  error?: boolean;

  iPrefix?: ReactNode;
  iSuffix?: ReactNode;

  /* disabled */
  disabled?: boolean;
}

export const InputComplex = React.forwardRef<HTMLDivElement, InputComplexProps>(
  (props, ref) => {
    const {
      inputValue,
      onInputChange,
      onBlur,
      onFocus,
      inputProps,
      iPrefix,
      iSuffix,
      disabled = false,
      className,
      error = false,
      ...rest
    } = props;

    const [isFocus, setIsFocus] = useState(false);

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocus(true);
        onFocus?.(event);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocus(false);
        onBlur?.(event);
      },
      [onBlur]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-stretch border border-input bg-transparent rounded-lg overflow-hidden",
          "transition-colors duration-150 pr-3",
          "hover:border-brand-500",
          "active:border-brand-500",
          isFocus && "border-brand-500",
          disabled && "cursor-not-allowed opacity-50",
          error && "!border-errorColor",
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
          onFocus={(event) => {
            handleFocus(event);
          }}
          onBlur={(event) => {
            handleBlur(event);
          }}
        />
        {iSuffix && <div className="flex-y-center h-full ">{iSuffix}</div>}
      </div>
    );
  }
);
InputComplex.displayName = "InputComplex";
