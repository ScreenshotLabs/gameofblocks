import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

import { env } from "@/env";

export async function POST(req: NextRequest, {}) {
  const data = await req.json();
  console.log("data", data);

  const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN);

  const { update_id, pre_checkout_query } = data;

  // TODO: check if data contains pre_checkout_query and inspect the object structure

  const { id } = pre_checkout_query;
  const res = await bot.answerPreCheckoutQuery(id, true);

  return NextResponse.json({ success: true });
}
