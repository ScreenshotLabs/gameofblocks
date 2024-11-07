"use client";

import Game from "@/components/Game";
import { Page } from "@/components/Page";

// import { useTranslations } from "next-intl";

export default function Home() {
  // const t = useTranslations("i18n");

  return (
    <Page back={false}>
      <Game />
    </Page>
  );
}
