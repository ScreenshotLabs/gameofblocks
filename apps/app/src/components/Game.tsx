"use client";

import { useState } from "react";
import useAccount from "@/hooks/useAccount";
import { useGaslessService } from "@/hooks/useGaslessService";

import GameHeader from "./GameHeader";
import InteractiveZone from "./InteractiveZone";
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
    return <div className="text-red-500">Service is currently unavailable</div>;
  }

  return (
    <div className="h-full bg-[#0A132A]">
      <TopBar />
      <GameHeader />
      <div className="px-14 py-10 text-[#DAE6FF]">
        <div className="mb-2 text-center font-bold">{MONTER_NAME}</div>
        <div className="text-center">{`${life} / ${MONSTER_LIFE}`}</div>
        <InteractiveZone
          className="h-[400px] border-2 border-red-500"
          onInteraction={handleAttack}
        />
      </div>
    </div>
  );
}
