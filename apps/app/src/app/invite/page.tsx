import GameFooter from "@/components/game-footer";
import GameHeader from "@/components/game-header";
import InviteButton from "@/components/invite/invite-button";
import InviteImage from "@/components/invite/invite-image";
import { Page } from "@/components/page";
import { PageTitle } from "@/components/page-title";

export default function InvitePage() {
  return (
    <Page back>
      <GameHeader />
      <PageTitle>Invite</PageTitle>
      <div className="flex min-h-fit flex-col">
        <div className="grow py-4">
          <InviteImage />
        </div>
        <InviteButton />
      </div>
      <GameFooter />
    </Page>
  );
}
