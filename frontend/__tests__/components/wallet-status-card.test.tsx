import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WalletStatusCard } from '@/components/dashboard/wallet-status-card';
import { useWallet } from '@/lib/hooks/use-wallet';

// Mock the useWallet hook
jest.mock('@/lib/hooks/use-wallet');

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

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
    mockUseWallet.mockReturnValue({
      isConnected: false,
      address: null,
      network: null,
      connect: jest.fn(),
      disconnect: jest.fn(),
      provider: null,
    });

    render(<WalletStatusCard />);

    expect(screen.getByText('No Wallet Connected')).toBeInTheDocument();
    expect(screen.getByText('Connect your wallet to start trading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect Wallet' })).toBeInTheDocument();
  });

  it('renders connected wallet state', () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    mockUseWallet.mockReturnValue({
      isConnected: true,
      address: mockAddress,
      network: 'Citrea Testnet',
      connect: jest.fn(),
      disconnect: jest.fn(),
      provider: {} as any,
    });

    render(<WalletStatusCard />);

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Citrea Testnet')).toBeInTheDocument();
    expect(screen.getByText('MetaMask')).toBeInTheDocument();
  });

  it('calls connect function when connect button is clicked', () => {
    const mockConnect = jest.fn();
    mockUseWallet.mockReturnValue({
      isConnected: false,
      address: null,
      network: null,
      connect: mockConnect,
      disconnect: jest.fn(),
      provider: null,
    });

    render(<WalletStatusCard />);

    fireEvent.click(screen.getByRole('button', { name: 'Connect Wallet' }));
    expect(mockConnect).toHaveBeenCalled();
  });
});