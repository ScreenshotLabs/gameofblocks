import GameFooter from "@/components/game-footer";
import GameHeader from "@/components/game-header";
import LevelBossImage from "@/components/level/level-boss-image";
import LevelBossLevels from "@/components/level/level-boss-levels";
import LevelBossStats from "@/components/level/level-boss-stats";
import LevelBossTItle from "@/components/level/level-boss-title";
import { Page } from "@/components/page";
import { PageTitle } from "@/components/page-title";

export default function LevelPage() {
  return (
    <Page back>
      <GameHeader />
      <PageTitle>Level 1</PageTitle>
      <LevelBossImage />
      <LevelBossTItle title="PEPE THE MAGNIFICIENT" />
      <LevelBossStats />
      <LevelBossLevels />
      <GameFooter />
    </Page>
  );
}
