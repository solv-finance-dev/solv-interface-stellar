'use client';

import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Button, Form, FormLabel, Skeleton } from '@solvprotocol/ui-v2';
import type { UseFormReturn } from 'react-hook-form';
import ExchangeRate from '@/components/ExchangeRate';
import { TokenIcon } from '@/components/TokenIcon';
import { TooltipComplex } from '@/components/TooltipComplex';
import LinkedAmountInputs from '@/components/LinkedAmountInputs';

export type LinkedFormData = { deposit: string; receive: string };

export type WithdrawFormUIProps = {
    form: UseFormReturn<LinkedFormData>;
    isConnected: boolean;
    isSubmitting: boolean;

    balanceDisplay: string;
    isLoadingBalance: boolean;
    onRefreshBalance: () => void;
    onSetMax: () => void;

    leftDecimals: number;
    rightDecimals: number;

    shareTokenName: string; // e.g. SolvBTC
    exchangeRateDisplay: string | null;

    isWithdrawError: boolean;

    onChangeDeposit: (value: string) => void; // withdraw amount changed
    onChangeReceive: (value: string) => void;

    submitDisabled: boolean;
    submitLabel: string;
    onSubmit: (data: LinkedFormData) => void;
};

export default function WithdrawFormUI(props: WithdrawFormUIProps) {
    const {
        form,
        isConnected,
        isSubmitting,
        balanceDisplay,
        isLoadingBalance,
        onRefreshBalance,
        onSetMax,
        leftDecimals,
        rightDecimals,
        shareTokenName,
        exchangeRateDisplay,
        isWithdrawError,
        onChangeDeposit,
        onChangeReceive,
        submitDisabled,
        submitLabel,
        onSubmit,
    } = props;

    const ExchangeRateValue = React.useCallback(() => {
        if (!exchangeRateDisplay) return null;
        return <ExchangeRate title='Exchange Rate' value={exchangeRateDisplay} />;
    }, [exchangeRateDisplay]);

    return (
        <Form {...form}>
            <div className='pointer-events-none absolute right-8 top-[2.3rem] hidden w-full justify-end md:flex'>
                <ExchangeRateValue />
            </div>
            <form
                onSubmit={form.handleSubmit(onSubmit as any)}
                className='flex w-full flex-col space-y-4 md:space-y-6'
            >
                <LinkedAmountInputs
                    form={form as any}
                    left={{
                        name: 'deposit',
                        decimals: leftDecimals,
                        error: isWithdrawError,
                        label: (
                            <FormLabel className='flex items-end justify-between text-[.75rem] leading-[1rem]'>
                                <span className='text-textColor'>You Will Withdraw</span>
                                <div className='flex items-center gap-2 text-[.875rem]'>
                                    <span className='text-textColor-tertiary'>Balance:</span>
                                    <div className='text-textColor'>
                                        {isLoadingBalance ? (
                                            <Skeleton className='h-4 w-10' />
                                        ) : (
                                            <span>{balanceDisplay}</span>
                                        )}
                                    </div>
                                    <button
                                        type='button'
                                        onClick={onRefreshBalance}
                                        disabled={isLoadingBalance || !isConnected}
                                        className='rounded p-1 hover:bg-gray-100 disabled:opacity-50'
                                        title='Refresh balance'
                                    >
                                        <RotateCcw
                                            className={`h-3 w-3 text-textColor-tertiary ${isLoadingBalance ? 'animate-spin' : ''}`}
                                        />
                                    </button>
                                </div>
                            </FormLabel>
                        ),
                        suffix: (
                            <div className='flex h-full items-center justify-end'>
                                <button
                                    type='button'
                                    onClick={onSetMax}
                                    disabled={!isConnected || parseFloat(balanceDisplay || '0') <= 0}
                                    className='flex h-[1.5rem] w-[2.875rem] cursor-pointer items-center justify-center rounded-[4px] bg-brand-50 px-2 text-[.75rem] text-brand-500 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50'
                                >
                                    MAX
                                </button>
                                <div className='ml-2 flex items-center justify-between text-[1rem]'>
                                    <TokenIcon
                                        src='https://res1.sft-api.com/token/SolvBTC.png'
                                        alt={shareTokenName}
                                        fallback={shareTokenName}
                                    />
                                    {shareTokenName}
                                </div>
                            </div>
                        ),
                        onAfterChange: onChangeDeposit,
                    }}
                    right={{
                        name: 'receive',
                        decimals: rightDecimals,
                        error: isWithdrawError,
                        label: (
                            <FormLabel className='flex items-center justify-between text-[.75rem] leading-[1rem]'>
                                <div className='flex items-center !gap-1'>
                                    <span className='text-textColor'>You Will Receive</span>
                                    <TooltipComplex content={'tips'} />
                                </div>
                            </FormLabel>
                        ),
                        suffix: (
                            <div className='flex h-full items-center justify-end'>
                                <div className='flex items-center justify-between text-[1rem]'>
                                    <TokenIcon
                                        src='https://res1.sft-api.com/token/SolvBTC.png'
                                        alt='SolvBTC'
                                        fallback='SolvBTC'
                                    />
                                    {`SolvBTC`}
                                </div>
                            </div>
                        ),
                        onAfterChange: onChangeReceive,
                    }}
                    midNode={
                        <ArrowRight className='h-4 w-4 rotate-90 md:h-6 md:w-6 md:rotate-0' />
                    }
                />

                <div className='flex h-[1.25rem] w-full justify-end md:hidden'>
                    <ExchangeRateValue />
                </div>

                <div className='flex items-end justify-center'>
                    <Button
                        type='submit'
                        disabled={submitDisabled}
                        className='w-full rounded-full bg-brand-500 text-white hover:bg-brand-500/90 disabled:cursor-not-allowed disabled:bg-gray-300 md:w-[25.625rem]'
                    >
                        {isSubmitting ? 'Processing...' : submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}


