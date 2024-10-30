import type { Calldata, RawArgs } from "starknet";

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface TransactionConfig {
  protocol?: string;
}

export interface GaslessCallData {
  accountAddress: string;
  accountPrivateKey: string;
  accountPublicKey: string;
  entrypoint: string;
  calldata?: RawArgs | Calldata;
}
