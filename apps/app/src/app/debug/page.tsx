"use client";

import Link from "next/link";
import { VictorySheet } from "@/components/battle/victory-sheet";
import { Page } from "@/components/page";
import PaymentButton from "@/components/payment-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useAccount from "@/hooks/useAccount";

function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">Sheeit</div>
      </SheetContent>
    </Sheet>
  );
}

export default function DebugPage() {
  const { account, publicKey } = useAccount();

  return (
    <Page>
      <div className="flex flex-col gap-4 p-10 text-white">
        <div>
          <Link
            href={`https://sepolia.starkscan.co/contract/${account?.address}`}
          >
            Account address: {account?.address}
          </Link>
        </div>
        <div>Public key: {publicKey}</div>
        <PaymentButton />
        <Link href="/shop">Shop</Link>
        <Link href="/invite">Invite</Link>
        <Link href="/premium">Premium</Link>
        <Link href="/top">Top</Link>
        <Link href="/airdrop">Airdrop</Link>
        <Link href="/level">Level</Link>
        <Link href="/test/victory">Victory</Link>
        <VictorySheet />
      </div>
    </Page>
  );
}
