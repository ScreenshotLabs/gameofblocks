import { useCallback, useContext, useMemo, useState } from "react";
import { GaslessServiceContext } from "@/components/gasless-service-context";
import { ARGENT_ACCOUNT_CLASSHASH } from "@/core/constants";
import { generateKeyPair, getArgentAccountAddress } from "@/lib/account";
import { cloudStorage } from "@telegram-apps/sdk-react";
import { ec } from "starknet";

import { useClientOnce } from "./useClientOnce";

const PK_KEY = "pk";

export default function useAccount() {
  const gaslessService = useContext(GaslessServiceContext);

  const [keyPair, setKeyPair] = useState<{
    privateKey: string;
    publicKey: string;
  }>();

  const encryptPrivateKey = (privateKey: string): string => {
    // TODO: encrypt key
    return privateKey;
  };

  const decryptPrivateKey = (encryptedPrivateKey: string): string => {
    // TODO: decrypt key
    return encryptedPrivateKey;
  };

  const savePrivateKeyToTelegram = async (encryptedPrivateKey: string) => {
    await cloudStorage.setItem(PK_KEY, encryptedPrivateKey);
  };

  const retrieveExistingPrivateKey = async () => {
    const encryptedPrivateKey = await cloudStorage.getItem(PK_KEY);

    let privateKey = null;
    let publicKey = null;

    if (!encryptedPrivateKey) {
      return {
        publicKey,
        privateKey,
      };
    } else {
      privateKey = decryptPrivateKey(encryptedPrivateKey);
      publicKey = ec.starkCurve.getStarkKey(privateKey);
    }

    setKeyPair({ privateKey, publicKey });

    return { privateKey, publicKey };
  };

  const generateAndStorePrivateKey = useCallback(async () => {
    console.log("=> generateAndStorePrivateKey");
    const keyPair = generateKeyPair();
    setKeyPair(keyPair);
    const encryptedPrivateKey = encryptPrivateKey(keyPair.privateKey);

    await savePrivateKeyToTelegram(encryptedPrivateKey);
  }, []);

  useClientOnce(() => {
    const initializeAccountAsync = async () => {
      const { privateKey } = await retrieveExistingPrivateKey();

      if (!privateKey) {
        await generateAndStorePrivateKey();
      }
    };

    void initializeAccountAsync();
  });

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
