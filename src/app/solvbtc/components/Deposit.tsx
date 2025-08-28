'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  toast,
} from '@solvprotocol/ui-v2';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { InputComplex } from '@/components/InputComplex';
import { TooltipComplex } from '@/components/TooltipComplex';
import { TokenIcon } from '@/components/TokenIcon';
import { useSolvBTCVaultClient, useWalletStore } from '@/states';
import {
  getSolvBTCTokenBalance,
  formatTokenBalance,
  type TokenBalanceResult,
} from '@/lib/token-balance';

const FormSchema = z.object({
  deposit: z.string().min(2, {
    message: 'deposit must be xxx.',
  }),
  receive: z.string().min(2, {
    message: 'receive must be xxx.',
  }),
});

export default function Deposit() {
  const solvBTCClient = useSolvBTCVaultClient();
  const { isConnected, connectedWallet } = useWalletStore();

  // Token balance state
  const [tokenBalance, setTokenBalance] = useState<TokenBalanceResult>({
    balance: '0',
    decimals: 0,
  });
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // SolvBTCVaultClient status check removed for production

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      deposit: '',
      receive: '',
    },
  });

  const [selected, setSelected] = useState('SolvBTC');
  const options = [{ label: 'SolvBTC', value: 'SolvBTC' }];

  // Function to fetch token balance
  const fetchTokenBalance = async () => {
    if (!connectedWallet?.publicKey) {
      setTokenBalance({
        balance: '0',
        decimals: 0,
        error: 'Wallet not connected',
      });
      return;
    }

    setIsLoadingBalance(true);
    try {
      const result = await getSolvBTCTokenBalance(connectedWallet.publicKey);
      setTokenBalance(result);
    } catch (error) {
      setTokenBalance({
        balance: '0',
        decimals: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Fetch balance when wallet connection status changes
  useEffect(() => {
    if (isConnected && connectedWallet?.publicKey) {
      fetchTokenBalance();
    } else {
      setTokenBalance({ balance: '0', decimals: 0 });
    }
  }, [isConnected, connectedWallet?.publicKey]);

  // Set maximum amount
  const handleSetMax = () => {
    if (tokenBalance.balance && parseFloat(tokenBalance.balance) > 0) {
      form.setValue('deposit', tokenBalance.balance);
    }
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
      <div>
        <div className='mb-2 font-bold'>
          You submitted the following values:
        </div>
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col space-y-6'
      >
        <div className='flex flex-col justify-between md:flex-row'>
          <FormField
            control={form.control}
            name='deposit'
            render={({ field }) => (
              <FormItem className='w-full gap-[10px] md:w-[45.4%]'>
                <FormLabel className='flex items-end justify-between text-[.75rem] leading-[1rem]'>
                  <span>Deposit</span>
                  <div className='flex items-center gap-2 text-[.875rem]'>
                    <span className='text-grayColor'>Balance:</span>
                    <div className='text-textColor'>
                      {isLoadingBalance ? (
                        <span className='animate-pulse'>Loading...</span>
                      ) : (
                        <span
                          className={tokenBalance.error ? 'text-red-500' : ''}
                        >
                          {formatTokenBalance(
                            tokenBalance.balance,
                            tokenBalance.decimals
                          )}{' '}
                          SolvBTC
                        </span>
                      )}
                    </div>
                    <button
                      type='button'
                      onClick={fetchTokenBalance}
                      disabled={isLoadingBalance || !isConnected}
                      className='rounded p-1 hover:bg-gray-100 disabled:opacity-50'
                      title='Refresh balance'
                    >
                      <RotateCcw
                        className={`h-3 w-3 ${isLoadingBalance ? 'animate-spin' : ''}`}
                      />
                    </button>
                  </div>
                </FormLabel>

                <div className='flex items-center'>
                  <FormControl>
                    {/* <Input
                      placeholder="0.00"
                      {...field}
                      className="h-[2.75rem] outline-none !border-none !ring-transparent"
                    /> */}

                    <InputComplex
                      className='h-[2.75rem]'
                      error={true} // Sample code error
                      inputValue={field.value}
                      onInputChange={field.onChange}
                      inputProps={{
                        placeholder: '0.00',
                        className:
                          'h-[2.75rem] outline-none !border-none !ring-transparent',
                      }}
                      iSuffix={
                        <div className='flex h-full items-center justify-end'>
                          <button
                            type='button'
                            onClick={handleSetMax}
                            disabled={
                              !isConnected ||
                              parseFloat(tokenBalance.balance) <= 0
                            }
                            className='flex h-[1.5rem] w-[2.875rem] cursor-pointer items-center justify-center rounded-[4px] bg-brand-50 px-2 text-[.75rem] text-brand-500 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50'
                          >
                            MAX
                          </button>

                          <Select value={selected} onValueChange={setSelected}>
                            <SelectTrigger className='border-0 !bg-transparent !pl-2 !pr-0 outline-none focus-visible:ring-0'>
                              <div className='flex items-center justify-between text-[1rem]'>
                                <TokenIcon
                                  src='https://res1.sft-api.com/token/cbBTC.png'
                                  alt='cbBTC'
                                  fallback='cbBTC'
                                />

                                {selected}
                              </div>
                            </SelectTrigger>

                            <SelectContent>
                              <SelectGroup>
                                {/* <SelectLabel>Token List</SelectLabel> */}

                                {options.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    <div className='flex items-center justify-between text-[1rem]'>
                                      <TokenIcon
                                        src='https://res1.sft-api.com/token/SolvBTC.png'
                                        alt='SolvBTC'
                                        fallback='SolvBTC'
                                      />
                                      {opt.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      }
                    />
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className='box-border flex h-[2.75rem] items-center justify-center px-[2.5rem] md:mt-[1.625rem]'>
            <ArrowRight className='h-4 w-4 rotate-90 md:h-6 md:w-6 md:rotate-0' />
          </div>

          <FormField
            control={form.control}
            name='receive'
            render={({ field }) => (
              <FormItem className='w-full gap-[10px] md:w-[45.4%]'>
                <FormLabel className='flex items-center !gap-1 text-[.75rem] leading-[1rem]'>
                  You Will Receive
                  <TooltipComplex content={'tips'}></TooltipComplex>
                </FormLabel>
                <FormControl>
                  {/* <Input
                    placeholder="0.00"
                    {...field}
                    className="h-[2.75rem]"
                  /> */}
                  <InputComplex
                    className='h-[2.75rem]'
                    inputValue={field.value}
                    onInputChange={field.onChange}
                    inputProps={{
                      placeholder: '0.00',
                      className:
                        'h-[2.75rem] outline-none !border-none !ring-transparent',
                    }}
                    iSuffix={
                      <div className='flex h-full items-center justify-end'>
                        {' '}
                        <div className='flex items-center justify-between text-[1rem]'>
                          <TokenIcon
                            src='https://res1.sft-api.com/token/SolvBTC.png'
                            alt='SolvBTC'
                            fallback='SolvBTC'
                          />

                          {`SolvBTC`}
                        </div>
                      </div>
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex items-end justify-center'>
          <Button
            type='submit'
            className='w-full rounded-full bg-brand-500 text-white hover:bg-brand-500/90 md:w-[25.625rem]'
          >
            Select token
          </Button>
        </div>
      </form>
    </Form>
  );
}
