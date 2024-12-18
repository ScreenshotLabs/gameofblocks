import Link from "next/link";

import GameHeader from "./game-header";
import GoldIcon from "./gold-icon";
import LevelIcon from "./level-icon";

function Level({ level }: { level: number }) {
  return (
    <Link
      href="/level"
      className="relative flex h-[26px] w-[62px] items-center justify-center rounded-lg bg-[#0A132A] font-bold text-[#FFBA08]"
    >
      <LevelIcon className="absolute left-0 top-0 -ml-[28px] -mt-[4px]" />
      <div className="leading-none">LVL{level}</div>
    </Link>
  );
}

function Gold({ gold }: { gold: number }) {
  return (
    <div className="relative flex h-[26px] w-[130px] items-center justify-center rounded-full border border-[#1D3261] bg-[#29437C] font-bold text-[#FFBA08]">
      <GoldIcon className="absolute left-0 top-0 -ml-[10px] -mt-[7px]" />
      <div className="leading-none">{gold}</div>
    </div>
  );
}

export default function TopBar({
  gold,
  level,
}: {
  gold: number;
  level: number;
}) {
  return (
    <div className="absolute left-0 top-0 z-50 w-full">
      <div className="flex justify-between bg-[#0B1938] p-4 pb-2">
        <Gold gold={gold} />
        <Level level={level} />
      </div>
      <GameHeader className="relative" />
    </div>
  );
}
