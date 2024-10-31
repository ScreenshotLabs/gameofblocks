import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";

export async function POST(req: NextRequest, {}) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/createInvoiceLink`;
  console.log("=> url", url);

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
  const slug = result.split("$")[1];

  console.log("=> slug", slug);

  return NextResponse.json({ slug });
}
