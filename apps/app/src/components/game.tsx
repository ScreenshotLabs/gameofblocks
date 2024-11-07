"use client";

import type { GameDataResult } from "@/types/api";
import { useEffect, useState } from "react";
import useAccount from "@/hooks/useAccount";
import { useGaslessService } from "@/hooks/useGaslessService";
import { useQuery } from "@tanstack/react-query";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

import GameFooter from "./game-footer";
import GameHeader from "./game-header";
import InteractiveZone from "./interactive-zone";
import Lifebar from "./lifebar";
import Loader from "./loader";
import TopBar from "./top-bar";

const MONTER_NAME = "PEPE THE MAGNIFICENT";

enum GameState {
  LAUNCHED,
  INITIALIZING,
  INITIALIZED,
  ERROR,
}

export default function Game() {
  // const launchParams = retrieveLaunchParams();
  const [gameState, setGameState] = useState<GameState>(GameState.LAUNCHED);
  const [baseHealth, setBaseHealth] = useState<number | undefined>();
  const [currentHealth, setCurrentHealth] = useState<number | undefined>();

  const { account, privateKey, publicKey } = useAccount();
  const { isServiceWorking, spawnPlayer } = useGaslessService({
    address: account?.address,
    publicKey,
    privateKey,
  });

  const queryIsEnabled =
    !!account &&
    ([GameState.LAUNCHED, GameState.INITIALIZING].includes(gameState) ||
      (currentHealth !== undefined && currentHealth <= 0));

  console.log("=> queryIsEnabled", queryIsEnabled, GameState[gameState]);

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

  useEffect(() => {
    if (!data) {
      return;
    }

    const initPlayer = async () => {
      setGameState(GameState.INITIALIZING);
      try {
        await spawnPlayer();
        // setGameState(GameState.INITIALIZED);
      } catch (error: any) {
        console.error(error);
        setGameState(GameState.ERROR);
      }
    };

    switch (gameState) {
      case GameState.INITIALIZED:
      case GameState.ERROR:
        return;

      case GameState.INITIALIZING:
        console.log("=> data", data);
        if (!data.isInitializationRequired) {
          console.log("=> initialized data", data);
          setCurrentHealth(Number(data.boss.currentHealth));
          setBaseHealth(Number(data.boss.baseHealth));
          setGameState(GameState.INITIALIZED);
        }

        break;

      case GameState.LAUNCHED:
        void initPlayer();
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleAttack = () => {
    setCurrentHealth((prevValue) => (prevValue ?? 0) - 1);
  };

  if (!isServiceWorking) {
    return (
      <div className="text-status-error">Service is currently unavailable</div>
    );
  }

  if (gameState !== GameState.INITIALIZED) {
    return <Loader />;
  }

  return (
    <div className="bg-game-background h-full">
      <TopBar />
      <GameHeader />
      <div className="text-game-text flex flex-col gap-4 px-14 py-10">
        <div className="text-game-text-bright mb-2 text-center font-bold">
          {MONTER_NAME}
        </div>
        <div className="flex justify-center">
          <Lifebar max={baseHealth ?? 1000} value={currentHealth ?? 0} />
        </div>
        <InteractiveZone
          className="h-[400px] border-2 border-white"
          onInteraction={handleAttack}
        />
        <GameFooter />
      </div>
    </div>
  );
}
