"use client";

// import ClearStorageButton from "@/components/debug/clear-storage-button";
import Game from "@/components/game";
import { Page } from "@/components/page";

export default function Home() {
  return (
    <Page back={false}>
      <Game />
      {/* <div className="fixed top-0 h-14 w-full z-[100] opacity-0">
        <ClearStorageButton />
      </div> */}
    </Page>
  );
}
