import cn from "classnames";
import { Copy, User, LogOut, Briefcase, ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { useWalletStore } from "@/states";
import { WalletModal } from "@/components/WalletModal";
import { copyToClipboard, otherAddressFormat } from "@/lib/utils";
import classNames from "classnames";
import { Avatar, AvatarFallback, AvatarImage } from "@solvprotocol/ui-v2";

interface WalletConnectorProps {
  className?: string;
  showChainIcon?: boolean;
}

export function WalletConnector({
  className,
  showChainIcon = true,
}: WalletConnectorProps) {
  const { isConnected, isConnecting, isLoadingAccount, connectedWallet, disconnectWallet } =
    useWalletStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 断开钱包连接
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  // 如果没有连接钱包，显示连接按钮
  if (!isConnected || !connectedWallet || isLoadingAccount || isConnecting) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isConnecting || isLoadingAccount}
          className={cn(
            "px-4 py-2 bg-gray-400/10 text-textColor hover:opacity-90 transition-all font-medium text-sm rounded-full border-border border border-solid",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
        >
          {isConnecting || isLoadingAccount ? "Connecting..." : "Connect Wallet"}
        </button>

        <WalletModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </>
    );
  }

  // 已连接钱包，显示钱包信息下拉菜单
  return (
    <div className={cn("relative", className)}>
      {/* chainIcon */}
      {showChainIcon && (
        <div
          className={classNames(
            "h-8 w-8 md:h-[44px] md:w-[44px]",
            "rounded-full border-[1px] border-solid flex items-center justify-center"
          )}
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="chainIcon" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )}
      {/* 钱包信息按钮 */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-grayColor/15 hover:bg-mainColor hover:text-white rounded-lg transition-colors border border-border/50"
      >
        {/* 头像 */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>

        {/* 地址 */}
        <span className="text-sm font-medium">
          {otherAddressFormat(connectedWallet.publicKey)}
        </span>

        {/* 下拉箭头 */}
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            isDropdownOpen && "rotate-180"
          )}
        />
      </button>

      {/* 下拉菜单 */}
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-black border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {/* 钱包信息头部 */}
          <div className="p-4 border-b border-border dark:border-white">
            <div className="flex items-center space-x-3">
              {/* 大头像 */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium">
                  {otherAddressFormat(connectedWallet.publicKey)}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs font-mono truncate">
                    {otherAddressFormat(connectedWallet.publicKey)}
                  </p>
                  <button
                    onClick={() => copyToClipboard(connectedWallet.publicKey)}
                    className={cn(
                      "p-1 rounded hover:bg-mainColor hover:text-white transition-colors",
                    )}
                    title="Copy address"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* 网络标识 */}
            <div className="mt-3 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full"></div>
              <span className="text-xs">Stellar</span>
            </div>

            <div className="py-2">
              <button
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-mainColor hover:text-white transition-colors text-left"
              >
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">My Portfolio</span>
              </button>

              {/* Disconnect */}
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-mainColor hover:text-white transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 点击外部关闭下拉菜单 */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
