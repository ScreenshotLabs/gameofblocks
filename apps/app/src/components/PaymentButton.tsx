import { openInvoice } from "@telegram-apps/sdk-react";
import { Button } from "./ui/button";

export default function PaymentButton() {
  return (
    <Button
      onClick={async () => {
        const response = await fetch("/api/payment", {
          method: "POST",
        });
        const { slug } = await response.json();
        console.log("slug", slug);

        const invoiceStatus = await openInvoice(slug);
        console.log("invoiceStatus", invoiceStatus);
      }}
    >
      Payment (Test)
    </Button>
  );
}
