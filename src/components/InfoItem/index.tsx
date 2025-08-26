import React, { ReactNode } from "react";

export default function c({
  label,
  value,
  url,
}: {
  label?: string | ReactNode;
  value?: string | ReactNode;
  url?: string;
}) {
  return (
    <div className="text-sm flex flex-col">
      <span className="text-textColor mb-1">{label}</span>

      <span>
        <a
          href={url}
          className="underline hover:text-primary"
          target="_blank"
          rel="noreferrer"
        >
          {/* {`0x9537...d185`} */}
          {value}
        </a>
      </span>
    </div>
  );
}
