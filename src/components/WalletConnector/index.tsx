import cn from "classnames";
import { Copy, LogOut, Briefcase, ChevronDown, Check } from "lucide-react";
import React, { useState } from "react";

import { useWalletStore } from "@/states";
import { WalletModal } from "@/components/WalletModal";
import { copyToClipboard, otherAddressFormat } from "@/lib/utils";
import classNames from "classnames";
import { Avatar, AvatarFallback, AvatarImage } from "@solvprotocol/ui-v2";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@solvprotocol/ui-v2";

interface WalletConnectorProps {
  className?: string;
  showChainIcon?: boolean;
}

const UserAvatar = () => {
  return (
    <Avatar className="w-8 h-8 md:w-[44px] md:h-[44px]">
      <AvatarImage src="https://github.com/shadcn.png" alt="chainIcon" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export function WalletConnector({
  className,
  showChainIcon = true,
}: WalletConnectorProps) {
  const { isConnected, isConnecting, isLoadingAccount, connectedWallet, disconnectWallet } =
    useWalletStore();

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
      <>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          size="lg"
          disabled={isConnecting || isLoadingAccount}
          className={cn(
            "px-4 py-2 bg-gray-400/10 text-textColor hover:opacity-90 transition-all font-medium text-sm rounded-full border-border border border-solid",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
        >
          {isConnecting || isLoadingAccount ? "Connecting..." : "Connect Wallet"}
        </Button>
        <WalletModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </>
    );
  }

  // 已连接钱包，显示钱包信息下拉菜单
  return (
    <div className={cn("relative", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-3 px-4 py-2 rounded-full transition-colors border cursor-pointer">
            {/* chainIcon */}
            {showChainIcon && <UserAvatar />}

            {/* 地址 */}
            <span className="text-sm font-medium">
              {otherAddressFormat(connectedWallet.publicKey)}
            </span>

            {/* 下拉箭头 */}
            <ChevronDown className="w-4 h-4 transition-transform" />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 border rounded-xl shadow-xl overflow-hidden"
          align="end"
          sideOffset={8}
        >
          {/* 钱包信息头部 */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              {/* chainIcon */}
              {showChainIcon && <UserAvatar />}

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
              <div
                className="w-full flex cursor-pointer items-center space-x-3 py-3  transition-colors text-left"
              >
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
