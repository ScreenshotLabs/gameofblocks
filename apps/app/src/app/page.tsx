"use client";

import ClickButton from "@/components/ClickButton";
import { Page } from "@/components/Page";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("i18n");

  return (
    <Page back={false}>
      <ClickButton />
    </Page>
  );
}