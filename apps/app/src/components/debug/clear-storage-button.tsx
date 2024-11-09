"use client";

// import Link from "next/link";
import { cloudStorage } from "@telegram-apps/sdk-react";

import { Button } from "../ui/button";

const PK_KEY = "pk";
const GAME_END = "GAME_END";

function ClearStorageButton() {
  const clearStorage = async () => {
    await cloudStorage.deleteItem(PK_KEY);
    await cloudStorage.deleteItem(GAME_END);
    console.log("CloudStorage cleared");
  };

  return (
    <div className="absolute left-0 top-0 z-20 flex h-10 w-full p-4">
      {/* <Link href="/debug">Debug</Link> */}
      <Button onClick={clearStorage}>Clear CloudStorage</Button>
    </div>
  );
}

export default ClearStorageButton;
