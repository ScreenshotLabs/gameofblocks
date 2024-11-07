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
  const monsterId = Math.floor(Math.random() * 10) + 1;
  const monsterLife = Math.floor(Math.random() * (2000 - 1000)) + 1000;

  console.log("=> playerExists", playerExists);

  const result: GameDataResult = {
    isInitializationRequired: !playerExists,
    monster: {
      id: monsterId,
      life: monsterLife,
    },
  };

  return NextResponse.json(result, { status: 200 });
}
