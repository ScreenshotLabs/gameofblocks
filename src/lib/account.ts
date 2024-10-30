import { CallData, ec, hash, stark } from "starknet";

/**
 * Generates a new private and public key pair using StarkNet's cryptographic curve.
 * @returns An object containing the generated private and public keys.
 */
export function generateKeyPair(): { privateKey: string; publicKey: string } {
  const privateKey = stark.randomAddress();
  const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);
  return { privateKey, publicKey: starkKeyPub };
}

/**
 * Calculates the account address from the public key.
 * @param publicKey - The public key of the account.
 * @returns The account address.
 */
export function getArgentAccountAddress(
  publicKey: string,
  accountClassHash: string
): string {
  const contractAddress = hash.calculateContractAddressFromHash(
    publicKey,
    accountClassHash,
    CallData.compile({
      owner: publicKey,
      guardian: "0",
    }),
    0
  );

  return contractAddress;
}
