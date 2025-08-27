import cn from "classnames";
import { ReactNode } from "react";

import useCopyClipboard from "@/hooks/useCopyClipboard";
import { useTheme } from "next-themes";

export interface CopyHelperProps {
  data: string;
  children?: ReactNode | string;
  size?: string;
  fill?: string;
  between?: boolean;
  showIcon?: boolean;
  className?: string;
  classes?: {
    childClass?: string;
  };
}

export function CopyHelper({
  data,
  children,
  between,
  size = "18",
  fill = "",
  showIcon = true,
  className,
  classes,
}: CopyHelperProps) {
  const [isCopied, staticCopy] = useCopyClipboard();
  const { childClass } = classes || {};

  const { theme } = useTheme();

  const fillColor = !fill ? (theme === "light" ? "#575757" : "#D6D6D6") : fill;

  return (
    <div
      className={cn("flex items-center", className, {
        "justify-between": between,
      })}
      onClick={(e) => {
        e.stopPropagation();
        if (children) {
          staticCopy(data);
        }
      }}
    >
      {children && <div className={cn("flex", childClass)}>{children}</div>}
      {showIcon && (
        <div
          className="ml-[0.4rem] cursor-pointer"
          onClick={() => {
            if (!children) {
              staticCopy(data);
            }
          }}
        >
          {isCopied ? (
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width={size}
              height={size}
              fill={fillColor}
            >
              <path d="M822.464 265.344a28.256 28.256 0 0 0-43.072 1.312l-352.96 417.664-181.92-212.992a28.288 28.288 0 0 0-43.104-1.088 37.12 37.12 0 0 0-0.96 48.256l204.096 238.944c5.76 6.752 13.696 10.56 22.016 10.56h0.096a29.088 29.088 0 0 0 22.048-10.656L823.68 313.6c11.52-13.728 11.008-35.328-1.216-48.256"></path>
            </svg>
          ) : (
            <svg
              width={size}
              height={size}
              fill={fillColor}
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_761_4976)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.97199 2.02777C9.8809 1.93668 9.75736 1.88551 9.62854 1.88551H5.12854C4.99972 1.88551 4.87617 1.93668 4.78508 2.02777C4.69399 2.11886 4.64282 2.2424 4.64282 2.37122V2.87122C4.64282 3.15525 4.41257 3.38551 4.12854 3.38551C3.8445 3.38551 3.61425 3.15525 3.61425 2.87122V2.37122C3.61425 1.96961 3.77379 1.58444 4.05777 1.30046C4.34176 1.01647 4.72692 0.856934 5.12854 0.856934H9.62854C10.0302 0.856934 10.4153 1.01647 10.6993 1.30046C10.9833 1.58444 11.1428 1.96961 11.1428 2.37122V6.87122C11.1428 7.27283 10.9833 7.658 10.6993 7.94198C10.4153 8.22597 10.0302 8.38551 9.62854 8.38551H9.12854C8.8445 8.38551 8.61425 8.15525 8.61425 7.87122C8.61425 7.58719 8.8445 7.35693 9.12854 7.35693H9.62854C9.75736 7.35693 9.8809 7.30576 9.97199 7.21467C10.0631 7.12358 10.1143 7.00004 10.1143 6.87122V2.37122C10.1143 2.2424 10.0631 2.11886 9.97199 2.02777ZM7.47146 5.0138C7.47146 4.74554 7.254 4.52808 6.98575 4.52808H2.48575C2.2175 4.52808 2.00003 4.74554 2.00003 5.0138V9.5138C2.00003 9.78205 2.2175 9.99951 2.48575 9.99951H6.98575C7.254 9.99951 7.47146 9.78205 7.47146 9.5138V5.0138ZM6.98575 3.49951C7.82207 3.49951 8.50003 4.17748 8.50003 5.0138V9.5138C8.50003 10.3501 7.82207 11.0281 6.98575 11.0281H2.48575C1.64943 11.0281 0.971461 10.3501 0.971461 9.5138V5.0138C0.971461 4.17748 1.64943 3.49951 2.48575 3.49951H6.98575Z"
                  fill={fillColor}
                />
              </g>
              <defs>
                <clipPath id="clip0_761_4976">
                  <rect width="12" height="12" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
        </div>
      )}
      {!showIcon && isCopied && (
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          fill={fillColor}
        >
          <path d="M822.464 265.344a28.256 28.256 0 0 0-43.072 1.312l-352.96 417.664-181.92-212.992a28.288 28.288 0 0 0-43.104-1.088 37.12 37.12 0 0 0-0.96 48.256l204.096 238.944c5.76 6.752 13.696 10.56 22.016 10.56h0.096a29.088 29.088 0 0 0 22.048-10.656L823.68 313.6c11.52-13.728 11.008-35.328-1.216-48.256"></path>
        </svg>
      )}
    </div>
  );
}
