"use client";

import BottomBar from "@/components/bottom-bar";
import GameBossName from "@/components/game-boss-name";
import Hero1 from "@/components/heroes/hero-1";
import Lifebar from "@/components/lifebar";
import { PageGame } from "@/components/page-game";
import Spell from "@/components/spell";
import Stats from "@/components/stats";
import TopBar from "@/components/top-bar";

export default function TestPage() {
  return (
    <PageGame>
      <TopBar gold={1} level={2} />
      <div className="flex min-h-screen flex-col pb-[100px] pt-[126px]">
        <div className="">
          <GameBossName name="PEPE THE MAGNIFICENT" />
          <Lifebar max={1000} value={952} />
        </div>

        <div className="grow bg-slate-800">Boss</div>

        <div className="flex h-[100px] w-full items-center gap-2">
          <Hero1 className="-mt-[50px]" />
          <Stats />
          <Spell className="-mt-[20px] opacity-30" />
        </div>
      </div>
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
      <BottomBar isPremium={false} />
    </PageGame>
  );
}
