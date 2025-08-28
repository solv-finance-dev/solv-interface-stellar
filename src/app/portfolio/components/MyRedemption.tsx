import { CopyHelper } from "@/components/CopyHelper";
import { TokenIcon } from "@/components/TokenIcon";
import { addressFormat } from "@/lib/utils";
import { useWalletStore } from "@/states";
import { Card } from "@solvprotocol/ui-v2";
import React from "react";

export default function MyRedemption() {
  const { isConnected, isConnecting, isLoadingAccount, connectedWallet } =
    useWalletStore();
  return (
    <div className="md:pt-6 pt-0">
      <div className="w-full flex justify-between items-end ">
        <h3 className="md:text-[4rem] leading-[4rem] text-[3rem]">
          My Redemption
        </h3>

        <div className="lg:block hidden">
          {!isConnected ||
          !connectedWallet ||
          isLoadingAccount ||
          isConnecting ? (
            <></>
          ) : (
            <div className="h-[3rem] w-[12.8125rem] border-border rounded-[1.875rem] border-[1px] border-solid flex items-center pl-2 py-1 justify-between pr-3">
              <div className="flex items-center justify-center border-[1px] border-gray-300 border-solid box-border p-2 w-10 h-10  rounded-full ">
                <TokenIcon
                  src="https://avatar.sft-api.com/avatar/28.png"
                  className="w-6 h-6"
                />
              </div>

              <CopyHelper size="18" data={connectedWallet.publicKey}>
                <div className="truncate text-[.875rem] leading-5 text-textColor w-[7.0625rem] text-right">
                  {addressFormat(connectedWallet.publicKey)}
                </div>
              </CopyHelper>
            </div>
          )}
        </div>
      </div>

      <Card className="mt-8 border-none rounded-3xl p-8">
        <div className="p-0"></div>
      </Card>
    </div>
  );
}
