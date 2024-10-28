import { useState, useEffect } from "react";
import { SEPOLIA_BASE_URL } from "@avnu/gasless-sdk";
import { GaslessService } from "@/services/gasless";
import * as account from "@/lib/account";
import { AVNU_API_KEY } from "@/core/environment";
import { ARGENT_ACCOUNT_CLASSHASH } from "@/core/constants";
import { KeyPair } from "@/types/gasless";

interface AccountState {
  accountPrivateKey: string | null;
  accountPublicKey: string | null;
  accountAddress: string | null;
  error: string | null;
  isServiceWorking: boolean;
}

const gaslessService = new GaslessService({
  apiKey: AVNU_API_KEY,
  baseUrl: SEPOLIA_BASE_URL,
});

export const useGaslessAccount = () => {
  const [transactions, setTransactions] = useState<string[]>([]);
  const [accountState, setAccountState] = useState<AccountState>({
    accountPrivateKey: null,
    accountPublicKey: null,
    accountAddress: null,
    error: null,
    isServiceWorking: true,
  });

  useEffect(() => {
    const checkServiceStatusAsync = async () => {
      const isServiceWorking = await gaslessService.checkServiceStatus();
      setAccountState((prev) => ({ ...prev, isServiceWorking }));
    };

    const fetchAccountAsync = async () => {
      try {
        const keyPair = account.generateKeyPair();
        const accountAddress = account.getArgentAccountAddress(
          keyPair.publicKey,
          ARGENT_ACCOUNT_CLASSHASH
        );

        setAccountState((prev) => ({
          ...prev,
          accountPrivateKey: keyPair.privateKey,
          accountPublicKey: keyPair.publicKey,
          accountAddress,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        setAccountState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
        throw error;
      }
    };

    checkServiceStatusAsync();
    fetchAccountAsync();
  }, []);

  async function setScore() {
    // TODO: implement it !
  }

  async function checkAccountCompatibilityAsync(address: string) {
    try {
      return await gaslessService.checkAccountCompatibility(address);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to check account compatibility";
      setAccountState((prev) => ({ ...prev, error: errorMessage }));
      return false;
    }
  }

  function clearError() {
    setAccountState((prev) => ({ ...prev, error: null }));
  }

  return {
    accountClassHash: ARGENT_ACCOUNT_CLASSHASH,
    accountPrivateKey: accountState.accountPrivateKey,
    accountPublicKey: accountState.accountPublicKey,
    accountAddress: accountState.accountAddress,
    error: accountState.error,
    isServiceWorking: accountState.isServiceWorking,
    checkAccountCompatibilityAsync,
    clearError,
    transactions,
    setScore,
  };
};
