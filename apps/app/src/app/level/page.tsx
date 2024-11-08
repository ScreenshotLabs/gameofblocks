import GameFooter from "@/components/game-footer";
import GameHeader from "@/components/game-header";
import { Page } from "@/components/page";
import { PageTitle } from "@/components/page-title";

export default function LevelPage() {
  const level = 1;
  return (
    <Page back>
      <GameHeader />
      <PageTitle>Level {level}</PageTitle>
      <div className="flex h-full flex-col items-center justify-center">
        <p>Shop devastative special ability + 500,000G!</p>
      </div>
      <GameFooter />
    </Page>
  );
}
