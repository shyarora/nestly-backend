import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const healthTypeDefs = readFileSync(join(__dirname, "health.graphql"), "utf-8");
const authTypeDefs = readFileSync(join(__dirname, "auth.graphql"), "utf-8");

export const typeDefs = [healthTypeDefs, authTypeDefs];
