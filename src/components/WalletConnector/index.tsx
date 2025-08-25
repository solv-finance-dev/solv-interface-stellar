import cn from "classnames";
import { Copy, LogOut, Briefcase, ChevronDown, Check } from "lucide-react";
import React, { useState } from "react";

import { useWalletStore } from "@/states";
import { WalletModal } from "@/components/WalletModal";
import { copyToClipboard, otherAddressFormat } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@solvprotocol/ui-v2";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@solvprotocol/ui-v2";

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
    <Avatar className={cn("lg:h-6 lg:w-6 h-5 w-5", className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

const ChainIcon = () => {
  return (
    <div
      className={cn(
        "h-8 w-8 lg:h-[2.75rem] lg:w-[2.75rem]",
        "rounded-full border-[1px] border-solid flex items-center justify-center bg-gray-400/10 backdrop-blur-[5px] border-border"
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
  const [isCopied, setIsCopied] = useState(false);

  // 复制钱包地址
  const handleCopyAddress = async () => {
    if (!connectedWallet) return;

    try {
      await copyToClipboard(connectedWallet.publicKey);
      setIsCopied(true);
      // 2秒后重置复制状态
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

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
          className="p-0 border rounded-xl shadow-xl overflow-hidden outline-none"
          align="end"
          sideOffset={8}
        >
          {/* 钱包信息头部 */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <ImageAvatar
                src="https://avatar.sft-api.com/avatar/28.png "
                alt="User Avatar"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">
                  {otherAddressFormat(connectedWallet.publicKey)}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs font-mono truncate">
                    {otherAddressFormat(connectedWallet.publicKey)}
                  </p>
                  <div
                    onClick={handleCopyAddress}
                    className="p-1 rounded cursor-pointer"
                    title={isCopied ? "Copied!" : "Copy address"}
                  >
                    {isCopied ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 网络标识 */}
            <div className="mt-3 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs">Stellar</span>
            </div>

            <div className="py-2 space-y-1">
              <div className="w-full flex cursor-pointer items-center space-x-3 py-3  transition-colors text-left">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">My Portfolio</span>
              </div>

              {/* Disconnect */}
              <div
                onClick={handleDisconnect}
                className="w-full flex cursor-pointer items-center space-x-3 py-3 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Disconnect</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
