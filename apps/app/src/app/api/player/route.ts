/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { bosses, db, playerBosses, players } from "@gameofblocks/database";

export const dynamic = "force-dynamic";

// Type Definitions
interface PlayerBossData {
  currentHealth: number;
  isDefeated: boolean;
  lastUpdated: Date;
}

interface BossData {
  id: string;
  baseHealth: number;
  isActive: boolean;
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
  bossId: string,
): Promise<PlayerBossData | null> {
  const playerBossData = await db
    .select({
      currentHealth: playerBosses.currentHealth,
      isDefeated: playerBosses.isDefeated,
      lastUpdated: playerBosses.lastUpdated,
    })
    .from(playerBosses)
    .where(
      and(eq(playerBosses.playerId, playerId), eq(playerBosses.bossId, bossId)),
    )
    .orderBy(desc(playerBosses.lastUpdated))
    .limit(1);

  return playerBossData.length > 0 ? playerBossData[0] : null;
}

async function getCurrentBoss(bossId: string): Promise<BossData | null> {
  const bossData = await db
    .select({
      id: bosses.id,
      baseHealth: bosses.baseHealth,
      isActive: bosses.isActive,
    })
    .from(bosses)
    .where(eq(bosses.id, bossId))
    .limit(1);

  return bossData.length > 0 ? bossData[0] : null;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const contractAddress = searchParams.get("contractAddress");

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
    const bossId = player.currentBossId.toString();
    const currentBoss = await getCurrentBoss(bossId);
    const playerBossState = await getLatestPlayerBoss(
      normalizeAddress(contractAddress),
      bossId,
    );

    // Determine if player is initialized
    const isInitialized =
      player.attackPower > 0 &&
      player.energyCap > 0 &&
      player.energyRecovery > 0;

    const response = {
      status: "success",
      data: {
        player: {
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
        boss: currentBoss
          ? {
              id: currentBoss.id,
              currentHealth:
                playerBossState?.currentHealth ?? currentBoss.baseHealth,
              baseHealth: currentBoss.baseHealth,
              isDefeated: playerBossState?.isDefeated ?? false,
              isActive: currentBoss.isActive,
              level: currentBoss.id,
            }
          : null,
        isInitializationRequired: !isInitialized,
        lastUpdated: player.lastUpdated,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
