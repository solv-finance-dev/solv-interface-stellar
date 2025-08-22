import React, { useState } from 'react';
import { Copy, User, LogOut, Briefcase, ChevronDown } from 'lucide-react';
import { useWalletStore } from '@/states';
import { WalletModal } from '@/components/WalletModal';
import cn from 'classnames';
import { copyToClipboard, otherAddressFormat } from '@/lib/utils';

interface WalletConnectorProps {
    className?: string;
}

export function WalletConnector({ className }: WalletConnectorProps) {
    const {
        isConnected,
        isConnecting,
        connectedWallet,
        disconnectWallet,
    } = useWalletStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // 断开钱包连接
    const handleDisconnect = async () => {
        try {
            await disconnectWallet();
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    };

    // 如果没有连接钱包，显示连接按钮
    if (!isConnected || !connectedWallet) {
        return (
            <>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isConnecting}
                    className={cn(
                        "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        className
                    )}
                >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>

                <WalletModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                />
            </>
        );
    }

    // 已连接钱包，显示钱包信息下拉菜单
    return (
        <div className={cn("relative", className)}>
            {/* 钱包信息按钮 */}
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-secondary/80 hover:bg-secondary rounded-lg transition-colors border border-border/50"
            >
                {/* 头像 */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                </div>

                {/* 地址 */}
                <span className="text-sm font-medium text-foreground">
                    {otherAddressFormat(connectedWallet.publicKey)}
                </span>

                {/* 下拉箭头 */}
                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        isDropdownOpen && "rotate-180"
                    )}
                />
            </button>

            {/* 下拉菜单 */}
            {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
                    {/* 钱包信息头部 */}
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center space-x-3">
                            {/* 大头像 */}
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-foreground">
                                    {otherAddressFormat(connectedWallet.publicKey)}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <p className="text-xs text-muted-foreground font-mono truncate">
                                        {otherAddressFormat(connectedWallet.publicKey)}
                                    </p>
                                    <button
                                        onClick={() => copyToClipboard(connectedWallet.publicKey)}
                                        className={cn(
                                            "p-1 rounded hover:bg-muted transition-colors",
                                            copySuccess && "text-green-500"
                                        )}
                                        title="Copy address"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </button>
                                </div>
                                {copySuccess && (
                                    <p className="text-xs text-green-500 mt-1">Copied!</p>
                                )}
                            </div>
                        </div>

                        {/* 网络标识 */}
                        <div className="mt-3 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Stellar</span>
                        </div>
                    </div>

                    {/* 菜单选项 */}
                    <div className="py-2">
                        {/* My Portfolio */}
                        <button
                            onClick={() => {
                                setIsDropdownOpen(false);
                                // 这里可以添加导航到 portfolio 页面的逻辑
                                console.log('Navigate to portfolio');
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                        >
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">My Portfolio</span>
                        </button>

                        {/* Disconnect */}
                        <button
                            onClick={handleDisconnect}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                        >
                            <LogOut className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">Disconnect</span>
                        </button>
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
