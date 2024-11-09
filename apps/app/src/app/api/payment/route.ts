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
      title: "Premium Account",
      description:
        "Unlock exclusive features and enhance your gameplay experience in the Game of Blocks with a premium account.",
      payload: "payload",
      provider_token: "123",
      currency: "XTR",
      prices: [{ label: "Game of Blocks Premium Access", amount: 1 }],
    }),
  });

  const data = await response.json();
  const { result } = data;
  const slug = result.split("$")[1];

  console.log("=> slug", slug);
  return NextResponse.json({ slug });
}
