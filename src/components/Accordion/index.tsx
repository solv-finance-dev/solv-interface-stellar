import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { SolvInfo } from "@/types/API";
import * as Accordion from "@radix-ui/react-accordion";

interface DynamicAccordionProps {
  data: SolvInfo[];
  defaultValue?: string[];
}

const DynamicAccordion: React.FC<DynamicAccordionProps> = ({
  data,
  defaultValue
}) => {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    setValue(defaultValue || []);
  }, [defaultValue]);

  return (
    <Accordion.Root
      type="multiple"
      className="w-full overflow-hidden"
      value={value}
      onValueChange={setValue}
    >
      {data.map((item) => (
        <Accordion.Item key={item.title} value={item.title} className="">
          <Accordion.Header>
            <Accordion.Trigger
              className="w-full px-4 py-3 text-left text-base font-medium text-[14px] 
                flex justify-between items-center
                data-[state=open]:after:content-['−'] data-[state=closed]:after:content-['+']"
            >
              {item.title}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            className="px-4 overflow-hidden text-[12px]
              data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ ...attrs }) => <a {...attrs} target="_blank"></a>,
                ul: ({ ...attrs }) => <ul {...attrs} className="ml-4"></ul>,
                li: ({ ...attrs }) => <li {...attrs} className="list-disc"></li>
              }}
            >
              {item.content}
            </ReactMarkdown>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default DynamicAccordion;
