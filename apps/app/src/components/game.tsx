"use client";

import useGame from "@/hooks/use-game";
import { GameState } from "@/types/game";

import GameFooter from "./game-footer";
import GameHeader from "./game-header";
import InteractiveZone from "./interactive-zone";
import Lifebar from "./lifebar";
import Loader from "./loader";
import TopBar from "./top-bar";

export default function Game() {
  const { gameState, isServiceWorking, handleAttack, boss, player } = useGame();

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
          {boss.name}
        </div>
        <div className="flex justify-center">
          <Lifebar
            max={boss.baseHealth ?? 1000}
            value={boss.currentHealth ?? 0}
          />
        </div>
        <InteractiveZone
          playerDamage={player.damage}
          className="h-[400px] border-2 border-white"
          onInteraction={handleAttack}
        />
        <GameFooter />
      </div>
    </div>
  );
}
