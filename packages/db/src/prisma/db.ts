import mongo from "@prisma/orm-mongo/runtime";
import { contractFromJson } from "@prisma/orm-mongo/static";
import { config } from "dotenv";
import type { Contract } from "./contract.js";
import contractJson from "./contract.json" with { type: "json" };

// Load packages/db/.env so every consumer shares one file regardless of its
// working directory.
config({ path: new URL("../../.env", import.meta.url), quiet: true });

export const contract = contractFromJson<Contract>(contractJson);

export const db = mongo({
  contract,
  url: process.env["DATABASE_URL"]!,
});
