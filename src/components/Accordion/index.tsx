import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@solvprotocol/ui-v2';

export interface SolvInfo {
  title: string;
  content: string;
}

interface DynamicAccordionProps {
  data: SolvInfo[];
  defaultValue?: string[];
}

const DynamicAccordion: React.FC<DynamicAccordionProps> = ({
  data,
  defaultValue,
}) => {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    setValue(defaultValue || []);
  }, [defaultValue]);

  return (
    <Accordion
      type='multiple'
      className='w-full overflow-hidden'
      value={value}
      onValueChange={setValue}
    >
      {data.map(item => (
        <AccordionItem key={item.title} value={item.title} className=''>
          <AccordionTrigger className='text-xl'>{item.title}</AccordionTrigger>

          <AccordionContent>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ ...attrs }) => <a {...attrs} target='_blank'></a>,
                ul: ({ ...attrs }) => <ul {...attrs} className='ml-4'></ul>,
                li: ({ ...attrs }) => (
                  <li {...attrs} className='list-disc'></li>
                ),
              }}
            >
              {item.content}
            </ReactMarkdown>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default DynamicAccordion;
