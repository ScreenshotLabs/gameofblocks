import type { Call, WeierstrassSignatureType } from "starknet";
import { useContext, useEffect, useState } from "react";
import { buildTypedData, executeTransaction } from "@/app/actions/gasless";
import { GaslessServiceContext } from "@/components/gasless-service-context";
import { ARGENT_ACCOUNT_CLASSHASH, CONTRACT_ADDRESS } from "@/core/constants";

interface GaslessServiceParams {
  address?: string;
  privateKey?: string;
  publicKey?: string;
}

export const useGaslessService = (params: GaslessServiceParams) => {
  const { address, privateKey, publicKey } = params;
  const gaslessService = useContext(GaslessServiceContext);
  const [transactions, setTransactions] = useState<string[]>([]);
  const [isServiceWorking, setIsServiceWorking] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const checkServiceStatusAsync = async () => {
      if (!gaslessService) {
        console.error("Gasless service is not available");
        setIsServiceWorking(false);
        return;
      }
      try {
        const isServiceWorking = await gaslessService.checkServiceStatus();
        setIsServiceWorking(isServiceWorking);
      } catch (error) {
        handleErrors(error);
        setIsServiceWorking(false);
      }
    };

    void checkServiceStatusAsync();
  }, [gaslessService]);

  async function playerAttack(numberOfAttacks: number) {
    try {
      if (!gaslessService) {
        throw new Error("Gasless service is not available");
      }

      console.log(
        `Player ${address} is attacking with ${numberOfAttacks} attacks...`,
      );

      if (!address || !privateKey || !publicKey) {
        throw new Error("Missing account information");
      }

      const tokenPrices = await gaslessService.getTokenPrices();
      if (tokenPrices.length === 0) {
        throw new Error("No token prices found.");
      }

      const calls: Call[] = Array.from({ length: numberOfAttacks }, () => ({
        entrypoint: "attack_boss",
        contractAddress: CONTRACT_ADDRESS,
        calldata: [],
      }));

      const typedData = await buildTypedData({
        accountAddress: address,
        accountClassHash: ARGENT_ACCOUNT_CLASSHASH,
        calls,
        gasTokenAddress: tokenPrices[0].tokenAddress,
        network: gaslessService.network,
      });

      const transactionExecutionData =
        await gaslessService.getExecutionTransactionData(
          address,
          privateKey,
          typedData,
        );

      const signature =
        transactionExecutionData.signature as WeierstrassSignatureType;

      console.log("Signature (client)", signature);

      const invokeResponse = await executeTransaction({
        accountAddress: address,
        typedData: JSON.stringify(typedData),
        signatureS: signature.s.toString(),
        signatureR: signature.r.toString(),
        network: gaslessService.network,
      });

      console.log("=> invokeResponse", invokeResponse);
      setTransactions((prev) => [...prev, invokeResponse.transactionHash]);
    } catch (error) {
      handleErrors(error);
      throw error;
    }
  }

  async function spawnPlayer() {
    try {
      if (!gaslessService) {
        throw new Error("Gasless service is not available");
      }

      console.log("Spawning new player...");

      if (!address || !privateKey || !publicKey) {
        throw new Error("Missing account information");
      }

      const tokenPrices = await gaslessService.getTokenPrices();
      if (tokenPrices.length === 0) {
        throw new Error("No token prices found.");
      }

      const calls: Call[] = [
        {
          entrypoint: "spawn",
          contractAddress: CONTRACT_ADDRESS,
          calldata: [],
        },
      ];

      const typedData = await buildTypedData({
        accountAddress: address,
        accountClassHash: ARGENT_ACCOUNT_CLASSHASH,
        calls,
        gasTokenAddress: tokenPrices[0].tokenAddress,
        network: gaslessService.network,
      });

      const transactionExecutionData =
        await gaslessService.getExecutionTransactionData(
          address,
          privateKey,
          typedData,
        );

      const deploymentData = gaslessService.getDeploymentData(
        publicKey,
        ARGENT_ACCOUNT_CLASSHASH,
      );

      const signature =
        transactionExecutionData.signature as WeierstrassSignatureType;

      console.log("Signature (client)", signature);

      const invokeResponse = await executeTransaction({
        accountAddress: address,
        typedData: JSON.stringify(typedData),
        signatureS: signature.s.toString(),
        signatureR: signature.r.toString(),
        network: gaslessService.network,
        deploymentData,
      });

      console.log("=> invokeResponse", invokeResponse);
      setTransactions((prev) => [...prev, invokeResponse.transactionHash]);
    } catch (error) {
      handleErrors(error);
      throw error;
    }
  }

  async function checkAccountCompatibilityAsync(address: string) {
    if (!gaslessService) {
      console.error("Gasless service is not available");
      return false;
    }
    try {
      return await gaslessService.checkAccountCompatibility(address);
    } catch (error) {
      handleErrors(error);
      return false;
    }
  }

  function clearError() {
    setError(undefined);
  }

  function handleErrors(error: any) {
    console.error("An error occurred:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    setError(errorMessage);
  }

  return {
    error,
    isServiceWorking,
    checkAccountCompatibilityAsync,
    clearError,
    transactions,
    spawnPlayer,
    playerAttack,
    network: gaslessService?.network,
  };
};
