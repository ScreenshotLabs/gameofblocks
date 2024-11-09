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
  const [baseBossHealth, setBaseBossHealth] = useState<number | undefined>();
  const [playerGold, setPlayerGold] = useState<number | undefined>();
  const [currentBossHealth, setCurrentBossHealth] = useState<number | undefined>();

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
    enabled: !!account
  });

  const handleAttack = () => {
    try {
      setCurrentBossHealth(
        (prevValue) => (prevValue ?? 0) - (data?.player?.attack ?? 1),
      );
      void playerAttack().catch(error => {
        console.error("Attack failed:", error);
        setCurrentBossHealth(prevValue => (prevValue ?? 0) + (data?.player?.attack ?? 1));
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    if (!data) {
      console.log("No data available for initialization.");
      return;
    }

    const initPlayer = async () => {
      setGameState(GameState.INITIALIZING);
      console.log("Attempting to initialize player...");
      try {
        await spawnPlayer();
        console.log("Player initialization successful.");

        // TODO: maybe replace it by an api-call
        setBaseBossHealth(5000);
        setCurrentBossHealth(5000);

        setGameState(GameState.INITIALIZED);
      } catch (error) {
        console.error("Error during player initialization:", error);
        setGameState(GameState.ERROR);
      }
    };

    switch (gameState) {
      case GameState.INITIALIZED:
      case GameState.ERROR:
        console.log(
          `Game state is already ${GameState[gameState]}, skipping initialization.`,
        );
        return;

      case GameState.INITIALIZING:
        console.log(
          "Current game state is INITIALIZING, processing data:",
          data,
        );
        if (!data.isInitializationRequired) {
          console.log("Initialization not required, setting health and state.");
          setCurrentBossHealth(Number(data.boss?.currentHealth ?? 10000));
          setBaseBossHealth(Number(data.boss?.baseHealth ?? 10000));
          setGameState(GameState.INITIALIZED);
          setPlayerGold(Number(data.player?.gold ?? 0));
        }

        break;

      case GameState.LAUNCHED:
        console.log(
          "Current game state is LAUNCHED, checking initialization requirement.",
        );
        if (data.isInitializationRequired) {
          console.log(
            "Initialization required, starting initialization process.",
          );
          void initPlayer();
        } else {
          console.log(
            "Initialization not required, setting health and state directly.",
          );
          setCurrentBossHealth(Number(data.boss?.currentHealth ?? 10000));
          setBaseBossHealth(Number(data.boss?.baseHealth ?? 10000));
          setGameState(GameState.INITIALIZED);
        }
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      gold: playerGold,
    },
    boss: data?.boss && {
      name: data.boss.id ? BOSSES[data.boss.id].name : "",
      baseHealth: baseBossHealth,
      currentHealth: currentBossHealth,
      isDefeated: data.boss.isDefeated,
      level: data.boss.id,
    },
  };
}