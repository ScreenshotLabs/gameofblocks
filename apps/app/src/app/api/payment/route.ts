import { env } from "@/env";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest, {}) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/createInvoiceLink`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Ranked Account",
      description: "Example Order",
      payload: "payload",
      provider_token: "123",
      currency: "XTR",
      prices: [{ label: "fufo", amount: 1 }],
    }),
  });

  const data = await response.json();
  const { result } = data;

  console.log("=> data", data);

  const slug = result.split("$")[1];

  return NextResponse.json({ slug });
}
