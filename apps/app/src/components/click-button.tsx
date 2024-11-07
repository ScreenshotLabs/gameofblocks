"use client";

import { startTransition } from "react";
import Link from "next/link";
import useAccount from "@/hooks/useAccount";
import { useGaslessService } from "@/hooks/useGaslessService";

import { Button } from "./ui/button";

export default function ClickButton() {
  const { account, privateKey, publicKey, classHash } = useAccount();
  const { isServiceWorking, error, incrementScore, transactions, network } =
    useGaslessService({
      address: account?.address,
      publicKey,
      privateKey,
    });

  const handleIncrementScore = () => {
    startTransition(async () => {
      try {
        await incrementScore();
      } catch (error) {
        console.error("Failed to increment score:", error);
      }
    });
  };

  if (!isServiceWorking) {
    return <div className="text-red-500">Service is currently unavailable</div>;
  }

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <div>AVNU service is working: {isServiceWorking ? "✅" : "❌"}</div>
      <div>Account ClassHash: {classHash}</div>
      <div>Account Address: {account?.address}</div>
      <div>Private Key: {privateKey}</div>
      <div>Public Key: {publicKey}</div>
      <div className="mt-4">
        <Button
          onClick={handleIncrementScore}
          disabled={!account?.address}
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Increment Score
        </Button>
      </div>

      <div className="mt-4 border p-4">
        <h2 className="text-xl">Transactions</h2>
        <div>
          {transactions.map((transaction, index) => (
            <div key={index}>
              <Link
                target="_blank"
                href={`https://${
                  network === "sepolia" ? "sepolia." : ""
                }starkscan.co/tx/${transaction}`}
                className="text-blue-500 hover:text-blue-700"
              >
                {transaction}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
