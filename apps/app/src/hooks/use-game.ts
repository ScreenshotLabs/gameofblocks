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

  const { data } = useQuery({
    queryKey: ["game-data"],
    queryFn: async () => {
      const response = await fetch(
        `/api/game-data?address=${account?.address}`,
        {
          method: "GET",
          // headers: {
          // TODO
          // Authorization: `tma ${launchParams.initDataRaw}`,
          // },
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
    refetchInterval: 100,
    enabled: queryIsEnabled,
  });

  const handleAttack = () => {
    setCurrentHealth(
      (prevValue) => (prevValue ?? 0) - (data?.player?.attack ?? 1),
    );
    try {
      // Update health immediately for UI feedback
      setCurrentHealth(
        (prevValue) => (prevValue ?? 0) - (data?.player?.attack ?? 1),
      );

      // Start the playerAttack but don't wait for it
      // This will allow the animation to complete independently
      void playerAttack().catch(error => {
        console.error("Attack failed:", error);
        // Optionally rollback the health change if attack fails
        setCurrentHealth(prevValue => (prevValue ?? 0) + (data?.player?.attack ?? 1));
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
        setBaseHealth(5000);
        setCurrentHealth(5000);

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
          setCurrentHealth(Number(data.boss?.currentHealth ?? 10000));
          setBaseHealth(Number(data.boss?.baseHealth ?? 10000));
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
          setCurrentHealth(Number(data.boss?.currentHealth ?? 10000));
          setBaseHealth(Number(data.boss?.baseHealth ?? 10000));
          setGameState(GameState.INITIALIZED);
        }
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const bossName = data?.boss?.id ? BOSSES[data.boss.id].name || "" : "";

  return {
    gameState,
    isServiceWorking,
    handleAttack,
    player: {
      damage: data?.player?.attack ?? 1,
    },
    boss: {
      name: bossName,
      baseHealth,
      currentHealth,
    },
    gold: data?.gold ?? 0,
    level: data?.level ?? 1,
  };
}
