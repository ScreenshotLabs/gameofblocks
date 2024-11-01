import { useContext, useEffect, useMemo, useState } from "react";
import { GaslessServiceContext } from "@/components/GaslessServiceContext";
import { ARGENT_ACCOUNT_CLASSHASH } from "@/core/constants";
import { generateKeyPair, getArgentAccountAddress } from "@/lib/account";

export default function useAccount() {
  const gaslessService = useContext(GaslessServiceContext);

  const [keyPair, setKeyPair] = useState<{
    privateKey: string;
    publicKey: string;
  }>();

  const encryptPrivateKey = (privateKey: string): string => {
    // Placeholder for actual encryption logic
    return privateKey; // This should be replaced with actual encryption logic
  };

  const decryptPrivateKey = (encryptedPrivateKey: string): string => {
    // Placeholder for actual decryption logic
    return encryptedPrivateKey; // This should be replaced with actual decryption logic
  };

  const savePrivateKeyToTelegram = async (encryptedPrivateKey: string) => {
    // ...

    // Placeholder for actual Telegram API call to save private key
    console.log("Saving private key to Telegram:", encryptedPrivateKey); // This should be replaced with actual Telegram API call
  };

  const retrieveExistingPrivateKey = async (): Promise<string | undefined> => {
    // Placeholder for actual Telegram API call to retrieve private key
    return undefined; // This should be replaced with actual Telegram API call
  };

  const generateAndStorePrivateKey = async () => {
    const keyPair = generateKeyPair();
    setKeyPair(keyPair);
    const encryptedPrivateKey = encryptPrivateKey(keyPair.privateKey);
    await savePrivateKeyToTelegram(encryptedPrivateKey);
  };

  useEffect(() => {
    const initializeAccountAsync = async () => {
      const existingPrivateKey = await retrieveExistingPrivateKey();
      if (!existingPrivateKey) {
        await generateAndStorePrivateKey();
      }
    };

    initializeAccountAsync();
  }, []);

  const account = useMemo(() => {
    if (!keyPair || !gaslessService) {
      return null;
    }

    const accountAddress = getArgentAccountAddress(
      keyPair.publicKey,
      ARGENT_ACCOUNT_CLASSHASH,
    );

    return gaslessService.getAccount(accountAddress, keyPair.privateKey);
  }, [keyPair, gaslessService]);

  return {
    account,
    classHash: ARGENT_ACCOUNT_CLASSHASH,
    publicKey: keyPair?.publicKey,
    privateKey: keyPair?.privateKey,
  };
}
