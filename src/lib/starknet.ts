import { RpcProvider } from "starknet";

import { RPC_URL } from "../core/constants";

/**
 * Singleton class for managing the StarkNet RPC provider instance.
 */
export class StarknetProvider {
  private static instance: RpcProvider;

  /**
   * Returns the singleton instance of the RpcProvider.
   * If the instance does not exist, it creates a new one using the RPC_URL.
   * @returns The singleton instance of RpcProvider.
   */
  public static getInstance(): RpcProvider {
    if (!StarknetProvider.instance) {
      StarknetProvider.instance = new RpcProvider({ nodeUrl: RPC_URL });
    }
    return StarknetProvider.instance;
  }
}
