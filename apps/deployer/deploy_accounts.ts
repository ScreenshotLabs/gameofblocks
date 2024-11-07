import { parse } from "https://deno.land/std@0.206.0/flags/mod.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.206.0/path/mod.ts";
import { load } from "https://deno.land/std@0.206.0/dotenv/mod.ts";
import { Account, CallData, RpcProvider } from "https://esm.sh/starknet@6.11.0";

import { OZaccountClassHash } from "./constants.ts";

interface Iaccount {
  address: string;
  privateKey: string;
  publicKey: string;
  deployed: boolean;
}

// Load environment variables from the root .env file
const currentDir = dirname(fromFileUrl(import.meta.url));
const rootDir = join(currentDir, "..", "..");
const envVars = await load({ envPath: join(rootDir, ".env") });

const NODE_URL = envVars["NODE_URL"] || Deno.env.get("NODE_URL");
const ALCHEMY_API_KEY = envVars["ALCHEMY_API_KEY"] ||
  Deno.env.get("ALCHEMY_API_KEY");
if (!ALCHEMY_API_KEY) {
  console.error(
    "ALCHEMY_API_KEY is not set in the environment variables or .env file.",
  );
  Deno.exit(1);
}

function getStarknetProvider() {
  return new RpcProvider({
    nodeUrl:
      `${NODE_URL}/${ALCHEMY_API_KEY}`,
  });
}

async function deployAccount(starknetNetwork: string) {
  const starknetProvider = getStarknetProvider();
  const accountsFilePath = join(currentDir, "accounts", `${starknetNetwork}.json`);

  let accounts: Iaccount[] = [];
  try {
    const fileData = await Deno.readTextFile(accountsFilePath);
    accounts = JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return;
  }

  const notDeployedAccounts = accounts.filter((a) => a.deployed === false);

  for (const accountToDeploy of notDeployedAccounts) {
    const account = new Account(
      starknetProvider,
      accountToDeploy.address,
      accountToDeploy.privateKey,
      "1",
    );
    const { transaction_hash } = await account.deployAccount({
      classHash: OZaccountClassHash,
      constructorCalldata: CallData.compile({
        publicKey: accountToDeploy.publicKey,
      }),
      addressSalt: accountToDeploy.publicKey,
    });

    console.log("Deploying account... Transaction hash:", transaction_hash);
    // await starknetProvider.waitForTransaction(transaction_hash);

    console.log("✅ Account deployed.");

    const accountIndex = accounts.findIndex(
      (a) => a.address === accountToDeploy.address,
    );
    if (accountIndex !== -1) {
      const accountToUpdate = accounts[accountIndex];
      if (accountToUpdate) {
        accountToUpdate.deployed = true;
      }
    }
  }

  try {
    await Deno.writeTextFile(
      accountsFilePath,
      JSON.stringify(accounts, null, 2),
    );
    console.log("Account information updated in JSON file.");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
}

if (import.meta.main) {
  const args = parse(Deno.args, {
    string: ["starknet"],
    default: { starknet: "sepolia" },
    alias: { sn: "starknet" },
  });

  const starknetNetwork = args.starknet as string;

  deployAccount(starknetNetwork);
}
