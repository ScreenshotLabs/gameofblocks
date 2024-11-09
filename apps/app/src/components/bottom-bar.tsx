import Link from "next/link";

import AirdropIcon from "./airdrop-icon";
import GameFooterBorderless from "./game-footer-borderless";
import InviteIcon from "./invite-icon";
import PremiumIcon from "./premium-icon";
import ShopIcon from "./shop-icon";
import TopIcon from "./top-icon";

export default function BottomBar() {
  return (
    <div className="absolute bottom-0 left-0 z-50 w-full">
      <GameFooterBorderless className="relative" />
      <div className="flex h-[90px] items-center justify-between gap-2 bg-[#0B1938] px-2">
        {/* shop */}
        <Link
          href="/shop"
          className="flex h-[55px] w-[68px] flex-col items-center rounded-[10px] bg-[#0A132A] p-1"
        >
          <ShopIcon />
          <div className="text-center text-xs font-semibold">Shop</div>
        </Link>
        {/* invite */}
        <Link
          href="/invite"
          className="flex h-[55px] w-[68px] flex-col items-center rounded-[10px] bg-[#0A132A] p-1"
        >
          <InviteIcon />
          <div className="text-center text-xs font-semibold">Invite</div>
        </Link>
        {/* premium */}
        <Link href="/premium" className="-mt-2">
          <PremiumIcon />
        </Link>
        {/* top */}
        <Link
          href="/top"
          className="flex h-[55px] w-[68px] flex-col items-center rounded-[10px] bg-[#0A132A] p-1"
        >
          <TopIcon />
          <div className="text-center text-xs font-semibold">Top</div>
        </Link>
        {/* top */}
        <Link
          href="/airdrop"
          className="flex h-[55px] w-[68px] flex-col items-center rounded-[10px] bg-[#0A132A] p-1"
        >
          <AirdropIcon />
          <div className="text-center text-xs font-semibold">Airdrop</div>
        </Link>
      </div>
    </div>
  );
}
