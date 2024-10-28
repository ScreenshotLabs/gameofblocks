"use client";

import { useGaslessAccount } from "@/hooks/useGaslessAccount";
import { Button } from "./ui/button";

export default function ClickButton() {
  const {
    accountClassHash,
    isServiceWorking,
    error,
    accountAddress,
    accountPrivateKey,
    accountPublicKey,
  } = useGaslessAccount();

  return (
    <div className="p-10">
      {error && <div>Error: {error}</div>}
      <div>AVNU service is working: {isServiceWorking ? "✅" : "❌"}</div>
      <div>Account ClassHash: {accountClassHash}</div>
      <div>Account Address: {accountAddress}</div>
      <div>Private Key: {accountPrivateKey}</div>
      <div>Public Key: {accountPublicKey}</div>
      <div className="mt-4">
        <Button>Send gasless transaction !</Button>
      </div>
    </div>
  );
}
