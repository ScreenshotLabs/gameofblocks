import { ensureDir, exists } from "https://deno.land/std@0.206.0/fs/mod.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.206.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.206.0/flags/mod.ts";
import { CallData, ec, hash, stark } from "https://esm.sh/starknet@6.11.0";

import { OZaccountClassHash } from "./constants.ts";

async function createNewAccounts(
  numberOfAccounts: number,
  network: string,
) {
  const currentDir = dirname(fromFileUrl(import.meta.url));
  const accountsFilePath = join(
    currentDir,
    ".",
    "accounts",
    `${network}.json`,
  );
  const accountsDir = join(currentDir, ".", "accounts");

  if (!await exists(accountsDir)) {
    await ensureDir(accountsDir);
  }

  console.log(
    `| Account                                                            | Private key                                                       | Public key`,
  );

  let existingAccounts = [];
  try {
    const fileData = await Deno.readTextFile(accountsFilePath);
    existingAccounts = JSON.parse(fileData);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      console.error("Error reading JSON file:", error);
      return;
    }
  }

  for (let i = 0; i < numberOfAccounts; i++) {
    const privateKey = stark.randomAddress();
    const publicKey = ec.starkCurve.getStarkKey(privateKey);

    const accountAddress = hash.calculateContractAddressFromHash(
      publicKey,
      OZaccountClassHash,
      CallData.compile({
        publicKey: publicKey,
      }),
      0,
    );

    existingAccounts = existingAccounts.concat({
      address: `0x${accountAddress.replace("0x", "").padStart(64, "0")}`,
      privateKey: privateKey,
      publicKey: publicKey,
      deployed: false,
    });

    console.log(
      `| 0x${
        accountAddress
          .replace("0x", "")
          .padStart(64, "0")
      } | ${privateKey} | ${publicKey}`,
    );
  }

  await Deno.writeTextFile(accountsFilePath, JSON.stringify(existingAccounts));
}

if (import.meta.main) {
  const args = parse(Deno.args, {
    string: ["network", "accounts"],
    default: { network: "sepolia", accounts: "1" },
    alias: { n: "network", a: "accounts" },
  });

  const numberOfAccounts = parseInt(args.accounts as string, 10);
  if (isNaN(numberOfAccounts)) {
    console.error("Invalid number of accounts specified");
    Deno.exit(1);
  }

  const network = args.network as string;

  createNewAccounts(numberOfAccounts, network).catch(console.error);
}
