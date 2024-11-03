"use client";

import { useState } from "react";
import useAccount from "@/hooks/useAccount";
import { useGaslessService } from "@/hooks/useGaslessService";

import GameHeader from "./GameHeader";
import InteractiveZone from "./InteractiveZone";
import TopBar from "./TopBar";

export default function Game() {
  const [life, setLife] = useState<number>(1000);
  const { account, privateKey, publicKey } = useAccount();
  const { isServiceWorking } = useGaslessService({
    address: account?.address,
    publicKey,
    privateKey,
  });

  const handleAttack = () => {
    setLife((prevValue) => prevValue - 1);
    /*   startTransition(async () => {
      try {
        await incrementScore();
      } catch (error) {
        console.error("Failed to increment score:", error);
      }
    }); */
  };

  if (!isServiceWorking) {
    return <div className="text-red-500">Service is currently unavailable</div>;
  }

  return (
    <div className="h-full bg-[#0A132A]">
      <TopBar />
      <GameHeader />
      <div className="px-14 py-10 text-[#DAE6FF]">
        <div className="mb-2 text-center font-bold">TEST</div>
        <InteractiveZone
          className="h-[400px] bg-red-500"
          onInteraction={handleAttack}
        >
          {life} / 1000
        </InteractiveZone>
      </div>
    </div>
  );
}
