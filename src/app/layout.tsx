import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_JP, Outfit } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "zenn-content-css";
import { ThemeToggle } from "../components/ThemeToggle";
import { BLOG_NAME } from "../consts/message";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const socialLinks = [
  { label: "GitHub", href: "https://github.com/JY8752", icon: "github" },
  { label: "X", href: "https://twitter.com/ymnk_8752", icon: "x" },
  { label: "Zenn", href: "https://zenn.dev/jy8752", icon: "zenn" },
  { label: "Qiita", href: "https://qiita.com/JY8752", icon: "qiita" },
  {
    label: "Wantedly",
    href: "https://www.wantedly.com/id/junichi_yamanaka",
    icon: "wantedly",
  },
  { label: "note", href: "https://note.com/panda_p", icon: "note" },
  { label: "しずかな", href: "https://sizu.me/junichi_y", icon: "sizu" },
] as const;

type SocialIconName = (typeof socialLinks)[number]["icon"];

const socialIconPaths: Partial<Record<SocialIconName, string>> = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  zenn: "M.264 23.771h4.984c.264 0 .498-.147.645-.352L19.614.874c.176-.293-.029-.645-.381-.645h-4.72c-.235 0-.44.117-.557.323L.03 23.361c-.088.176.029.41.234.41zM17.445 23.419l6.479-10.408c.205-.323-.029-.733-.41-.733h-4.691c-.176 0-.352.088-.44.235l-6.655 10.643c-.176.264.029.616.352.616h4.779c.234-.001.468-.118.586-.353z",
  qiita:
    "M3.57 8.343a3.653 3.653 0 0 0-1.376.269 3.585 3.585 0 0 0-1.14.738 3.503 3.503 0 0 0-.773 1.102A3.297 3.297 0 0 0 0 11.814a3.28 3.28 0 0 0 .281 1.357 3.535 3.535 0 0 0 .775 1.107A3.636 3.636 0 0 0 3.6 15.29a3.731 3.731 0 0 0 .987-.13 3.657 3.657 0 0 0 .888-.374l.687.698a.579.579 0 0 0 .824 0 .58.58 0 0 0 0-.817l-.624-.624a3.533 3.533 0 0 0 .613-1.022 3.282 3.282 0 0 0 .226-1.208 3.297 3.297 0 0 0-.282-1.362 3.488 3.488 0 0 0-.775-1.102A3.614 3.614 0 0 0 5 8.612a3.657 3.657 0 0 0-1.398-.27 3.653 3.653 0 0 0-.031 0zm11.306.185v1.484h-.765v1.063h.765v2.142c0 .419.053.761.159 1.028a1.56 1.56 0 0 0 .433.63 1.511 1.511 0 0 0 .643.317 2.676 2.676 0 0 0 .694.086h.853v-1.013h-.736a1.25 1.25 0 0 1-.352-.048.713.713 0 0 1-.291-.169.81.81 0 0 1-.2-.324 1.575 1.575 0 0 1-.074-.519v-2.13h1.666v-1.063h-1.66V8.528zM9.4 8.856a.69.69 0 0 0-.69.691.69.69 0 0 0 .69.69.69.69 0 0 0 .691-.69.69.69 0 0 0-.69-.691zm2.771 0a.69.69 0 0 0-.69.691.69.69 0 0 0 .69.69.69.69 0 0 0 .691-.69.69.69 0 0 0-.69-.691zm-8.6.538a2.324 2.324 0 0 1 .03 0 2.35 2.35 0 0 1 .93.187 2.346 2.346 0 0 1 1.264 1.28 2.463 2.463 0 0 1 .186.957 2.444 2.444 0 0 1-.186.957 2.384 2.384 0 0 1-.506.767 2.363 2.363 0 0 1-1.688.698 2.324 2.324 0 0 1-.93-.186 2.376 2.376 0 0 1-.755-.512 2.427 2.427 0 0 1-.699-1.723 2.44 2.44 0 0 1 .699-1.727 2.384 2.384 0 0 1 .756-.511 2.324 2.324 0 0 1 .898-.187zm17.648.773a2.69 2.69 0 0 0-1.02.201 2.49 2.49 0 0 0-.815.552 2.432 2.432 0 0 0-.525.814 2.678 2.678 0 0 0-.186.998 2.644 2.644 0 0 0 .186.997 2.485 2.485 0 0 0 .525.814 2.436 2.436 0 0 0 .815.546 2.697 2.697 0 0 0 1.059.2 2.42 2.42 0 0 0 .518-.056 2.524 2.524 0 0 0 .46-.146 2.426 2.426 0 0 0 .394-.213 2.394 2.394 0 0 0 .329-.263l.065.53H24v-4.829h-.976l-.068.533a2.498 2.498 0 0 0-.322-.26 2.25 2.25 0 0 0-.394-.217 2.616 2.616 0 0 0-.462-.145 2.404 2.404 0 0 0-.521-.056 2.69 2.69 0 0 0-.038 0zm-12.375.844v4.138h1.113V11.01zm2.77 0v4.138h1.114V11.01zm9.72.145a1.592 1.592 0 0 1 .024 0 1.557 1.557 0 0 1 1.098.445 1.495 1.495 0 0 1 .334.495 1.61 1.61 0 0 1 .121.631 1.632 1.632 0 0 1-.121.64 1.551 1.551 0 0 1-.331.498 1.47 1.47 0 0 1-.49.324 1.642 1.642 0 0 1-1.207 0 1.502 1.502 0 0 1-.493-.324 1.52 1.52 0 0 1-.333-.5 1.64 1.64 0 0 1-.122-.638 1.628 1.628 0 0 1 .12-.637 1.524 1.524 0 0 1 .328-.495 1.474 1.474 0 0 1 .49-.323 1.592 1.592 0 0 1 .581-.116z",
  wantedly:
    "M18.453 14.555c-.171-.111-.658-.764-2.006-3.982a9.192 9.192 0 0 0-.237-.526l-.274-.664-2.362-5.702H8.85l2.362 5.702 2.362 5.706 2.181 5.267a.196.196 0 0 0 .362 0l2.373-5.682a.1.1 0 0 0-.037-.119zm-8.85 0c-.171-.111-.658-.764-2.006-3.982a8.971 8.971 0 0 0-.236-.525l-.276-.665-2.36-5.702H0l2.362 5.702 2.362 5.706 2.181 5.267a.196.196 0 0 0 .362 0l2.374-5.682a.098.098 0 0 0-.038-.119ZM24 6.375a2.851 2.851 0 0 1-2.851 2.852 2.851 2.851 0 0 1-2.852-2.852 2.851 2.851 0 0 1 2.852-2.851A2.851 2.851 0 0 1 24 6.375Z",
};

function SocialIcon({ name }: { name: SocialIconName }) {
  if (name === "sizu") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="https://static.sizu.me/images/logo-favicon.png"
        alt=""
        width="20"
        height="20"
        className="theme-sizu-icon opacity-70 transition-opacity group-hover:opacity-100"
      />
    );
  }

  if (name === "note") {
    return (
      <span aria-hidden="true" className="font-label text-lg leading-none font-bold">
        n
      </span>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d={socialIconPaths[name]} />
    </svg>
  );
}

export const metadata: Metadata = {
  title: { default: BLOG_NAME, template: `%s | ${BLOG_NAME}` },
  description: "Yamanaka Junichiのプロフィールと技術ブログ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${outfit.variable} ${notoSansJp.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">{`
          (() => {
            let theme;
            try {
              const storedTheme = window.localStorage.getItem('theme');
              theme = storedTheme === 'light' || storedTheme === 'dark'
                ? storedTheme
                : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            } catch {
              theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            document.documentElement.dataset.theme = theme;
          })();
        `}</Script>
        <Script
          src="https://embed.zenn.studio/js/listen-embed-event.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P0D0MCX4BH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-P0D0MCX4BH');
        `}</Script>

        <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface-container">
          <div className="mx-auto flex min-h-18 max-w-[1280px] items-center justify-between gap-6 px-5 md:px-8">
            <Link
              className="group flex min-h-11 shrink-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
              href="/"
            >
              <span
                aria-hidden="true"
                className="brand-breath h-2.5 w-2.5 rounded-[2px] bg-primary"
              />
              <span className="font-display text-lg font-bold tracking-tight md:text-xl">
                ぱんだ<span className="text-primary">.</span>dev
              </span>
            </Link>

            <div className="flex items-center gap-1">
              <nav aria-label="ソーシャルリンク" className="hidden items-center gap-1 md:flex">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    title={link.label}
                    className="group grid h-11 w-11 shrink-0 place-items-center rounded-md text-on-surface-variant transition-colors hover:bg-primary-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
                  >
                    <SocialIcon name={link.icon} />
                  </a>
                ))}
              </nav>

              <ThemeToggle />

              <details className="group/menu relative md:hidden">
                <summary className="cursor-pointer list-none rounded-md px-3 font-label text-xs font-medium text-on-surface-variant transition-colors hover:bg-primary-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  <span className="flex min-h-11 items-center gap-2">
                    Links
                    <span
                      aria-hidden="true"
                      className="text-base leading-none transition-transform group-open/menu:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <nav
                  aria-label="ソーシャルリンク"
                  className="absolute top-[calc(100%+0.5rem)] right-0 z-10 grid w-56 gap-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-2 shadow-paper"
                >
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="group flex min-h-11 items-center gap-3 rounded-md px-3 font-label text-xs text-on-surface-variant transition-colors hover:bg-primary-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <SocialIcon name={link.icon} />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </nav>
              </details>
            </div>
          </div>
        </header>

        {children}

        <footer className="border-t border-outline-variant bg-surface">
          <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 md:py-16">
            <div>
              <p className="font-display font-bold tracking-[-0.02em]">Yamanaka Junichi</p>
              <p className="mt-1.5 text-sm text-on-surface-variant">
                Backend engineer & lifelong learner.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
