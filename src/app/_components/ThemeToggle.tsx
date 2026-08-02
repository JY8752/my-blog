"use client";

import { useEffect } from "react";

type Theme = "light" | "dark";

function readStoredTheme(): Theme | null {
  try {
    const theme = window.localStorage.getItem("theme");
    return theme === "light" || theme === "dark" ? theme : null;
  } catch {
    return null;
  }
}

export function ThemeToggle() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncWithSystem = () => {
      if (readStoredTheme() === null) {
        document.documentElement.dataset.theme = media.matches ? "dark" : "light";
      }
    };

    media.addEventListener("change", syncWithSystem);
    return () => media.removeEventListener("change", syncWithSystem);
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;

    try {
      window.localStorage.setItem("theme", nextTheme);
    } catch {
      // Theme switching still works when browser storage is unavailable.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="ライトモードとダークモードを切り替える"
      title="テーマを切り替える"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-on-surface-variant transition-colors hover:bg-primary-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="theme-toggle-to-dark h-5 w-5 fill-none stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="theme-toggle-to-light h-5 w-5 fill-none stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="3.75" />
        <path d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M5.3 5.3 6.7 6.7M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
      </svg>
    </button>
  );
}
