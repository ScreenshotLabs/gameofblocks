import Link from "next/link";
import GameFooter from "@/components/game-footer";
import GameHeader from "@/components/game-header";
import { Page } from "@/components/page";
import { PageTitle } from "@/components/page-title";
import PremiumBuy from "@/components/premium/premium-buy";
import PremiumImage from "@/components/premium/premium-image";

export default function AirdropPage() {
  return (
    <Page back>
      <GameHeader />
      <PageTitle>Premium</PageTitle>

      <div className="my-6 text-center leading-5">
        Buying a Premium account makes you eligible
        <br />
        for our upcoming{" "}
        <Link href="/airdrop" className="text-[#FFBA08]">
          airdrop
        </Link>
        !
      </div>

      <PremiumImage className="mx-auto" />

      <PremiumBuy />

      <GameFooter />
    </Page>
  );
}
