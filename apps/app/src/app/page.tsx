"use client";

import ClearStorageButton from "@/components/debug/clear-storage-button";
import Game from "@/components/game";
import { Page } from "@/components/page";

// import { useTranslations } from "next-intl";

export default function Home() {
  // const t = useTranslations("i18n");

  return (
    <Page back={false}>
      <Game />
      <div className="absolute bottom-0 h-10">
        <ClearStorageButton />
      </div>
    </Page>
  );
}
