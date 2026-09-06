const TWEMOJI_BASE_URL =
  "https://raw.githubusercontent.com/twitter/twemoji/v14.0.2/assets/svg";

export const getTwemojiCodePoint = (emoji: string) =>
  Array.from(emoji)
    .map((character) => character.codePointAt(0)?.toString(16))
    .filter((codePoint) => codePoint !== "fe0f")
    .join("-");

export const loadEmoji = async (emoji: string) => {
  const codePoint = getTwemojiCodePoint(emoji);
  const response = await fetch(`${TWEMOJI_BASE_URL}/${codePoint}.svg`);

  if (!response.ok) {
    throw new Error(`Could not load emoji: ${codePoint}`);
  }

  const svg = await response.text();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
