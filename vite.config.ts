import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    ignorePatterns: ["dist/**", ".next/**", "src/env.d.ts"],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    // src/content/blog/*.md は Zenn 記法を保持するため除外
    ignorePatterns: ["src/content/**/*.md"],
  },
});
