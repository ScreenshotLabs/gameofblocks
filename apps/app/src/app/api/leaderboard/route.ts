import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { db, players } from "@gameofblocks/database";

export const dynamic = "force-dynamic";

// Type definition for leaderboard entry
interface LeaderboardEntry {
  rank: number;
  contractAddress: string;
  totalGold: number;
  attackPower: number;
  currentBossId: number;
  lastUpdated: Date;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") ?? "100");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    // Get latest player data for each unique contract address
    const leaderboardData = await db
      .select({
        contractAddress: players.contractAddress,
        totalGold: players.totalGold,
        attackPower: players.attackPower,
        currentBossId: players.currentBossId,
        lastUpdated: players.lastUpdated,
      })
      .from(players)
      .orderBy(desc(players.totalGold))
      .limit(limit)
      .offset(offset)
      .where(
        sql`players.last_updated = (
          SELECT MAX(last_updated)
          FROM players AS p2
          WHERE p2.contract_address = players.contract_address
        )`
      );

    // Transform and add rankings to the data
    const rankedLeaderboard: LeaderboardEntry[] = leaderboardData.map((player, index) => ({
      rank: offset + index + 1,
      contractAddress: player.contractAddress ?? "",
      totalGold: Number(player.totalGold),
      attackPower: player.attackPower,
      currentBossId: player.currentBossId,
      lastUpdated: player.lastUpdated,
    }));

    // Get total count of unique players for pagination
    const totalPlayersResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${players.contractAddress})`,
      })
      .from(players);

    const response = {
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