import type { GameDataResult } from "@/types/api";
import { useEffect, useState } from "react";
import { BOSSES } from "@/core/constants";
import { GameState } from "@/types/game";
import { useQuery } from "@tanstack/react-query";

import { useGaslessService } from "./use-gasless-service";
import useAccount from "./useAccount";

// Define the API response type
interface ApiResponse {
  status: 'success';
  data: GameDataResult;
}

export default function useGame() {
  const { account, privateKey, publicKey } = useAccount();
  const { isServiceWorking, spawnPlayer, playerAttack } = useGaslessService({
    address: account?.address,
    publicKey,
    privateKey,
  });

  const [gameState, setGameState] = useState<GameState>(GameState.LAUNCHED);

  const { data, error, isLoading } = useQuery({
    queryKey: ["game-data", account?.address],
    queryFn: async () => {
      if (!account?.address) throw new Error("No account address");

      const response = await fetch(
        `/api/player?contractAddress=${account.address}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok (status=${response.status})`);
      }

      const result = await response.json() as ApiResponse;
      return result.data;
    },
    refetchInterval: 1000, // Polling every second
    enabled: !!account
  });

  const handleAttack = async () => {
    if (!data?.boss || data.boss.isDefeated) return;

    try {
      await playerAttack();
    } catch (error) {
      console.error("Attack failed:", error);
    }
  };

  useEffect(() => {
    if (!data) return;

    const initPlayer = async () => {
      setGameState(GameState.INITIALIZING);
      try {
        await spawnPlayer();
        setGameState(GameState.INITIALIZED);
      } catch (error) {
        console.error("Error during player initialization:", error);
        setGameState(GameState.ERROR);
      }
    };

    switch (gameState) {
      case GameState.LAUNCHED:
        if (data.isInitializationRequired) {
          void initPlayer();
        } else {
          setGameState(GameState.INITIALIZED);
        }
        break;

      case GameState.INITIALIZING:
        if (!data.isInitializationRequired) {
          setGameState(GameState.INITIALIZED);
        }
        break;

      // Do nothing for other states
      case GameState.INITIALIZED:
      case GameState.ERROR:
        break;
    }
  }, [data, gameState, spawnPlayer]);

  return {
    gameState,
    isLoading,
    error,
    isServiceWorking,
    handleAttack,
    player: data?.player && {
      damage: data.player.attack,
      energyCap: Number(data.player.energyCap),
      recovery: Number(data.player.recovery),
      gold: data.player.gold,
    },
    boss: data?.boss && {
      name: data.boss.id ? BOSSES[data.boss.id].name : "",
      baseHealth: Number(data.boss.baseHealth),
      currentHealth: Number(data.boss.currentHealth),
      isDefeated: data.boss.isDefeated,
      level: data.boss.level,
    },
  };
}