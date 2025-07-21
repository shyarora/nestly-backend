import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        setupFiles: ["./tools/testing/test-setup.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: ["node_modules/", "dist/", "coverage/", "**/*.generated.ts", "**/*.config.ts", "tests/fixtures/"],
        },
    },
    resolve: {
        alias: {
            "@nestly/database": "./packages/database/src",
            "@nestly/common": "./packages/common/src",
            "@nestly/auth": "./packages/auth/src",
            "@nestly/graphql-types": "./packages/graphql-types/src",
        },
    },
});
