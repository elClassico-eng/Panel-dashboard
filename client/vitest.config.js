import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve("src"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
    },
});
