"use client";

import Link from "next/link";
import { cloudStorage } from "@telegram-apps/sdk-react";

import { Button } from "../ui/button";

const PK_KEY = "pk";

function ClearStorageButton() {
  const clearStorage = async () => {
    await cloudStorage.deleteItem(PK_KEY);
    console.log("CloudStorage cleared");
  };

  return (
    <div className="absolute left-0 top-0 z-20 flex h-10 w-full p-4">
      <Link href="/debug">Debug</Link>
      <Button onClick={clearStorage}>Clear CloudStorage</Button>
    </div>
  );
}

export default ClearStorageButton;
