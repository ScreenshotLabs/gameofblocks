"use server";

import type { StarknetNetwork } from "@/types/starknet";
import type { DeploymentData } from "@avnu/gasless-sdk";
import type { Call } from "starknet";
import { env } from "@/env";
import {
  BASE_URL,
  fetchBuildTypedData,
  fetchExecuteTransaction,
  SEPOLIA_BASE_URL,
} from "@avnu/gasless-sdk";
import { ec } from "starknet";

export async function buildTypedData(params: {
  accountAddress: string;
  calls: Call[];
  network: StarknetNetwork;
  gasTokenAddress: string;
  accountClassHash: string;
}) {
  const buildTypedData = await fetchBuildTypedData(
    params.accountAddress,
    params.calls,
    params.gasTokenAddress,
    undefined,
    {
      apiKey: env.AVNU_API_KEY,
      baseUrl: params.network === "sepolia" ? SEPOLIA_BASE_URL : BASE_URL,
    },
    params.accountClassHash,
  );

  return buildTypedData;
}

export async function executeTransaction(data: {
  accountAddress: string;
  typedData: string;
  signatureS: string;
  signatureR: string;
  network: string;
  deploymentData?: DeploymentData;
}) {
  const signature = new ec.starkCurve.Signature(
    BigInt(data.signatureR),
    BigInt(data.signatureS),
  );

  try {
    return fetchExecuteTransaction(
      data.accountAddress,
      data.typedData,
      signature,
      {
        apiKey: env.AVNU_API_KEY,
        baseUrl: data.network === "sepolia" ? SEPOLIA_BASE_URL : BASE_URL,
      },
      data.deploymentData,
    );
  } catch (error) {
    console.error("Failed to execute transaction:", error);
    throw new Error("Transaction execution failed");
  }
}
