/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, players } from "@gameofblocks/database";

export const dynamic = "force-dynamic";

export function normalizeAddress(address: string): string {
  const cleanAddress = address.toLowerCase().replace('0x', '');
  if (!/^[0-9a-f]+$/.test(cleanAddress)) {
    throw new Error('Address contains invalid characters');
  }
  if (cleanAddress.length !== 63 && cleanAddress.length !== 64) {
    throw new Error('Invalid address length');
  }
  const paddedAddress = cleanAddress.length === 63
    ? '0' + cleanAddress
    : cleanAddress;
  return `0x${paddedAddress}`;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const contractAddress = searchParams.get("contractAddress");

    if (!contractAddress) {
      return NextResponse.json(
        { error: "Contract address is required" },
        { status: 400 }
      );
    }


    // Type assertion to string
    const playerData = await db
      .select()
      .from(players)
      .where(eq(players.contractAddress, normalizeAddress(contractAddress)))
      .orderBy(desc(players._cursor))
      .limit(1);

    if (!playerData.length) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      );
    }

    const player = playerData[0];
    const response = {
      id: player.id,
      contractAddress: player.contractAddress,
      lastUpdated: player.lastUpdated,
      stats: {
        attackPower: player.attackPower,
        energyCap: player.energyCap,
        energyRecovery: player.energyRecovery,
        currentBossId: player.currentBossId,
      },
      economy: {
        goldEarned: player.goldEarned,
        goldSpent: player.goldspent,
        totalGold: player.totalGold,
        levels: {
          attack: player.attackLevel,
          energy: player.energyLevel,
          recovery: player.recoveryLevel,
        }
      },
      actions: {
        upgradeType: player.upgrade_type,
        actionType: player.action_type,
      }
    };

    return NextResponse.json({
      status: "success",
      data: response
    });

  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}