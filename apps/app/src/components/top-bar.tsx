import Link from "next/link";

export default function TopBar() {
  return (
    <div className="relative z-10 flex h-[51px] items-center gap-4 bg-[#0B1938] px-4">
      <div className="rounded-lg bg-[#0A132A] px-4 font-bold text-[#DAE6FF]">
        <Link href="/leaderboard">Leaderboard</Link>
      </div>
      <div className="rounded-lg bg-[#0A132A] px-4 font-bold text-[#FFBA08]">
        LVL 1
      </div>
    </div>
  );
}
