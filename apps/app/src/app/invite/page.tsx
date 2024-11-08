import GameFooter from "@/components/game-footer";
import GameHeader from "@/components/game-header";
import { Page } from "@/components/page";
import { PageTitle } from "@/components/page-title";

export default function InvitePage() {
  return (
    <Page back>
      <GameHeader />
      <PageTitle>Invite</PageTitle>
      <div className="flex h-full flex-col items-center justify-center">
        <p>Invite your friends to play the game!</p>
      </div>
      <GameFooter />
    </Page>
  );
}
