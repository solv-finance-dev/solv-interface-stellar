import { Skeleton } from '@solvprotocol/ui-v2';
import classNames from 'classnames';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function DetailsDescription({
  description,
}: {
  description?: string | null | undefined;
}) {
  const descriptionRef = useRef<HTMLDivElement>(null);

  const [showBtn, setShowBtn] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      setShowBtn(descriptionRef.current.clientHeight > 160);
    }
  }, [descriptionRef]);
  return (
    <div>
      {' '}
      <div
        className={classNames(
          'mt-4 overflow-hidden text-[13px]',
          showMore ? 'h-auto' : 'h-40'
        )}
      >
        <div ref={descriptionRef}>
          {true ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ ...attrs }) => <a {...attrs} target='_blank'></a>,
                ul: ({ ...attrs }) => <ul {...attrs} className='ml-4'></ul>,
                li: ({ ...attrs }) => (
                  <li {...attrs} className='list-disc'></li>
                ),
                h2: ({ ...attrs }) => (
                  <h2
                    {...attrs}
                    className='pb-2 pt-4 text-[14px] font-bold'
                  ></h2>
                ),
              }}
            >
              {description}
            </ReactMarkdown>
          ) : (
            <div className='flex flex-col gap-2'>
              {[1, 2, 3, 4, 5, 6].map(item => {
                return (
                  <Skeleton key={item} className='mt-1 h-4 w-full'></Skeleton>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {showBtn && (
        <div
          className='text-mainColor cursor-pointer pt-4 text-sm font-bold'
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'See less' : 'See more'}
        </div>
      )}
    </div>
  );
}
