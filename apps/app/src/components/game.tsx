"use client";

import { useState } from "react";
import useGame from "@/hooks/use-game";
import { GameState } from "@/types/game";

import BossImage from "./boss-animation";
import GameFooter from "./game-footer";
import InteractiveZone from "./interactive-zone";
import Lifebar from "./lifebar";
import Loader from "./loader";
import TopBar from "./top-bar";

export default function Game(): JSX.Element {
  const { gameState, isServiceWorking, handleAttack, boss, player } = useGame();
  console.log("boss", boss);
  console.log("player", player);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleBossAttack = async (): Promise<void> => {
    console.log("handleBossAttack");
    console.log("isAnimating", isAnimating);
    if (!isAnimating) {
      setIsAnimating(true);
      setIsRotating(true);
      setTimeout(() => {
        setIsRotating(false);
        setIsAnimating(false);
      }, 300);
      handleAttack();
    }
    return Promise.resolve();
  };

  if (!boss || !player) {
    return null;
  }

  if (!isServiceWorking) {
    return (
      <div className="text-status-error">Service is currently unavailable</div>
    );
  }

  if (gameState !== GameState.INITIALIZED) {
    return <Loader />;
  }

  return (
    <>
      <TopBar />
      <div className="text-game-text flex flex-col gap-4 px-14 py-10">
        <div className="text-game-text-bright mb-2 text-center font-bold">
          {boss?.name}
        </div>
        <div className="flex justify-center">
          <Lifebar
            max={boss?.baseHealth ?? 1000}
            value={boss?.currentHealth ?? 0}
          />
        </div>
        <InteractiveZone
          playerDamage={player?.damage ?? 1}
          className="h-[400px] w-full"
          onInteraction={handleBossAttack}
        >
          <BossImage
            isRotating={isRotating}
            isAnimating={isAnimating}
            width={300}
            height={300}
          />
        </InteractiveZone>
        <GameFooter />
      </div>
    </>
  );
}
