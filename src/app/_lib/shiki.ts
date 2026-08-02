import go from "@shikijs/langs/go";

import {
  bundledLanguages as webLanguages,
  bundledThemes,
  createBundledHighlighter,
} from "shiki/bundle/web";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

/**
 * zenn-markdown-html imports Shiki's complete language bundle by default.
 * Keep the common web languages, plus Go which is used by existing articles.
 */
export const bundledLanguages = {
  ...webLanguages,
  go: () => Promise.resolve(go),
};

export const createHighlighter = createBundledHighlighter({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRegexEngine(),
});
