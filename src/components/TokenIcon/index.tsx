// src/components/ui/TokenIcon.tsx

import { Avatar, AvatarFallback, AvatarImage } from '@solvprotocol/ui-v2';

import cn from 'classnames';

interface TokenIconProps {
  src?: string;
  alt?: string;
  className?: string;
  fallback?: string;
}

export const TokenIcon = ({
  src = 'https://res1.sft-api.com/token/SolvBTC.png',
  alt = 'token',
  className,
  fallback = 'CN',
}: TokenIconProps) => {
  return (
    <Avatar className={cn('mr-[2px] h-6 w-6', className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};
