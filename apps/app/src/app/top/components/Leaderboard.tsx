"use client";

import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

import LeaderboardAvatarIcon from "./LeaderboardAvatarIcon";
import LeaderBoardBannerIcon from "./LeaderboardBannerIcon";
import LeaderboardCupIcon from "./LeaderboardCupIcon";
import LeaderboardPlayersIcon from "./LeaderboardPlayersIcon";

interface LeaderboardEntry {
  rank: number;
  contractAddress: string;
  totalGold: number;
  attackPower: number;
  currentBossId: number;
  lastUpdated: Date;
}

interface LeaderboardResponse {
  status: string;
  data: {
    leaderboard: LeaderboardEntry[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
  };
}

const fetchLeaderboard = async (limit = 100, offset = 0) => {
  const response = await fetch(
    `/api/leaderboard?limit=${limit}&offset=${offset}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<LeaderboardResponse>;
};

export default function Leaderboard() {
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => fetchLeaderboard(100, 0),
  });

  const totalPlayers = leaderboardData?.data.pagination.total ?? 0;

  return (
    <div className="flex h-screen flex-col p-4">
      <div className="mb-6 flex gap-4">
        <div className="flex h-24 flex-1 flex-col items-center justify-center rounded-xl border-2 border-[#1D3261] bg-[#0B1938] font-bold">
          <div className="-mt-7 mb-2">
            <LeaderboardPlayersIcon />
          </div>
          <div className="mb-1 font-[800] text-white drop-shadow-[-2px_-2px_0_rgba(255,255,255,0.1)] drop-shadow-[-2px_0_0_rgba(255,255,255,0.1)] drop-shadow-[-2px_2px_0_rgba(255,255,255,0.1)] drop-shadow-[0_-2px_0_rgba(255,255,255,0.1)] drop-shadow-[0_2px_0_rgba(255,255,255,0.1)] drop-shadow-[2px_-2px_0_rgba(255,255,255,0.1)] drop-shadow-[2px_0_0_rgba(255,255,255,0.1)] drop-shadow-[2px_2px_0_rgba(255,255,255,0.1)]">
            {isLoading ? (
              <div className="animate-pulse">Loading...</div>
            ) : (
              totalPlayers.toLocaleString()
            )}
          </div>
          <div className="text-[#4665A9]">Total Players</div>
        </div>
        <div className="flex h-24 flex-1 flex-col items-center justify-center rounded-xl border-2 border-[#1D3261] bg-[#0B1938] font-bold">
          <div className="-mt-7 mb-2">
            <LeaderboardCupIcon />
          </div>
          <div className="mb-1 font-[800] text-white drop-shadow-[-2px_-2px_0_rgba(255,255,255,0.1)] drop-shadow-[-2px_0_0_rgba(255,255,255,0.1)] drop-shadow-[-2px_2px_0_rgba(255,255,255,0.1)] drop-shadow-[0_-2px_0_rgba(255,255,255,0.1)] drop-shadow-[0_2px_0_rgba(255,255,255,0.1)] drop-shadow-[2px_-2px_0_rgba(255,255,255,0.1)] drop-shadow-[2px_0_0_rgba(255,255,255,0.1)] drop-shadow-[2px_2px_0_rgba(255,255,255,0.1)]">
            {isLoading ? (
              <div className="animate-pulse">Loading...</div>
            ) : (
              (leaderboardData?.data.leaderboard[0]?.totalGold.toLocaleString() ??
              "-")
            )}
          </div>
          <div className="text-[#4665A9]">Top Player Gold</div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 pt-3 pb-[150px]">
          {isLoading ? (
            <div className="rounded-xl bg-[#060C1C] px-4 py-3 text-center text-white">
              <div className="animate-pulse">Loading...</div>
            </div>
          ) : (
            leaderboardData?.data.leaderboard.map((player) => (
              <div
                key={player.contractAddress}
                className="pl-[70px] relative flex min-h-[56px] items-center justify-between rounded-xl bg-[#060C1C] px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <div className="absolute w-20 h-20 left-0">
                    <span className="absolute left-[13px] top-[4px] z-10 h-4 w-10 text-center text-2xl font-black text-[#FFB800] text-4xl font-black leading-normal drop-shadow-[0_2px_0_#0B1938]" >
                      {player.rank}
                    </span>
                    <LeaderBoardBannerIcon />
                  </div>
                  <span className="min-w-[110px] text-white font-extrabold">
                    {player.contractAddress.slice(0, 6)}...
                    {player.contractAddress.slice(-4)}
                  </span>
                  <div className="text-white">
                    {player.totalGold.toLocaleString()} Gold
                  </div>
                </div>
                <div className="absolute bottom-[1px] right-0">
                  <LeaderboardAvatarIcon />
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}