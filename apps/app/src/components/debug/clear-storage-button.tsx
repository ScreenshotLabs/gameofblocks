import { cloudStorage } from "@telegram-apps/sdk-react";

import { Button } from "../ui/button";

const PK_KEY = "pk";

function ClearStorageButton() {
  const clearStorage = async () => {
    await cloudStorage.deleteItem(PK_KEY);
    console.log("CloudStorage cleared");
  };

  return <Button onClick={clearStorage}>Clear CloudStorage</Button>;
}

export default ClearStorageButton;
