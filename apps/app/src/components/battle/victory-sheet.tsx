"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "../ui/button";
import BattleVictory from "./victory";

export function VictorySheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open victory sheet</Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="text-game-text-bright rounded-t-2xl border-none bg-[#0C1B3D] p-0"
      >
        <BattleVictory />
      </SheetContent>
    </Sheet>
  );
}
