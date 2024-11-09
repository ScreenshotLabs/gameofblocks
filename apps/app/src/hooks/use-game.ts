import type { GameDataResult } from "@/types/api";
import { useEffect, useState } from "react";
import { BOSSES } from "@/core/constants";
import { GameState } from "@/types/game";
import { useQuery } from "@tanstack/react-query";

import { useGaslessService } from "./use-gasless-service";
import useAccount from "./useAccount";

interface ApiResponse {
  status: "success";
  data: GameDataResult;
}

export type InitializationStep =
  | "LOADING_INITIAL_DATA"
  | "SPAWNING_PLAYER"
  | "LOADING_PLAYER_DATA"
  | "READY";

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
  const [currentBossHealth, setCurrentBossHealth] = useState<
    number | undefined
  >();
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStep, setInitStep] = useState<InitializationStep>(
    "LOADING_INITIAL_DATA",
  );

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["game-data", account?.address],
    queryFn: async () => {
      if (!account?.address) throw new Error("No account address");

      const response = await fetch(
        `/api/player?contractAddress=${account.address}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Network response was not ok (status=${response.status})`,
        );
      }

      const result = (await response.json()) as ApiResponse;
      return result.data;
    },
    refetchInterval: isInitializing ? 100 : undefined,
    enabled: !!account,
  });

  const handleAttack = () => {
    try {
      setCurrentBossHealth(
        (prevValue) => (prevValue ?? 0) - (data?.player?.attack ?? 1),
      );
      setPlayerGold(
        (prevValue) => (prevValue ?? 0) + (data?.player?.attack ?? 1),
      );
      void playerAttack().catch((error) => {
        console.error("Attack failed:", error);
        setCurrentBossHealth(
          (prevValue) => (prevValue ?? 0) + (data?.player?.attack ?? 1),
        );
        setPlayerGold(
          (prevValue) => (prevValue ?? 0) - (data?.player?.attack ?? 1),
        );
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const initializePlayerData = () => {
    if (!data) return;

    setCurrentBossHealth(Number(data.boss?.currentHealth ?? 5000));
    setBaseBossHealth(Number(data.boss?.baseHealth ?? 5000));
    setPlayerGold(Number(data.player?.gold ?? 0));
    setGameState(GameState.INITIALIZED);
    setIsInitializing(false);
    setInitStep("READY");
  };

  useEffect(() => {
    const handleInitialization = async () => {
      console.log(data, error, isLoading);
      console.log("Handling initialization data...");
      console.log(data);
      if (!data) return;

      if (data.isInitializationRequired && !isInitializing) {
        setGameState(GameState.INITIALIZING);
        setIsInitializing(true);
        setInitStep("SPAWNING_PLAYER");

        try {
          await spawnPlayer();
          setInitStep("LOADING_PLAYER_DATA");
          await refetch();
        } catch (error) {
          console.error("Error during player initialization:", error);
          setGameState(GameState.ERROR);
          setIsInitializing(false);
        }
      } else if (!data.isInitializationRequired) {
        initializePlayerData();
      }
    };

    if (gameState === GameState.LAUNCHED || isInitializing) {
      void handleInitialization();
    }
  }, [data, gameState, isInitializing, spawnPlayer, refetch]);

  return {
    gameState,
    isLoading,
    error,
    isServiceWorking,
    handleAttack,
    initializationStep: initStep,
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
