import {
  RpcProvider,
  Call,
  stark,
  transaction,
  Account,
  BlockIdentifier,
} from "starknet";
import {
  fetchBuildTypedData,
  fetchExecuteTransaction,
  DeploymentData,
} from "@avnu/gasless-sdk";
import { SEPOLIA_BASE_URL } from "@avnu/gasless-sdk";
import { GaslessConfig } from "../types/gasless";

export class TransactionService {
  constructor(
    private readonly provider: RpcProvider,
    private readonly config: GaslessConfig
  ) {}

  /**
   * Estimates the gas cost for a set of calls on a given account.
   * @param accountAddress - The address of the account.
   * @param calls - The calls to estimate the gas cost for.
   * @returns The estimated gas cost.
   */
  async estimateCalls(accountAddress: string, calls: Call[]) {
    const contractVersion = await this.provider.getContractVersion(
      accountAddress
    );
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
      true
    );
  }

  /**
   * Executes a transaction on behalf of an account using gasless transactions.
   * @param accountAddress - The address of the account.
   * @param accountPublicKey - The public key of the account.
   * @param accountPrivateKey - The private key of the account.
   * @param calls - The calls to execute.
   * @param gasTokenAddress - The address of the gas token.
   * @param accountClassHash - The class hash of the account.
   * @returns The result of the transaction execution.
   */
  async executeTransaction(
    accountAddress: string,
    accountPublicKey: string,
    accountPrivateKey: string,
    calls: Call[],
    gasTokenAddress: string,
    accountClassHash: string
  ) {
    const buildTypedData = await fetchBuildTypedData(
      accountAddress,
      calls,
      gasTokenAddress,
      undefined,
      {
        apiKey: this.config.apiKey,
        baseUrl: SEPOLIA_BASE_URL,
      },
      accountClassHash
    );

    console.log("TransactionService: buildTypedData", buildTypedData);

    const account = new Account(
      this.provider,
      accountAddress,
      accountPrivateKey
    );
    const signature = await account.signMessage(buildTypedData);

    const deploymentData: DeploymentData = {
      calldata: [accountPublicKey, "0x0"],
      class_hash: accountClassHash,
      salt: accountPublicKey,
      unique: "0x0",
    };

    console.log("TransactionService: deploymentData", deploymentData);

    return fetchExecuteTransaction(
      accountAddress,
      JSON.stringify(buildTypedData),
      signature,
      {
        apiKey: this.config.apiKey,
        baseUrl: SEPOLIA_BASE_URL,
      },
      deploymentData
    );
  }
}
