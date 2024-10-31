"use client";

import { useState } from "react";
import { openInvoice } from "@telegram-apps/sdk-react";

import { Button } from "./ui/button";

export default function PaymentButton() {
  const [invoiceStatus, setInvoiceStatus] = useState<string>();

  return (
    <div>
      <Button
        onClick={async () => {
          const response = await fetch("/api/payment", {
            method: "POST",
          });
          const { slug } = await response.json();
          console.log("slug", slug);

          const invoiceStatus = await openInvoice(slug as string);
          console.log("invoiceStatus", invoiceStatus);
          setInvoiceStatus(invoiceStatus);
        }}
      >
        Payment (Test)
      </Button>
      <div>invoiceStatus: {invoiceStatus}</div>
    </div>
  );
}
