import type { GameDataResult } from "@/types/api";
import { useEffect, useState } from "react";
import { BOSSES } from "@/core/constants";
import { GameState } from "@/types/game";
import { useQuery } from "@tanstack/react-query";

import { useGaslessService } from "./use-gasless-service";
import useAccount from "./useAccount";

export default function useGame() {
  const { account, privateKey, publicKey } = useAccount();
  const { isServiceWorking, spawnPlayer, playerAttack } = useGaslessService({
    address: account?.address,
    publicKey,
    privateKey,
  });

  const [gameState, setGameState] = useState<GameState>(GameState.LAUNCHED);
  const [baseHealth, setBaseHealth] = useState<number | undefined>();
  const [currentHealth, setCurrentHealth] = useState<number | undefined>();

  const queryIsEnabled =
    !!account &&
    ([GameState.LAUNCHED, GameState.INITIALIZING].includes(gameState) ||
      (currentHealth !== undefined && currentHealth <= 0));

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["game-data"],
    queryFn: async () => {
      const response = await fetch(
        `/api/game-data?address=${account?.address}`,
        {
          method: "GET",
          headers: {
            // TODO
            // Authorization: `tma ${launchParams.initDataRaw}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Network response was not ok (status=${response.status})`,
        );
      }

      const data = (await response.json()) as GameDataResult;
      return data;
    },
    refetchInterval: 1000,
    enabled: queryIsEnabled,
  });

  const handleAttack = async () => {
    setCurrentHealth(
      (prevValue) => (prevValue ?? 0) - (data?.player.attack ?? 1),
    );
    try {
      await playerAttack();
    } catch (error) {
      console.error("Attack failed:", error);
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
        // setGameState(GameState.INITIALIZED);
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
          setCurrentHealth(Number(data.boss.currentHealth));
          setBaseHealth(Number(data.boss.baseHealth));
          setGameState(GameState.INITIALIZED);
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
          setCurrentHealth(Number(data.boss.currentHealth));
          setBaseHealth(Number(data.boss.baseHealth));
          setGameState(GameState.INITIALIZED);
        }
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const bossName = data && data.boss ? BOSSES[data.boss.id]?.name || "" : "";

  return {
    gameState,
    isServiceWorking,
    handleAttack,
    player: {
      damage: data?.player?.attack ?? 100,
    },
    boss: {
      name: bossName,
      baseHealth,
      currentHealth,
    },
  };
}
