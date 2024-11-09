import AirdropButtons from "@/components/airdrop/airdrop-buttons";
import GameFooter from "@/components/game-footer";
import GameHeader from "@/components/game-header";
import { Page } from "@/components/page";
import { PageTitle } from "@/components/page-title";

export default function AirdropPage() {
  return (
    <Page back>
      <GameHeader />
      <PageTitle>Airdrop</PageTitle>
      <div className="my-6 text-center leading-5">
        Create a wallet or connect an existing one
        <br />
        to claim your airdrop!
      </div>
      <div className="flex flex-col items-center">
        <AirdropButtons />
      </div>
      <GameFooter />
    </Page>
  );
}
