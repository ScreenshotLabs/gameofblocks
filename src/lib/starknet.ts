import { RpcProvider } from "starknet";

import { RPC_URL } from "../core/constants";

export class ProviderService {
  private static instance: RpcProvider;

  public static getInstance(): RpcProvider {
    if (!ProviderService.instance) {
      ProviderService.instance = new RpcProvider({ nodeUrl: RPC_URL });
    }
    return ProviderService.instance;
  }
}
