import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    singleThread: true,
    include: ["tests/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@logic": path.resolve(__dirname, "logic"),
      "@assets": path.resolve(__dirname, "assets")
    }
  }
});
