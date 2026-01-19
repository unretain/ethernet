import type { Block, Transaction, TransactionReceipt } from 'viem';

export type { Block, Transaction, TransactionReceipt };

export interface AddressInfo {
  balance: bigint;
  transactionCount: number;
}
