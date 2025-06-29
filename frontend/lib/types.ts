export interface User {
  address: string;
  balance: number;
  lockedCollateral: number;
}

export interface Order {
  id: string;
  userId: string;
  side: 'buy' | 'sell';
  price: number;
  size: number;
  filled: number;
  status: 'pending' | 'partial' | 'filled' | 'cancelled';
  commitment: string;
  proof: string;
  publicInputs: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Batch {
  id: string;
  orders: Order[];
  status: 'pending' | 'executing' | 'executed' | 'failed';
  totalSize: number;
  gasEstimate: number;
  createdAt: Date;
  executedAt?: Date;
  txHash?: string;
}

export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  contracts: {
    shadowSats: ContractConfig;
  };
}

export interface AppConfig {
  networks: {
    [key: string]: NetworkConfig;
  };
  defaultNetwork: string;
  apiUrl: string;
  adminAddress: string;
}