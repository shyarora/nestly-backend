module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
    },
    plugins: ["@typescript-eslint", "prettier"],
    extends: [
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "prettier",
        "plugin:prettier/recommended",
    ],
    rules: {
        // Prettier integration
        "prettier/prettier": "error",
        
        // TypeScript specific rules
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-non-null-assertion": "warn",
        "@typescript-eslint/prefer-const": "error",
        "@typescript-eslint/no-var-requires": "error",
        
        // General ESLint rules
        "no-console": "off", // Allow console logs in backend
        "no-debugger": "error",
        "no-duplicate-imports": "error",
        "no-unused-expressions": "error",
        "prefer-const": "error",
        "no-var": "error",
        
        // GraphQL/TypeGraphQL specific
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        
        // Relaxed rules for better DX
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/prefer-optional-chain": "warn",
    },
    env: {
        node: true,
        es2022: true,
    },
    ignorePatterns: [
        "dist",
        "node_modules",
        "coverage",
        "*.d.ts",
        "prisma/migrations",
        ".docker",
    ],
};
