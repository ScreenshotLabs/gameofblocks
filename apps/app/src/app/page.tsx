"use client";

import ClearStorageButton from "@/components/debug/clear-storage-button";
import Game from "@/components/game";
import { Page } from "@/components/page";

export default function Home() {
  return (
    <Page back={false}>
      <Game />
      <div className="fixed top-0 h-14 w-full bg-red-500 z-[100]">
        <ClearStorageButton />
      </div>
    </Page>
  );
}
