"use client";

import ClearStorageButton from "@/components/debug/clear-storage-button";
import { Page } from "@/components/page";
import PaymentButton from "@/components/payment-button";

export default function DebugPage() {
  return (
    <Page>
      <div className="flex flex-col gap-4 p-10">
        <PaymentButton />
        <ClearStorageButton />
      </div>
    </Page>
  );
}
