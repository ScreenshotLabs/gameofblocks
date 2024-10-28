import {
  fetchGaslessStatus,
  fetchGasTokenPrices,
  fetchAccountCompatibility,
  fetchAccountsRewards,
  SEPOLIA_BASE_URL,
} from "@avnu/gasless-sdk";
import { GaslessConfig } from "../types/gasless";

export class GaslessService {
  constructor(private readonly config: GaslessConfig) {}

  /**
   * Checks the status of the gasless service.
   * @returns A promise that resolves to a boolean indicating the service status.
   */
  async checkServiceStatus(): Promise<boolean> {
    const { status } = await fetchGaslessStatus({
      baseUrl: SEPOLIA_BASE_URL,
      apiKey: this.config.apiKey,
    });
    return status;
  }

  /**
   * Checks if an account is compatible with the gasless service.
   * @param accountAddress - The address of the account to check.
   * @returns A promise that resolves to a boolean indicating the account's compatibility.
   */
  async checkAccountCompatibility(accountAddress: string): Promise<boolean> {
    const { isCompatible, dataGasConsumedOverhead, gasConsumedOverhead } =
      await fetchAccountCompatibility(accountAddress, {
        apiKey: this.config.apiKey,
        baseUrl: SEPOLIA_BASE_URL,
      });
    return isCompatible;
  }

  /**
   * Fetches the prices of gas tokens.
   * @returns A promise that resolves to the gas token prices.
   */
  async getTokenPrices() {
    return fetchGasTokenPrices({
      apiKey: this.config.apiKey,
      baseUrl: SEPOLIA_BASE_URL,
    });
  }

  /**
   * Fetches the rewards for a given account.
   * @param accountAddress - The address of the account for which to fetch rewards.
   * @returns A promise that resolves to the account rewards.
   */
  async getAccountRewards(accountAddress: string) {
    return fetchAccountsRewards(accountAddress, {
      apiKey: this.config.apiKey,
      baseUrl: SEPOLIA_BASE_URL,
      protocol: "gasless-sdk",
    });
  }
}
