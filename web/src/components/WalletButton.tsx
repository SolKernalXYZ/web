"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Button from "./Button";
import { WalletIcon } from "./icons";

export default function WalletButton({ className = "" }: { className?: string }) {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    const addr = publicKey.toBase58();
    const short = `${addr.slice(0, 4)}…${addr.slice(-4)}`;
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => disconnect()}
        className={`font-mono ${className}`}
        title="Disconnect wallet"
        leadingIcon={
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-success" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
        }
      >
        {short}
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => setVisible(true)}
      className={className}
      leadingIcon={<WalletIcon size={15} />}
    >
      Connect Wallet
    </Button>
  );
}
