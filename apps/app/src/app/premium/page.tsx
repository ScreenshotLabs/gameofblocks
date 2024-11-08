import GameFooter from "@/components/game-footer";
import GameHeader from "@/components/game-header";
import { Page } from "@/components/page";
import { PageTitle } from "@/components/page-title";

export default function PremiumPage() {
  return (
    <Page back>
      <GameHeader />
      <PageTitle>Premium</PageTitle>
      <div className="flex h-full flex-col items-center justify-center">
        <p>
          By buying a Premium account you unlock an upgradable hero with a
          devastative special ability + 500,000G!
        </p>
      </div>
      <GameFooter />
    </Page>
  );
}
