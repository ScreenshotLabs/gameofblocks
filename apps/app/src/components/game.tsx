"use client";

import type { PlayResult } from "@/types/api";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import GameFooter from "./game-footer";
import GameHeader from "./game-header";
import InteractiveZone from "./interactive-zone";
import Lifebar from "./lifebar";
import TopBar from "./top-bar";

const MONSTER_LIFE = 1000;
const MONTER_NAME = "PEPE THE MAGNIFICENT";

interface Monster {
  id: number;
  life: number;
}

export default function Game() {
  const [initialized, setInitialized] = useState(false);
  const [life, setLife] = useState<number | undefined>();

  /* const { account, privateKey, publicKey } = useAccount(); */
  /*   const { isServiceWorking } = useGaslessService({
    address: account?.address,
    publicKey,
    privateKey,
  }); */

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["game-data"],
    queryFn: async () => {
      const response = await fetch("/api/game-data", {
        method: "GET",
        headers: {
          // TODO
          // Authorization: `tma ${launchParams.initDataRaw}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not ok (status=${response.status})`,
        );
      }

      const data = (await response.json()) as PlayResult;
      return data;
    },
    refetchInterval: 1000,
    enabled: !initialized || (life !== undefined && life <= 0),
  });

  useEffect(() => {
    if (data) {
      setLife(data.monster.life);
      if (!initialized) {
        setInitialized(true);
      }
    }
  }, [data]);

  console.log("=> data", data);

  const handleAttack = () => {
    setLife((prevValue) => (prevValue ?? 0) - 1);
  };

  /*
    if (!isServiceWorking) {
    return (
      <div className="text-status-error">Service is currently unavailable</div>
    );
  }
  */

  if (!initialized) {
    return <div>Loading...</div>;
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
