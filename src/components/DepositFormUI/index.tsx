'use client';

import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import {
    Button,
    Form,
    FormLabel,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    Skeleton,
} from '@solvprotocol/ui-v2';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import ExchangeRate from '@/components/ExchangeRate';
import { TokenIcon } from '@/components/TokenIcon';
import { TooltipComplex } from '@/components/TooltipComplex';
import LinkedAmountInputs from '@/components/LinkedAmountInputs';

export type LinkedFormData = { deposit: string; receive: string };

export type DepositFormToken = {
    name: string;
    icon?: string;
};

export type DepositFormUIProps = {
    form: UseFormReturn<LinkedFormData>;
    isConnected: boolean;
    isConnecting?: boolean;
    isLoadingAccount?: boolean;
    isSubmitting: boolean;

    balanceDisplay: string;
    isLoadingBalance: boolean;
    onRefreshBalance: () => void;
    onSetMax: () => void;

    selectedToken: DepositFormToken | null;
    supportedTokens: DepositFormToken[];
    isLoadingSupportedTokens?: boolean;
    onTokenSelected: (value: string) => void;

    leftDecimals: number;
    rightDecimals: number;

    shareTokenName: string;
    exchangeRateDisplay: string | null;

    isDepositError: boolean;

    onChangeDeposit: (value: string) => void;
    onChangeReceive: (value: string) => void;

    submitDisabled: boolean;
    submitLabel: string;
    onSubmit: (data: LinkedFormData) => void;
};

export default function DepositFormUI(props: DepositFormUIProps) {
    const {
        form,
        isConnected,
        isConnecting,
        isLoadingAccount,
        isSubmitting,
        balanceDisplay,
        isLoadingBalance,
        onRefreshBalance,
        onSetMax,
        selectedToken,
        supportedTokens,
        isLoadingSupportedTokens,
        onTokenSelected,
        leftDecimals,
        rightDecimals,
        shareTokenName,
        exchangeRateDisplay,
        isDepositError,
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
                        error: isDepositError,
                        label: (
                            <FormLabel className='flex items-end justify-between text-[.75rem] leading-[1rem]'>
                                <span className='text-textColor'>You Will Deposit</span>
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

                                <Select
                                    value={selectedToken?.name}
                                    onValueChange={onTokenSelected}
                                >
                                    <SelectTrigger className='border-0 !bg-transparent !pl-2 !pr-0 outline-none focus-visible:ring-0'>
                                        <div className='flex items-center justify-between text-[1rem]'>
                                            <TokenIcon
                                                src={selectedToken?.icon}
                                                alt={selectedToken?.name}
                                                fallback={selectedToken?.name}
                                            />
                                            {selectedToken?.name}
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {isLoadingSupportedTokens
                                                ? Array.from({ length: 4 }).map((_, i) => (
                                                    <SelectItem key={`loading-${i}`} value={`loading-${i}`} disabled>
                                                        <div className='flex items-center gap-2 text-[1rem]'>
                                                            <Skeleton className='h-6 w-6 rounded-full' />
                                                            <Skeleton className='h-4 w-[7.5rem]' />
                                                        </div>
                                                    </SelectItem>
                                                ))
                                                : supportedTokens.map(opt => (
                                                    <SelectItem key={opt.name} value={opt.name}>
                                                        <div className='flex items-center justify-between text-[1rem]'>
                                                            <TokenIcon src={opt.icon} alt={opt.name} fallback={opt.name} />
                                                            {opt.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        ),
                        onAfterChange: onChangeDeposit,
                    }}
                    right={{
                        name: 'receive',
                        decimals: rightDecimals,
                        error: isDepositError,
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
                                        alt={shareTokenName}
                                        fallback={shareTokenName}
                                    />
                                    {shareTokenName}
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
                        className='w-full rounded-full bg-brand-500 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-gray-300 md:w-[25.625rem]'
                    >
                        {isSubmitting ? 'Processing...' : submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}


