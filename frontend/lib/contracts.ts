import { ethers } from 'ethers';
import { useWallet } from '@/lib/hooks/use-wallet';

// Mock ABI for ShadowSats contract
export const SHADOWSATS_ABI = [
  {
    "inputs": [
      { "name": "commitment", "type": "bytes32" },
      { "name": "proof", "type": "bytes" },
      { "name": "publicInputs", "type": "uint256[]" }
    ],
    "name": "submitOrder",
    "outputs": [{ "name": "orderId", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "batchId", "type": "uint256" },
      { "name": "proof", "type": "bytes" },
      { "name": "data", "type": "bytes" }
    ],
    "name": "executeBatch",
    "outputs": [{ "name": "success", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "user", "type": "address" }],
    "name": "getBalance",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "amount", "type": "uint256" }],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "amount", "type": "uint256" }],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export function useShadowSatsContract() {
  const { provider } = useWallet();

  const getContract = () => {
    if (!provider) {
      throw new Error('Provider not available');
    }

    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, SHADOWSATS_ABI, signer);
  };

  const submitOrder = async (commitment: string, proof: string, publicInputs: string[]) => {
    const contract = getContract();
    const tx = await contract.submitOrder(commitment, proof, publicInputs);
    return tx.wait();
  };

  const executeBatch = async (batchId: number, proof: string, data: string) => {
    const contract = getContract();
    const tx = await contract.executeBatch(batchId, proof, data);
    return tx.wait();
  };

  const deposit = async (amount: string) => {
    const contract = getContract();
    const tx = await contract.deposit(ethers.parseEther(amount), {
      value: ethers.parseEther(amount)
    });
    return tx.wait();
  };

  const withdraw = async (amount: string) => {
    const contract = getContract();
    const tx = await contract.withdraw(ethers.parseEther(amount));
    return tx.wait();
  };

  const getBalance = async (address: string) => {
    const contract = getContract();
    const balance = await contract.getBalance(address);
    return ethers.formatEther(balance);
  };

  return {
    submitOrder,
    executeBatch,
    deposit,
    withdraw,
    getBalance,
  };
}