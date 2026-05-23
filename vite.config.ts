import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    // env.d.ts は Astro の triple-slash reference が必要なため除外
    ignorePatterns: ["dist/**", "src/env.d.ts"],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    // .astro は Oxfmt 未対応のため Prettier で別途フォーマット
    // src/content/blog/*.md は Zenn 記法を保持するため除外
    ignorePatterns: ["src/content/**/*.md"],
  },
});
