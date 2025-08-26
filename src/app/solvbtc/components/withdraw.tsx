"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  toast,
} from "@solvprotocol/ui-v2";
import { ArrowRight } from "lucide-react";
import { InputComplex } from "@/components/InputComplex";

const FormSchema = z.object({
  deposit: z.string().min(2, {
    message: "deposit must be xxx.",
  }),
  receive: z.string().min(2, {
    message: "receive must be xxx.",
  }),
});

export default function Withdraw() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      deposit: "",
      receive: "",
    },
  });


  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
      <div>
        <div className="font-bold mb-2">
          You submitted the following values:
        </div>
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 flex flex-col"
      >
        <div className="flex justify-between flex-col md:flex-row">
          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormItem className="md:w-[45.4%] gap-[10px] w-full">
                <FormLabel className="text-[.75rem] leading-[1rem] flex items-end justify-between">
                  <span>You Will Withdraw</span>
                  <div className="flex items-end text-[.875rem]">
                    {/*  Sample code error : !text-errorColor */}
                    <span className="text-grayColor mr-2 !text-errorColor">
                      Balance:
                    </span>
                    <div className="text-textColor"> 128.34 SolvBTC</div>
                  </div>
                </FormLabel>

                <div className="flex items-center">
                  <FormControl>
                    {/* <Input
                      placeholder="0.00"
                      {...field}
                      className="h-[2.75rem] outline-none !border-none !ring-transparent"
                    /> */}

                    <InputComplex
                      className="h-[2.75rem]"
                      error={true} // Sample code error
                      inputValue={field.value}
                      onInputChange={field.onChange}
                      inputProps={{
                        placeholder: "0.00",
                        className:
                          "h-[2.75rem] outline-none !border-none !ring-transparent",
                      }}
                      iSuffix={
                        <div className="flex items-center h-full justify-end">
                          <div className="w-[2.875rem] h-[1.5rem] rounded-[4px] cursor-pointer text-brand-500 bg-brand-50 text-[.75rem] px-2 flex items-center justify-center ">
                            MAX
                          </div>

                          <div className="flex items-center justify-between text-[1rem] ml-2">
                            <Avatar className="w-6 h-6 mr-[2px]">
                              <AvatarImage
                                src="https://res1.sft-api.com/token/SolvBTC.png"
                                alt="token"
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
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

          <div className="flex items-center justify-center px-[2.5rem] h-[2.75rem] md:mt-[1.625rem] box-border">
            <ArrowRight className="w-4 h-4 rotate-90 md:w-6 md:h-6 md:rotate-0" />
          </div>

          <FormField
            control={form.control}
            name="receive"
            render={({ field }) => (
              <FormItem className="md:w-[45.4%] gap-[10px] w-full">
                <FormLabel className="text-[.75rem] leading-[1rem] flex items-center !gap-1">
                  You Will Receive
                </FormLabel>
                <FormControl>
                  {/* <Input
                    placeholder="0.00"
                    {...field}
                    className="h-[2.75rem]"
                  /> */}
                  <InputComplex
                    className="h-[2.75rem]"
                    inputValue={field.value}
                    onInputChange={field.onChange}
                    inputProps={{
                      placeholder: "0.00",
                      className:
                        "h-[2.75rem] outline-none !border-none !ring-transparent",
                    }}
                    iSuffix={
                      <div className="flex items-center h-full justify-end">
                        <div className="flex items-center justify-between text-[1rem]">
                          <Avatar className="w-6 h-6 mr-[2px]">
                            <AvatarImage
                              src="https://res1.sft-api.com/token/WBTC.png"
                              alt="token"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
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

        <div className="flex justify-center items-end">
          <Button
            type="submit"
            className="md:w-[25.625rem] w-full rounded-full bg-brand-500 hover:bg-brand-500/90 text-white"
          >
            Withdraw
          </Button>
        </div>
      </form>
    </Form>
  );
}
