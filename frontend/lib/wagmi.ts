import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { citreaTestnet } from './chains'

export const config = getDefaultConfig({
  appName: 'ShadowSats',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [citreaTestnet],
  ssr: true,
})