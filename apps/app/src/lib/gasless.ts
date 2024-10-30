import type { StarknetNetwork } from "@/types/starknet";
import {
  BASE_URL,
  DeploymentData,
  fetchAccountCompatibility,
  fetchAccountsRewards,
  fetchGaslessStatus,
  fetchGasTokenPrices,
  SEPOLIA_BASE_URL,
} from "@avnu/gasless-sdk";
import {
  Account,
  BlockIdentifier,
  Call,
  RpcProvider,
  stark,
  transaction,
  TypedData,
} from "starknet";

/**
 * Service class for interacting with the gasless service.
 */
export class GaslessService {
  public network: StarknetNetwork;

  /**
   * Initializes a new instance of the GaslessService class.
   * @param provider - The RPC provider to use for StarkNet interactions.
   * @param config - The configuration for the GaslessService, including the API key and network.
   */
  constructor(
    private readonly provider: RpcProvider,
    network: StarknetNetwork,
  ) {
    this.network = network;
  }

  /**
   * Returns the base URL for the gasless service based on the network.
   * @returns The base URL for the gasless service.
   */
  getBaseUrl() {
    return this.network === "sepolia" ? SEPOLIA_BASE_URL : BASE_URL;
  }

  /**
   * Checks the status of the gasless service.
   * @returns A promise that resolves to a boolean indicating the service status.
   */
  async checkServiceStatus(): Promise<boolean> {
    try {
      const { status } = await fetchGaslessStatus({
        baseUrl: this.getBaseUrl(),
      });
      return status;
    } catch (error) {
      console.error("Failed to check gasless service status:", error);
      throw new Error("Service status check failed");
    }
  }

  /**
   * Checks if an account is compatible with the gasless service.
   * @param accountAddress - The address of the account to check.
   * @returns A promise that resolves to a boolean indicating the account's compatibility.
   */
  async checkAccountCompatibility(accountAddress: string): Promise<boolean> {
    try {
      const { isCompatible, dataGasConsumedOverhead, gasConsumedOverhead } =
        await fetchAccountCompatibility(accountAddress, {
          baseUrl: this.getBaseUrl(),
        });
      return isCompatible;
    } catch (error) {
      console.error("Failed to check account compatibility:", error);
      throw new Error("Account compatibility check failed");
    }
  }

  /**
   * Fetches the prices of gas tokens.
   * @returns A promise that resolves to the gas token prices.
   */
  async getTokenPrices() {
    try {
      return await fetchGasTokenPrices({
        baseUrl: this.getBaseUrl(),
      });
    } catch (error) {
      console.error("Failed to fetch gas token prices:", error);
      throw new Error("Gas token prices fetch failed");
    }
  }

  /**
   * Fetches the rewards for a given account.
   * @param accountAddress - The address of the account for which to fetch rewards.
   * @returns A promise that resolves to the account rewards.
   */
  async getAccountRewards(accountAddress: string) {
    try {
      return await fetchAccountsRewards(accountAddress, {
        baseUrl: this.getBaseUrl(),
        protocol: "gasless-sdk",
      });
    } catch (error) {
      console.error("Failed to fetch account rewards:", error);
      throw new Error("Account rewards fetch failed");
    }
  }

  /**
   * Estimates the gas cost for a set of calls on a given account.
   * @param accountAddress - The address of the account.
   * @param calls - The calls to estimate the gas cost for.
   * @returns The estimated gas cost.
   */
  async estimateCalls(accountAddress: string, calls: Call[]) {
    try {
      const contractVersion =
        await this.provider.getContractVersion(accountAddress);
      const nonce = await this.provider.getNonceForAddress(accountAddress);
      const details = stark.v3Details({ skipValidate: true });

      const invocation = {
        ...details,
        contractAddress: accountAddress,
        calldata: transaction.getExecuteCalldata(calls, contractVersion.cairo),
        signature: [],
      };

      const invocationWithDetails = {
        ...details,
        nonce,
      };

      return this.provider.getInvokeEstimateFee(
        invocation,
        invocationWithDetails,
        "pending" as BlockIdentifier,
        true,
      );
    } catch (error) {
      console.error("Failed to estimate gas cost:", error);
      throw new Error("Gas cost estimation failed");
    }
  }

  /**
   * Prepares deployment data for an account.
   * @param accountPublicKey - The public key of the account.
   * @param accountClassHash - The class hash of the account.
   * @returns The deployment data for the account.
   */
  getDeploymentData(accountPublicKey: string, accountClassHash: string) {
    const deploymentData: DeploymentData = {
      calldata: [accountPublicKey, "0x0"],
      class_hash: accountClassHash,
      salt: accountPublicKey,
      unique: "0x0",
    };

    return deploymentData;
  }

  /**
   * Creates a new account instance.
   * @param accountAddress - The address of the account.
   * @param accountPrivateKey - The private key of the account.
   * @returns A new instance of the Account class.
   */
  getAccount(accountAddress: string, accountPrivateKey: string) {
    return new Account(this.provider, accountAddress, accountPrivateKey);
  }

  /**
   * Prepares execution transaction data for an account.
   * @param accountAddress - The address of the account.
   * @param accountPrivateKey - The private key of the account.
   * @param typedData - The typed data for the transaction.
   * @returns The execution transaction data.
   */
  async getExecutionTransactionData(
    accountAddress: string,
    accountPrivateKey: string,
    typedData: TypedData,
  ) {
    const account = this.getAccount(accountAddress, accountPrivateKey);
    const signature = await account.signMessage(typedData);

    return {
      signature,
    };
  }
}
