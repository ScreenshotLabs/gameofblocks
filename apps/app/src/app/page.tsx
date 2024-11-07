"use client";

import Game from "@/components/game";
import { Page } from "@/components/page";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("i18n");

  return (
    <Page back={false}>
      <Game />
    </Page>
  );
}
