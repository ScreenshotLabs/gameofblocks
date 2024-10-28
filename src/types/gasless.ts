export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface GaslessConfig {
  apiKey: string;
  baseUrl: string;
}

export interface TransactionConfig extends GaslessConfig {
  protocol?: string;
}
