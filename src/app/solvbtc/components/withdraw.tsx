'use client';

import React from 'react';
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
  toast,
} from '@solvprotocol/ui-v2';
import { ArrowRight } from 'lucide-react';
import { InputComplex } from '@/components/InputComplex';
import { TokenIcon } from '@/components/TokenIcon';

const FormSchema = z.object({
  deposit: z.string().min(2, {
    message: 'deposit must be xxx.',
  }),
  receive: z.string().min(2, {
    message: 'receive must be xxx.',
  }),
});

export default function Withdraw() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      deposit: '',
      receive: '',
    },
  });

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
                  <span>You Will Withdraw</span>
                  <div className='flex items-end text-[.875rem]'>
                    {/*  Sample code error : !text-errorColor */}
                    <span className='mr-2 !text-errorColor text-grayColor'>
                      Balance:
                    </span>
                    <div className='text-textColor'> 128.34 SolvBTC</div>
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
                          <div className='flex h-[1.5rem] w-[2.875rem] cursor-pointer items-center justify-center rounded-[4px] bg-brand-50 px-2 text-[.75rem] text-brand-500'>
                            MAX
                          </div>

                          <div className='ml-2 flex items-center justify-between text-[1rem]'>
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
                        <div className='flex items-center justify-between text-[1rem]'>
                          <TokenIcon
                            src='https://res1.sft-api.com/token/WBTC.png'
                            alt='token'
                            fallback='WBTC'
                          />

                          {`WBTC`}
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
            className='w-full rounded-full bg-brand-500 text-white hover:bg-brand-600 md:w-[25.625rem]'
          >
            Withdraw
          </Button>
        </div>
      </form>
    </Form>
  );
}
