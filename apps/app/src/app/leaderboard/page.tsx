import GameHeader from "@/components/game-header";
import { Page } from "@/components/Page";

import Leaderboard from "./components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <Page>
      <div>
        <GameHeader />
        <div className="text-game-text flex flex-col gap-4 px-14 py-10">
          <div className="text-game-text-bright mb-2 text-center font-bold">
            Leaderboard
          </div>
        </div>
        <Leaderboard />
      </div>
    </Page>
  );
}
