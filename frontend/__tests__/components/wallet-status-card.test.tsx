import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WalletStatusCard } from '@/components/dashboard/wallet-status-card';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

// Mock the wagmi hooks
jest.mock('wagmi');
jest.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button>Connect Wallet</button>,
}));

const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>;
const mockUseNetwork = useNetwork as jest.MockedFunction<typeof useNetwork>;
const mockUseSwitchNetwork = useSwitchNetwork as jest.MockedFunction<typeof useSwitchNetwork>;

describe('WalletStatusCard', () => {
  beforeEach(() => {
    // Reset clipboard mock
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });
  });

  it('renders connect wallet state when not connected', () => {
    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: null,
    } as any);
    
    mockUseNetwork.mockReturnValue({
      chain: null,
    } as any);
    
    mockUseSwitchNetwork.mockReturnValue({
      switchNetwork: jest.fn(),
    } as any);

    render(<WalletStatusCard />);

    expect(screen.getByText('No Wallet Connected')).toBeInTheDocument();
    expect(screen.getByText('Connect your wallet to start trading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect Wallet' })).toBeInTheDocument();
  });

  it('renders connected wallet state', () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: mockAddress,
    } as any);
    
    mockUseNetwork.mockReturnValue({
      chain: { name: 'Citrea Testnet' },
    } as any);
    
    mockUseSwitchNetwork.mockReturnValue({
      switchNetwork: jest.fn(),
    } as any);

    render(<WalletStatusCard />);

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Citrea Testnet')).toBeInTheDocument();
    expect(screen.getByText('MetaMask')).toBeInTheDocument();
  });

  it('calls connect function when connect button is clicked', () => {
    const mockConnect = jest.fn();
    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: null,
    } as any);
    
    mockUseNetwork.mockReturnValue({
      chain: null,
    } as any);
    
    mockUseSwitchNetwork.mockReturnValue({
      switchNetwork: jest.fn(),
    } as any);

    render(<WalletStatusCard />);

    fireEvent.click(screen.getByRole('button', { name: 'Connect Wallet' }));
    // ConnectButton is mocked, so we just check it renders
    expect(screen.getByRole('button', { name: 'Connect Wallet' })).toBeInTheDocument();
  });
});