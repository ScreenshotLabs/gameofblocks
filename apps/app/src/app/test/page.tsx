"use client";

import BottomBar from "@/components/bottom-bar";
import { PageGame } from "@/components/page-game";
import TopBar from "@/components/top-bar";

export default function TestPage() {
  return (
    <PageGame>
      <TopBar />
      {/* <div className="text-game-text mt-[130px] flex flex-col gap-4 px-14">
        <div className="text-game-text-bright mb-2 text-center font-bold">
          PEPE THE MAGNIFICENT
        </div>
        <div className="flex justify-center">
          <Lifebar max={1000} value={0} />
        </div>
        <InteractiveZone
          playerDamage={100}
          className="h-[400px] border-2 border-white"
          onInteraction={() => console.log("onInteraction")}
        />
      </div> */}
      <BottomBar />
    </PageGame>
  );
}
