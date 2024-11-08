"use client";

import Link from "next/link";
import ClearStorageButton from "@/components/debug/clear-storage-button";
import { Page } from "@/components/page";
import PaymentButton from "@/components/payment-button";
import useAccount from "@/hooks/useAccount";

export default function DebugPage() {
  const { account, publicKey } = useAccount();

  return (
    <Page>
      <div className="flex flex-col gap-4 p-10 text-white">
        <div>
          <Link
            href={`https://sepolia.starkscan.co/contract/${account?.address}`}
          >
            Account address: {account?.address}
          </Link>
        </div>
        <div>Public key: {publicKey}</div>

        <PaymentButton />
        <ClearStorageButton />
      </div>
    </Page>
  );
}
