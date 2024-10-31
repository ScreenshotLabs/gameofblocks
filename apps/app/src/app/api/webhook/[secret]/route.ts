import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";
import TelegramBot from "node-telegram-bot-api";

export async function POST(
  req: NextRequest,
  { params }: { params: { secret: string } },
) {
  if (params.secret !== env.WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Invalid webhook secret" },
      { status: 403 },
    );
  }

  const data = await req.json();
  console.log("=> NOTIFICATION DATA", data);

  const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN);

  const { update_id, pre_checkout_query } = data;

  if (!pre_checkout_query) {
    console.error("Pre checkout query is missing from the data.");
    return NextResponse.json(
      { error: "Pre checkout query is missing" },
      { status: 400 },
    );
  }

  const { id } = pre_checkout_query;
  const res = await bot.answerPreCheckoutQuery(id, true);

  return NextResponse.json({ success: true });
}
