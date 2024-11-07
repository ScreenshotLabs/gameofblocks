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

const MONSTER_LIFE = 1000;
const MONTER_NAME = "PEPE THE MAGNIFICENT";

interface Monster {
  id: number;
  life: number;
}

enum GameState {
  LAUNCHED,
  INITIALIZING,
  INITIALIZED,
  ERROR,
}

export default function Game() {
  const launchParams = retrieveLaunchParams();
  const [gameState, setGameState] = useState<GameState>(GameState.LAUNCHED);
  const [life, setLife] = useState<number | undefined>();

  const { account, privateKey, publicKey } = useAccount();
  const { isServiceWorking, spawnPlayer } = useGaslessService({
    address: account?.address,
    publicKey,
    privateKey,
  });

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
    enabled:
      !!account &&
      (gameState === GameState.LAUNCHED || (life !== undefined && life <= 0)),
  });

  useEffect(() => {
    if (gameState !== GameState.LAUNCHED) {
      return;
    }

    if (!data) {
      return;
    }

    if (!data.isInitializationRequired) {
      setGameState(GameState.INITIALIZED);
      return;
    }

    const initPlayer = async () => {
      setGameState(GameState.INITIALIZING);
      try {
        await spawnPlayer();
        setGameState(GameState.INITIALIZED);
      } catch (error: any) {
        console.error(error);
        setGameState(GameState.ERROR);
      }
    };

    void initPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleAttack = () => {
    setLife((prevValue) => (prevValue ?? 0) - 1);
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
          <Lifebar max={MONSTER_LIFE} value={life ?? 0} />
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
