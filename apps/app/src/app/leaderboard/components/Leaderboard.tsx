"use client";

import { useQuery } from "@tanstack/react-query";

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
    `/api/leaderboard?limit=${limit}&offset=${offset}`
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
  const formattedTotalPlayers = totalPlayers.toLocaleString();
  const topRank = leaderboardData?.data.leaderboard[0]?.totalGold.toLocaleString() ?? "-";

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <div className="flex h-24 flex-1 flex-col items-center justify-center rounded-xl border-2 border-[#1D3261] font-bold">
          <div className="text-white shadow-xl">
            {isLoading ? (
              <div className="animate-pulse">Loading...</div>
            ) : (
              formattedTotalPlayers
            )}
          </div>
          <div className="text-[#4665A9]">Total Players</div>
        </div>
        <div className="flex h-24 flex-1 flex-col items-center justify-center rounded-xl border-2 border-[#1D3261] font-bold">
          <div className="text-white shadow-xl">
            {isLoading ? (
              <div className="animate-pulse">Loading...</div>
            ) : (
              topRank
            )}
          </div>
          <div className="text-[#4665A9]">Top Player Gold</div>
        </div>
      </div>
    </div>
  );
}