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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
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

export default function Deposit() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      deposit: "",
      receive: "",
    },
  });

  const [selected, setSelected] = useState("cbBTC");
  const options = [
    { label: "cbBTC", value: "cbBTC" },
    { label: "FBTC", value: "FBTC" },
  ];

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
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormItem className="w-[45.4%] gap-[10px]">
                <FormLabel className="text-[.75rem] leading-[1rem] ">
                  Deposit
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
                      inputValue={field.value}
                      onInputChange={field.onChange}
                      inputProps={{
                        placeholder: "0.00",
                        className:
                          "h-[2.75rem] outline-none !border-none !ring-transparent",
                      }}
                      iSuffix={
                        <div className="flex items-center h-full w-[10rem]">
                          <div className="w-[2.875rem] h-[1.5rem] rounded-[4px] cursor-pointer text-brand-500 bg-brand-50 text-[.75rem] px-2 flex items-center justify-center ">
                            MAX
                          </div>

                          <Select value={selected} onValueChange={setSelected}>
                            <SelectTrigger className="w-[96px] outline-none focus-visible:ring-0 border-0 !pr-0 !pl-2">
                              <div className="flex items-center justify-between text-[1rem]">
                                <Avatar className="w-6 h-6 mr-[2px]">
                                  <AvatarImage
                                    src="https://res1.sft-api.com/token/cbBTC.png"
                                    alt="token"
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                {selected}
                              </div>
                            </SelectTrigger>

                            <SelectContent>
                              <SelectGroup>
                                {/* <SelectLabel>Token List</SelectLabel> */}

                                {options.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    <div className="flex items-center justify-between text-[1rem]">
                                      <Avatar className="w-6 h-6 mr-[2px]">
                                        <AvatarImage
                                          src="https://res1.sft-api.com/token/SolvBTC.png"
                                          alt="token"
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                      </Avatar>
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

          <div className="pt-[2.125rem] px-[2.5rem] box-border">
            <ArrowRight />
          </div>

          <FormField
            control={form.control}
            name="receive"
            render={({ field }) => (
              <FormItem className="w-[45.4%] gap-[10px]">
                <FormLabel className="text-[.75rem] leading-[1rem] ">
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
                      <div className="flex items-center h-full">
                        {" "}
                        <div className="flex items-center justify-between text-[1rem]">
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

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center items-end">
          <Button
            type="submit"
            className="md:w-[25.625rem] w-full rounded-full bg-brand-500 hover:bg-brand-500/90"
          >
            Select token
          </Button>
        </div>
      </form>
    </Form>
  );
}
