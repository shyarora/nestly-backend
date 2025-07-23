import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "./src/schema/**/*.graphql",
    generates: {
        "./src/generated/types.ts": {
            plugins: ["typescript", "typescript-resolvers"],
            config: {
                useIndexSignature: false,
                contextType: "../types/auth.types#AuthContext",
                mappers: {
                    User: "../types/auth.types#UserGraphQLModel",
                    AuthPayload: "../types/auth.types#AuthPayloadModel",
                },
                scalars: {
                    ID: "string",
                },
            },
        },
    },
};

export default config;
