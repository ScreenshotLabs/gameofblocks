"use client";

import { cloudStorage } from "@telegram-apps/sdk-react";

import { Button } from "../ui/button";

const PK_KEY = "pk";

function ClearStorageButton() {
  const clearStorage = async () => {
    await cloudStorage.deleteItem(PK_KEY);
    console.log("CloudStorage cleared");
  };

  return (
    <div className="absolute bottom-0 left-0 z-20 h-10 w-full p-4">
      <Button onClick={clearStorage}>Clear CloudStorage</Button>
    </div>
  );
}

export default ClearStorageButton;
