import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OrderForm } from '@/components/trade/order-form';
import { useAccount } from 'wagmi'
import { useZkProof } from '@/lib/hooks/use-zk-proof';

// Mock the hooks
jest.mock('wagmi');
jest.mock('@/lib/hooks/use-zk-proof');
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>;
const mockUseZkProof = useZkProof as jest.MockedFunction<typeof useZkProof>;

describe('OrderForm', () => {
  beforeEach(() => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x123',
    } as any);

    mockUseZkProof.mockReturnValue({
      generateProof: jest.fn(() => Promise.resolve({
        proof: '0x123',
        publicInputs: ['0x456'],
        commitment: '0x789',
      })),
      isGenerating: false,
    });
  });

  it('renders order form correctly', () => {
    render(<OrderForm />);

    expect(screen.getByText('Place Order')).toBeInTheDocument();
    expect(screen.getByLabelText('Side')).toBeInTheDocument();
    expect(screen.getByLabelText('Price (USD)')).toBeInTheDocument();
    expect(screen.getByLabelText('Size (BTC)')).toBeInTheDocument();
  });

  it('updates form fields correctly', () => {
    render(<OrderForm />);

    const priceInput = screen.getByLabelText('Price (USD)') as HTMLInputElement;
    const sizeInput = screen.getByLabelText('Size (BTC)') as HTMLInputElement;

    fireEvent.change(priceInput, { target: { value: '67500' } });
    fireEvent.change(sizeInput, { target: { value: '0.001' } });

    expect(priceInput.value).toBe('67500');
    expect(sizeInput.value).toBe('0.001');
  });

  it('shows estimated total correctly', () => {
    render(<OrderForm />);

    const priceInput = screen.getByLabelText('Price (USD)');
    const sizeInput = screen.getByLabelText('Size (BTC)');

    fireEvent.change(priceInput, { target: { value: '67500' } });
    fireEvent.change(sizeInput, { target: { value: '0.001' } });

    expect(screen.getByText('$67.50')).toBeInTheDocument();
  });

  it('generates proof and submits order', async () => {
    const mockGenerateProof = jest.fn(() => Promise.resolve({
      proof: '0x123',
      publicInputs: ['0x456'],
      commitment: '0x789',
    }));

    mockUseZkProof.mockReturnValue({
      generateProof: mockGenerateProof,
      isGenerating: false,
    });

    render(<OrderForm />);

    const priceInput = screen.getByLabelText('Price (USD)');
    const sizeInput = screen.getByLabelText('Size (BTC)');
    const submitButton = screen.getByText(/Generate Proof & Submit/);

    fireEvent.change(priceInput, { target: { value: '67500' } });
    fireEvent.change(sizeInput, { target: { value: '0.001' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockGenerateProof).toHaveBeenCalledWith({
        price: 67500,
        size: 0.001,
        side: 'buy',
        nonce: expect.any(Number),
      });
    });
  });
});