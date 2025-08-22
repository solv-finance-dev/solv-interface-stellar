import React from 'react';
import { WalletType } from '@/wallet-connector';
import { useWalletStore } from '@/states';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/Dialog';
import cn from 'classnames'

interface WalletModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
    const {
        availableWallets,
        isConnecting,
        connectWallet,
        clearError
    } = useWalletStore();

    const handleWalletSelect = async (walletType: WalletType) => {
        try {
            clearError();
            await connectWallet(walletType);
            onOpenChange(false);
        } catch (error) {
            // Error will be handled by the store
            console.error('Failed to connect wallet:', error);
        }
    };

    const handleInstallWallet = (wallet: { url: string }) => {
        window.open(wallet.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <span>Connect Wallet</span>
                    </DialogTitle>
                    <DialogDescription>
                        Choose a wallet to connect to the Stellar network
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {availableWallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg border transition-colors",
                                    wallet.isInstalled
                                        ? "border-border hover:border-primary/50 cursor-pointer hover:bg-muted/30"
                                        : "border-border bg-muted/20 opacity-75"
                                )}
                                onClick={wallet.isInstalled ? () => handleWalletSelect(wallet.id) : undefined}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center">
                                        {/* Wallet icon - you can replace with actual icons */}
                                        <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-primary">
                                                {wallet.name.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{wallet.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {wallet.isInstalled ? 'Available' : 'Not installed'}
                                        </p>
                                    </div>
                                </div>

                                {wallet.isInstalled ? (
                                    <button
                                        disabled={isConnecting}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleWalletSelect(wallet.id);
                                        }}
                                    >
                                        Connect
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleInstallWallet(wallet);
                                        }}
                                    >
                                        Install
                                    </button>
                                )}
                            </div>
                        ))}

                        {availableWallets.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No wallets available</p>
                                <p className="text-xs">Please install a Stellar wallet extension</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}