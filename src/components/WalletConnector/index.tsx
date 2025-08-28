import cn from "classnames";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { useWalletStore } from "@/states";
import { WalletModal } from "@/components/WalletModal";
import { copyToClipboard, otherAddressFormat } from "@/lib/utils";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@solvprotocol/ui-v2";
import { TokenIcon } from "../TokenIcon";
import { CopyHelper } from "../CopyHelper";
import { DisconnectIcon, MyPortfolioIcon } from "@/assets/svg/svg";

interface WalletConnectorProps {
  className?: string;
  showChainIcon?: boolean;
}

const ImageAvatar = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  return (
    <TokenIcon
      src={src}
      alt={alt}
      className={cn("lg:h-6 lg:w-6 h-5 w-5", className)}
      fallback=" "
    />
  );
};

const ChainIcon = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "h-8 w-8 lg:h-[2.75rem] lg:w-[2.75rem]",
        "rounded-full border-[1px] border-solid flex items-center justify-center bg-gray-400/10 backdrop-blur-[5px] border-border",
        className
      )}
    >
      <ImageAvatar
        src="https://s2.coinmarketcap.com/static/img/coins/200x200/512.png"
        alt="Stellar"
      />
    </div>
  );
};

export function WalletConnector({
  className,
  showChainIcon = true,
}: WalletConnectorProps) {
  const {
    isConnected,
    isConnecting,
    isLoadingAccount,
    connectedWallet,
    disconnectWallet,
  } = useWalletStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 断开钱包连接
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  // 如果没有连接钱包，显示连接按钮
  if (!isConnected || !connectedWallet || isLoadingAccount || isConnecting) {
    return (
      <div className="relative flex items-center lg:space-x-4 space-x-2">
        {showChainIcon && <ChainIcon />}
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          size="lg"
          disabled={isConnecting || isLoadingAccount}
          className={cn(
            "bg-gray-400/10 text-textColor hover:opacity-90 transition-all font-medium text-sm rounded-full border-border border border-solid lg:h-[2.75rem] h-8 backdrop-blur-[5px] space-x-1 lg:px-4 px-3",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
        >
          {isConnecting || isLoadingAccount
            ? "Connecting..."
            : "Connect Wallet"}
        </Button>
        <WalletModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    );
  }

  // 已连接钱包，显示钱包信息下拉菜单
  return (
    <div
      className={cn(
        "relative flex items-center lg:space-x-4 space-x-2",
        className
      )}
    >
      {showChainIcon && <ChainIcon />}
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-1 lg:px-4 px-1 rounded-full transition-colors border cursor-pointer lg:h-[2.75rem] h-8 backdrop-blur-[5px] border-border bg-gray-400/10">
            <ImageAvatar
              src="https://avatar.sft-api.com/avatar/28.png"
              alt="User Avatar"
            />
            <span className="lg:text-sm font-medium text-[.75rem] text-textColor">
              {otherAddressFormat(connectedWallet.publicKey)}
            </span>
            <ChevronDown className="w-4 h-4 transition-transform text-textColor" />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 border-0 rounded-xl shadow-xl overflow-hidden outline-none"
          align="end"
          sideOffset={8}
        >
          {/* user info */}
          <div className="p-6">
            <div className="flex items-center space-x-3 bg-">
              <ImageAvatar
                src="https://avatar.sft-api.com/avatar/28.png "
                alt="User Avatar"
                className="!w-12 !h-12"
              />
              <div className="flex-1 min-w-0 ">
                <h3 className="font-medium text-xl">{connectedWallet.name}</h3>

                <div className="flex items-center space-x-2 ">
                  <CopyHelper size="14" data={connectedWallet.publicKey}>
                    <p className="truncate text-[.875rem] leading-5 text-textColor">
                      {otherAddressFormat(connectedWallet.publicKey)}
                    </p>
                  </CopyHelper>
                </div>
              </div>
            </div>

            {/* network */}
            <div className="py-4 mt-4">
              <div className="flex items-center space-x-2 py-[.625rem] px-3  bg-gray-300/20 rounded-lg">
                <ChainIcon className="!w-6 !h-6 !p-0 !border-0 !bg-none" />
                <span className="text-[.875rem] leading-4">Stellar</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full flex cursor-pointer items-center space-x-2 py-3 transition-colors text-left border-b-[1px] border-input border-solid text-[.875rem] leader-5">
                <MyPortfolioIcon className="w-4 h-4" />
                <span>My Portfolio</span>
              </div>

              {/* Disconnect */}
              <div
                onClick={handleDisconnect}
                className="w-full flex cursor-pointer items-center space-x-2 py-3 transition-colors text-left text-[.875rem] leader-5"
              >
                <DisconnectIcon className="w-4 h-4" />
                <span>Disconnect</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
