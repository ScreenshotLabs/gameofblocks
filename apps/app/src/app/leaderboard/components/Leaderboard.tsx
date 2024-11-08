"use client";

export default function Leaderboard() {
  return (
    <div className="p-4">
      <div className="flex gap-4">
        <div className="flex h-24 flex-1 flex-col items-center justify-center rounded-xl border-2 border-[#1D3261] font-bold">
          <div className="text-white shadow-xl">3,268,461</div>
          <div className="text-[#4665A9]">Total Players</div>
        </div>
        <div className="flex h-24 flex-1 flex-col items-center justify-center rounded-xl border-2 border-[#1D3261] font-bold">
          <div className="text-white shadow-xl">50,105</div>
          <div className="text-[#4665A9]">Your Rank</div>
        </div>
      </div>
    </div>
  );
}
