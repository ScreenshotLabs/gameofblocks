"use client";

import { useState } from "react";
import useAccount from "@/hooks/useAccount";
import { useGaslessService } from "@/hooks/useGaslessService";

import GameFooter from "./GameFooter";
import GameHeader from "./GameHeader";
import InteractiveZone from "./InteractiveZone";
import Lifebar from "./Lifebar";
import TopBar from "./TopBar";

const MONSTER_LIFE = 1000;
const MONTER_NAME = "PEPE THE MAGNIFICENT";

export default function Game() {
  const [life, setLife] = useState<number>(MONSTER_LIFE);
  const { account, privateKey, publicKey } = useAccount();
  const { isServiceWorking } = useGaslessService({
    address: account?.address,
    publicKey,
    privateKey,
  });

  const handleAttack = () => {
    setLife((prevValue) => prevValue - 1);
  };

  if (!isServiceWorking) {
    return (
      <div className="text-status-error">Service is currently unavailable</div>
    );
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
          <Lifebar max={MONSTER_LIFE} value={life} />
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
