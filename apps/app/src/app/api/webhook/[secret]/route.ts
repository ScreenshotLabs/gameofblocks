import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";
import TelegramBot from "node-telegram-bot-api";

import { db, payments, players } from "@gameofblocks/database";

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

  console.log("=> data", data);
  const { update_id, pre_checkout_query, message } = data;

  if (pre_checkout_query) {
    const { id, from } = pre_checkout_query;

    /*    data {
      update_id: 167777302,
      pre_checkout_query: {
        id: '3181154053631060920',
        from: {
          id: 740670145,
          is_bot: false,
          first_name: 'Rémi',
          username: 'remiroy',
          language_code: 'fr',
          is_premium: true
        },
        currency: 'XTR',
        total_amount: 1,
        invoice_payload: 'payload'
      }
    } */

    const res = await bot.answerPreCheckoutQuery(id, true);
    /* if (res) {
      await db
        .update(players)
        .set({ isPremium: true })
        .where({ id: from.id.toString() });
    } */
  }

  if (message?.successful_payment) {
    const {
      currency,
      total_amount,
      invoice_payload,
      telegram_payment_charge_id,
      provider_payment_charge_id,
    } = message.successful_payment;

    try {
      await db.insert(payments).values({
        telegramUserId: message.from.id.toString(),
        amount: total_amount,
        currency,
        telegramPaymentChargeId: telegram_payment_charge_id,
        providerPaymentChargeId: provider_payment_charge_id,
      });

      console.log("Payment record created successfully");
    } catch (error) {
      console.error("Error creating payment record:", error);
      return NextResponse.json(
        { error: "Failed to create payment record" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ success: true });
}
