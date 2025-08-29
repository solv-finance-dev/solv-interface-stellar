import classNames from 'classnames';
import Image from 'next/image';

import noData from '@/assets/images/no-data.svg';

const NoData = ({
  className,
  text = 'No results found',
}: {
  className?: string;
  text?: string;
}) => {
  return (
    <div className={classNames('flex flex-col items-center', className)}>
      <Image src={noData} width={100} height={100} alt='no data' />
      <span className='mt-2 text-grayColor/50'>{text}</span>
    </div>
  );
};

export default NoData;
