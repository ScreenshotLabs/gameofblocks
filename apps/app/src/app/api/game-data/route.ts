import type { GameDataResult } from "@/types/api";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CONTRACT_ADDRESS } from "@/core/constants";
import { Contract, RpcProvider } from "starknet";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  console.log("=> checking account...", address);

  const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io",
  });

  const { abi } = await provider.getClassAt(CONTRACT_ADDRESS);
  const contract = new Contract(abi, CONTRACT_ADDRESS, provider);

  const playerExists = (await contract.get_player_exists(address)) as boolean;

  if (!playerExists) {
    return NextResponse.json(
      {
        isInitializationRequired: true,
      },
      { status: 200 },
    );
  }

  const rawPlayerStats = (await contract.get_player_stats(address)) as string[];
  const attack = BigInt(rawPlayerStats[0]);
  const energyCap = BigInt(rawPlayerStats[1]);
  const recovery = BigInt(rawPlayerStats[2]);

  const bossIdStr = (await contract.get_player_current_boss(address)) as string;
  const bossId = BigInt(bossIdStr);
  const rawBossInfo = (await contract.get_boss_info(bossIdStr)) as string[];

  console.log("=> rawBossInfo", rawBossInfo);

  const baseHealth = BigInt(rawBossInfo[0]);
  // const isActive: boolean = rawBossInfo[1];

  const rawPlayerBossState = (await contract.get_player_boss_state(
    address,
    bossIdStr,
  )) as string[];

  const currentHealth = BigInt(rawPlayerBossState[0]);
  const isDefeated = Boolean(rawPlayerBossState[1]);

  const result: GameDataResult = {
    isInitializationRequired: !playerExists,
    player: {
      attack: attack.toString(),
      energyCap: energyCap.toString(),
      recovery: recovery.toString(),
    },
    boss: {
      id: bossId.toString(),
      currentHealth: currentHealth.toString(),
      isDefeated,
      baseHealth: baseHealth.toString(),
    },
  };

  return NextResponse.json(result, { status: 200 });
}
