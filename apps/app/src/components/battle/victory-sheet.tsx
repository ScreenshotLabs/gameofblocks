"use client";

import { Sheet, SheetContent} from "@/components/ui/sheet";

import BattleVictory from "./victory";

export function VictorySheet() {
  return (
    <Sheet>
      <SheetContent
        side="bottom"
        className="text-game-text-bright rounded-t-2xl border-none bg-[#0C1B3D] p-0"
      >
        <BattleVictory />
      </SheetContent>
    </Sheet>
  );
}
