"use client";

import { useState, useEffect } from "react";
import BattleVictory from "@/components/battle/victory";
import BottomBar from "@/components/bottom-bar";
import GameBossName from "@/components/game-boss-name";
import Hero1 from "@/components/heroes/hero-1";
import Lifebar from "@/components/lifebar";
import { PageGame } from "@/components/page-game";
import Spell from "@/components/spell";
import Stats from "@/components/stats";
import TopBar from "@/components/top-bar";
import useGame from "@/hooks/use-game";
import { GameState } from "@/types/game";
import { cloudStorage } from "@telegram-apps/sdk-react";

import BossImage from "./boss-animation";
import InteractiveZone from "./interactive-zone";
import Loader from "./loader";

const loadingMessages = {
  LOADING_INITIAL_DATA: "Loading game data...",
  SPAWNING_PLAYER: "Creating your character...",
  LOADING_PLAYER_DATA: "Loading player data...",
  READY: "Ready!",
};

const GAME_END = "GAME_END";

export default function Game(): JSX.Element {
  const {
    gameState,
    isLoading,
    isServiceWorking,
    handleAttack,
    boss,
    player,
    initializationStep,
  } = useGame();

  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    void (async () => {
      const cloudKey = await cloudStorage.getItem(GAME_END);
      if (cloudKey === "1") {
        setIsClosed(true);
      }
      try {
        if (boss?.currentHealth && boss.currentHealth <= 0) {
          await cloudStorage.setItem(GAME_END, "1");
          console.log('Boss defeated! Health dropped to:', boss.currentHealth);
        }
      } catch (error) {
        console.error('Failed to save game end state:', error);
      }
    })();
  }, [boss?.currentHealth]);

  const handleBossAttack = async (): Promise<void> => {
    handleAttack();
    if (!isAnimating) {
      setIsAnimating(true);
      setIsRotating(true);
      setTimeout(() => {
        setIsRotating(false);
        setIsAnimating(false);
      }, 300);
    }
    return Promise.resolve();
  };

  if (!isServiceWorking) {
    return (
      <div className="text-status-error">Service is currently unavailable</div>
    );
  }

  if (isLoading || !boss || !player || gameState !== GameState.INITIALIZED) {
    return <Loader message={loadingMessages[initializationStep]} />;
  }

  return (
    <PageGame>
      <TopBar gold={player.gold ?? 0} level={boss.level} />
      {boss.currentHealth && boss.currentHealth <= 0 || isClosed ? (
        <div className="bottom-0 absolute w-full z-[100] overflow-hidden rounded">
          <BattleVictory />
        </div>
      ) : (
        <div
          className="flex min-h-screen flex-col bg-cover bg-center bg-no-repeat pb-[100px] pt-[126px]"
          style={{ backgroundImage: "url('/images/background-scene.jpg')" }}
        >
          <div className="relative">
            <GameBossName name={boss.name} />
            <Lifebar
              max={boss.baseHealth ?? 1000}
              value={boss.currentHealth ?? 0}
            />
          </div>
          <div className="grow">
            <InteractiveZone
              playerDamage={player.damage}
              className="mt-8 h-[300px] w-full"
              onInteraction={handleBossAttack}
            >
              <BossImage
                isRotating={isRotating}
                isAnimating={isAnimating}
                width={200}
                height={200}
              />
            </InteractiveZone>
          </div>
          <div className="flex h-[100px] w-full items-center gap-2">
            <Hero1 className="-mt-[50px]" />
            <Stats />
            <Spell className="-mt-[20px] opacity-30" />
          </div>
        </div>
      )}
      <BottomBar />
    </PageGame>
  );
}