"use client";

import { useTranslations } from "next-intl";
import { Page } from "@/components/Page";
import ClickButton from "@/components/ClickButton";

export default function Home() {
  const t = useTranslations("i18n");

  return (
    <Page back={false}>
      <ClickButton />
    </Page>
  );
}
