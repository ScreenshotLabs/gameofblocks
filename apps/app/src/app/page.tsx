"use client";

import ClearStorageButton from "@/components/debug/clear-storage-button";
import Game from "@/components/game";
import { Page } from "@/components/page";

export default function Home() {
  return (
    <Page back={false}>
      <Game />
      <div className="absolute bottom-0 h-10">
        <ClearStorageButton />
      </div>
    </Page>
  );
}
