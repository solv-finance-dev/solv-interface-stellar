'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@solvprotocol/ui-v2';
import { ClaimIcon } from '@/assets/svg/svg';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { RedemptionState } from './RedemptionTable';
dayjs.extend(duration);

interface ClaimActionProps {
  availableTime?: string;
  redemptionState?: string;
  onClaim: () => void;
}

function formatCountdown(remainingMs: number): string {
  if (remainingMs <= 0) return '';
  const d = dayjs.duration(remainingMs);
  const days = Math.floor(d.asDays());
  const hours = d.hours();
  const minutes = d.minutes();
  const seconds = d.seconds();
  const dd = days > 0 ? `${days}d ` : '';
  return `${dd}${hours}h ${minutes}m ${seconds}s`;
}

export default function ClaimAction({
  availableTime,
  redemptionState,
  onClaim,
}: ClaimActionProps) {
  const target = useMemo(
    () => (availableTime ? dayjs(availableTime) : null),
    [availableTime]
  );
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (!target) {
      setRemaining(0);
      return;
    }
    const update = () => {
      const diff = target.diff(dayjs());
      setRemaining(Math.max(0, diff));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const disabled = remaining > 0 || redemptionState !== RedemptionState.Signed;
  const countdownText = formatCountdown(remaining);

  return (
    <div className='flex flex-col items-end'>
      <Button
        variant='default'
        size='sm'
        className='w-full rounded-full bg-brand hover:bg-brand-600 disabled:opacity-60 md:w-[6.4375rem]'
        onClick={onClaim}
        disabled={disabled}
      >
        <ClaimIcon className='h-4 w-4' /> Claim
      </Button>
      {disabled && countdownText && (
        <div className='text-xs text-brand-500'>{countdownText}</div>
      )}
    </div>
  );
}
