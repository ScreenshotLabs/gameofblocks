import { parse } from "https://deno.land/std@0.206.0/dotenv/mod.ts";
import { join, fromFileUrl } from "https://deno.land/std@0.206.0/path/mod.ts";
import {
  CairoAssembly,
  CompiledContract,
  Account,
  RpcProvider,
  CallData,
} from "https://esm.sh/starknet@6.11.0";

// Determine the path to the root .env file
const rootPath = new URL("../../", import.meta.url).pathname;
const envPath = join(rootPath, ".env");

// Load environment variables
const env = await parse(await Deno.readTextFile(envPath));
const NODE_URL = env["NODE_URL"] || Deno.env.get("NODE_URL");
const ALCHEMY_API_KEY =
  env["ALCHEMY_API_KEY"] || Deno.env.get("ALCHEMY_API_KEY");
if (!ALCHEMY_API_KEY || !NODE_URL) {
  console.error(
    "ALCHEMY_API_KEY is not set in the environment variables or .env file."
  );
  Deno.exit(1);
}

// Calculate the correct path to the target directory
const currentDir = fromFileUrl(import.meta.url);
const TARGET_PATH = join(currentDir, "..", "..", "contracts", "target", "dev");

function getStarknetProvider() {
  return new RpcProvider({
    nodeUrl: `${NODE_URL}/${ALCHEMY_API_KEY}`,
  });
}

function getAccount(provider: RpcProvider) {
  const accountAddress = env["STARKNET_ACCOUNT_ADDRESS_ADMIN"];
  const privateKey = env["STARKNET_ACCOUNT_PRIVATE_KEY_ADMIN"];
  return new Account(provider, accountAddress, privateKey);
}

function readJson(path: string) {
  try {
    const data = Deno.readTextFileSync(path);
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", path);
    console.error("Error details:", err);
    Deno.exit(1);
  }
}

function loadArtifacts(
  path: string,
  contractName: string
): { casm: CairoAssembly; sierra: CompiledContract } {
  const casm = "compiled_contract_class.json";
  const sierra = "contract_class.json";

  const casmPath = join(path, `${contractName}.${casm}`);
  const sierraPath = join(path, `${contractName}.${sierra}`);

  console.log("Loading CASM from:", casmPath);
  console.log("Loading Sierra from:", sierraPath);

  return {
    casm: readJson(casmPath),
    sierra: readJson(sierraPath),
  };
}

async function updateEnvFile(contractAddress: string) {
  const envContent = await Deno.readTextFile(envPath);
  const updatedEnvContent = envContent.replace(
    /GOB_CONTRACT=.*/,
    `GOB_CONTRACT=${contractAddress}`
  );
  const updatedEnvContentNext = updatedEnvContent.replace(
    /NEXT_PUBLIC_GOB_CONTRACT=.*/,
    `NEXT_PUBLIC_GOB_CONTRACT=${contractAddress}`
  );
  await Deno.writeTextFile(envPath, updatedEnvContentNext);
  console.log(
    `Updated .env file with new contract address: ${contractAddress}`
  );
}

async function deployGameOfBlocksPoolContract() {
  const provider = getStarknetProvider();
  const deployerAccount = getAccount(provider);
  console.log(deployerAccount.address);
  const artifacts = loadArtifacts(TARGET_PATH, "gob_game");
  const contractCallData = new CallData(artifacts.sierra.abi);
  const contractConstructor = contractCallData.compile("constructor", {
    admin: "0x0078388E992bd51A4a967C7C8B6CfA732BcbbaF00F495fA6205355BaB46417d9"
  });
  const deployment = await deployerAccount.declareAndDeploy({
    contract: artifacts.sierra,
    casm: artifacts.casm,
    constructorCalldata: contractConstructor,
  });
  console.log(deployment);

  // Update the .env file with the new contract address
  await updateEnvFile(deployment.deploy.contract_address);
}

if (import.meta.main) {
  try {
    await deployGameOfBlocksPoolContract();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
