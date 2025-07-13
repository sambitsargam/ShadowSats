'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

export function useWallet() {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()

  return {
    address,
    isConnected,
    network: chain?.name || null,
    connect: openConnectModal || (() => {}),
    disconnect,
    provider: null, // Will be handled by wagmi hooks where needed
  }
}