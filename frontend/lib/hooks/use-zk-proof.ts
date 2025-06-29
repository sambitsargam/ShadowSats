'use client';

import { useState } from 'react';
import { zkProof } from '@/lib/zk-proof';

export interface OrderProofInput {
  price: number;
  size: number;
  side: 'buy' | 'sell';
  nonce: number;
}

export interface OrderProof {
  proof: string;
  publicInputs: string[];
  commitment: string;
}

export function useZkProof() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProof = async (input: OrderProofInput): Promise<OrderProof> => {
    setIsGenerating(true);
    try {
      const proof = await zkProof.generateOrderProof(input);
      return proof;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateProof,
    isGenerating,
  };
}