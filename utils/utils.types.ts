import { useSignTransaction } from '@mysten/dapp-kit';
import {
  DryRunTransactionBlockResponse,
  SuiClient,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
} from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { WalletAccount } from '@mysten/wallet-standard';

export interface TimedSuiTransactionBlockResponse
  extends SuiTransactionBlockResponse {
  time: number;
}

export interface SignAndExecuteArgs {
  tx: Transaction;
  client: SuiClient;
  currentAccount: WalletAccount;
  fallback?: (arg?: string) => void;
  options?: SuiTransactionBlockResponseOptions;
  signTransaction: ReturnType<typeof useSignTransaction>;
  callback?: (arg: DryRunTransactionBlockResponse) => void;
}

export interface WaitForTxArgs {
  digest: string;
  timeout?: number;
  client: SuiClient;
  pollInterval?: number;
}
