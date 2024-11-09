import AirdropButtons from "@/components/airdrop/airdrop-buttons";
import AirdropImage from "@/components/airdrop/airdrop-image";
import GameFooter from "@/components/game-footer";
import GameHeader from "@/components/game-header";
import { Page } from "@/components/page";
import { PageTitle } from "@/components/page-title";

export default function AirdropPage() {
  return (
    <Page back>
      <GameHeader />
      <PageTitle>Airdrop</PageTitle>
      <div className="text-game-text my-6 mb-14 text-center leading-5">
        Create a wallet or connect an existing one
        <br />
        to claim your airdrop!
      </div>
      <AirdropImage />
      <div className="flex flex-col items-center">
        <AirdropButtons />
      </div>
      <GameFooter />
    </Page>
  );
}
