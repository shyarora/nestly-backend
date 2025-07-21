import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load all GraphQL schema files
const typesArray = loadFilesSync(join(__dirname, "**/*.graphql"));

// Merge all type definitions
export const typeDefs = mergeTypeDefs(typesArray);
