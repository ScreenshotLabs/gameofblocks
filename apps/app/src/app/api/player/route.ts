import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import {
  bosses,
  db,
  payments,
  playerBosses,
  players,
} from "@gameofblocks/database";

export const dynamic = "force-dynamic";

// Type Definitions
interface PlayerBossData {
  bossId: number;
  currentHealth: number;
  isDefeated: boolean;
  lastUpdated: Date;
  id: number;
  baseHealth: number | null;
}

function normalizeAddress(address: string): string {
  const cleanAddress = address.toLowerCase().replace("0x", "");
  if (!/^[0-9a-f]+$/.test(cleanAddress)) {
    throw new Error("Address contains invalid characters");
  }

  return `0x${cleanAddress.padStart(64, "0")}`;
}

async function getLatestPlayerBoss(
  playerId: string,
): Promise<PlayerBossData | null> {
  const playerBossData = await db
    .select({
      bossId: playerBosses.bossId,
      currentHealth: playerBosses.currentHealth,
      isDefeated: playerBosses.isDefeated,
      lastUpdated: playerBosses.lastUpdated,
      id: playerBosses.id,
      baseHealth: bosses.baseHealth,
    })
    .from(playerBosses)
    .leftJoin(bosses, eq(playerBosses.bossId, bosses.id))
    .where(and(eq(playerBosses.playerId, playerId)))
    .orderBy(desc(playerBosses.lastUpdated))
    .limit(1);

  if (playerBossData.length === 0) return null;

  return {
    ...playerBossData[0],
    bossId: Number(playerBossData[0].bossId),
    id: Number(playerBossData[0].id),
  };
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const contractAddress = searchParams.get("contractAddress");
    const telegramId = searchParams.get("telegramId");

    if (!contractAddress) {
      return NextResponse.json(
        { error: "Contract address is required" },
        { status: 400 },
      );
    }

    const normalizedAddress = normalizeAddress(contractAddress);

    // Get player data
    const playerData = await db
      .select()
      .from(players)
      .where(eq(players.contractAddress, normalizedAddress))
      .orderBy(desc(players.lastUpdated))
      .limit(1);

    if (!playerData.length) {
      return NextResponse.json(
        {
          data: {
            isInitializationRequired: true,
          },
        },
        { status: 200 },
      );
    }

    const player = playerData[0];
    // Get current boss data
    const playerBossState = await getLatestPlayerBoss(normalizedAddress);

    // Determine if player is initialized
    const isInitialized =
      player.attackPower > 0 &&
      player.energyCap > 0 &&
      player.energyRecovery > 0;
    console.log(playerBossState);

    let isPremium = false;
    if (telegramId) {
      const payment = await db
        .select()
        .from(payments)
        .where(eq(payments.telegramUserId, telegramId))
        .limit(1);

      isPremium = payment.length > 0;
    }

    const response = {
      status: "success",
      data: {
        player: {
          isPremium,
          attack: player.attackPower,
          energyCap: player.energyCap,
          recovery: player.energyRecovery,
          gold: Number(player.totalGold),
          isInitialized,
          stats: {
            attackPower: player.attackPower,
            energyCap: player.energyCap,
            energyRecovery: player.energyRecovery,
            currentBossId: player.currentBossId,
          },
          economy: {
            goldEarned: Number(player.goldEarned ?? 0),
            goldSpent: Number(player.goldspent ?? 0),
            totalGold: Number(player.totalGold),
            levels: {
              attack: player.attackLevel,
              energy: player.energyLevel,
              recovery: player.recoveryLevel,
            },
          },
          lastActions: {
            upgradeType: player.upgrade_type,
            actionType: player.action_type,
          },
        },
        boss: {
          id: playerBossState ? playerBossState.bossId : 1,
          currentHealth: playerBossState ? playerBossState.currentHealth : 100,
          baseHealth: playerBossState ? playerBossState.baseHealth : 100,
          isDefeated: playerBossState ? playerBossState.isDefeated : false,
          isActive: playerBossState ? !playerBossState.isDefeated : true,
          level: playerBossState ? playerBossState.id : 1,
        },
        isInitializationRequired: !isInitialized,
        lastUpdated: player.lastUpdated,
      },
    };
    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
