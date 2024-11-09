import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db, players } from "@gameofblocks/database";

export const dynamic = "force-dynamic";

interface LeaderboardEntry {
  rank: number;
  contractAddress: string;
  totalGold: number;
  attackPower: number;
  currentBossId: number;
  lastUpdated: Date;
}

interface LeaderboardResponse {
  status: "success";
  data: {
    leaderboard: LeaderboardEntry[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
  };
}

interface RawPlayerData {
  [key: string]: unknown;
  contract_address: string;
  total_gold: string | number;
  attack_power: number;
  current_boss_id: number;
  last_updated: Date;
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<LeaderboardResponse | { error: string }>> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "100"));
    const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0"));

    const result = await db.execute<RawPlayerData>(sql`
      WITH RankedPlayers AS (
        SELECT 
          contract_address,
          total_gold,
          attack_power,
          current_boss_id,
          last_updated,
          ROW_NUMBER() OVER (PARTITION BY contract_address ORDER BY last_updated DESC) as rn
        FROM players
      )
      SELECT 
        contract_address,
        total_gold,
        attack_power,
        current_boss_id,
        last_updated
      FROM RankedPlayers
      WHERE rn = 1
      ORDER BY total_gold DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `);

    // Access the rows from the result
    const rankedLeaderboard: LeaderboardEntry[] = (result.rows).map((player, index) => {
      const totalGold = typeof player.total_gold === 'string' ? 
        Number(player.total_gold) : 
        (typeof player.total_gold === 'number' ? player.total_gold : 0);

      return {
        rank: offset + index + 1,
        contractAddress: player.contract_address,
        totalGold,
        attackPower: Number(player.attack_power),
        currentBossId: Number(player.current_boss_id),
        lastUpdated: new Date(player.last_updated),
      };
    });

    // Get total count of unique players
    const totalPlayersResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${players.contractAddress})`,
      })
      .from(players);

    const response: LeaderboardResponse = {
      status: "success",
      data: {
        leaderboard: rankedLeaderboard,
        pagination: {
          total: totalPlayersResult[0].count,
          limit,
          offset,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}