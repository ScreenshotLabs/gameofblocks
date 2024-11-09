"use client";

export default function GameBossName({
  name = "Unnamed Boss",
}: {
  name: string;
}) {
  return (
    <div className="text-game-text-bright mb-4 text-center font-bold">
      {name}
    </div>
  );
}
