"use client";

import ClickButton from "@/components/ClickButton";
import { Page } from "@/components/Page";
import PaymentButton from "@/components/PaymentButton";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("i18n");

  return (
    <Page back={false}>
      <div className="flex flex-col gap-4 p-10">
        <ClickButton />
        <PaymentButton />
      </div>
    </Page>
  );
}
