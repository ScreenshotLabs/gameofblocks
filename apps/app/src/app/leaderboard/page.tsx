import GameFooter from "@/components/game-footer";
import GameHeader from "@/components/game-header";
import { Page } from "@/components/page";
import { PageTitle } from "@/components/page-title";

import Leaderboard from "./components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <Page back>
      <GameHeader />
      <PageTitle>Leaderboard</PageTitle>
      <Leaderboard />
      <GameFooter />
    </Page>
  );
}
