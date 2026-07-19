---
name: Quiet Hokkaido Editorial
colors:
  surface: '#171815'
  surface-dim: '#141512'
  surface-bright: '#2A2C27'
  surface-container-lowest: '#11120F'
  surface-container-low: '#1A1B18'
  surface-container: '#1E201C'
  surface-container-high: '#262822'
  surface-container-highest: '#30322C'
  on-surface: '#F0EEE6'
  on-surface-variant: '#BDBCB4'
  inverse-surface: '#F0EEE6'
  inverse-on-surface: '#2A2B27'
  outline: '#8A8C83'
  outline-variant: '#383A34'
  surface-tint: '#D08A70'
  primary: '#D08A70'
  on-primary: '#2B1711'
  primary-container: '#5A3227'
  on-primary-container: '#F5D8CD'
  inverse-primary: '#8C4432'
  secondary: '#BDBCB4'
  on-secondary: '#242520'
  secondary-container: '#30322C'
  on-secondary-container: '#E5E3DB'
  tertiary: '#8A8C83'
  on-tertiary: '#1A1B18'
  tertiary-container: '#30322C'
  on-tertiary-container: '#E5E3DB'
  error: '#FFB4AB'
  on-error: '#690005'
  error-container: '#93000A'
  on-error-container: '#FFDAD6'
  primary-fixed: '#F5D8CD'
  primary-fixed-dim: '#DDA58F'
  on-primary-fixed: '#32130C'
  on-primary-fixed-variant: '#6A3426'
  secondary-fixed: '#E5E3DB'
  secondary-fixed-dim: '#C8C7BF'
  on-secondary-fixed: '#1B1C18'
  on-secondary-fixed-variant: '#454740'
  tertiary-fixed: '#E5E3DB'
  tertiary-fixed-dim: '#C8C7BF'
  on-tertiary-fixed: '#1B1C18'
  on-tertiary-fixed-variant: '#454740'
  background: '#171815'
  on-background: '#F0EEE6'
  surface-variant: '#30322C'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.06'
    letterSpacing: -0.035em
  headline-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.12'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Outfit
    fontSize: 30px
    fontWeight: '650'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Noto Sans JP
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.85'
  body-md:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.8'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.06em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 44px
    fontWeight: '700'
    lineHeight: '1.08'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.875rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 2rem
  card-gap: 3rem
  section-margin: 8rem
  inner-padding: 2rem
---

# Design System: Quiet Hokkaido Editorial

## 1. Visual Theme & Atmosphere

Quiet Hokkaido Editorial is a calm, tactile personal publishing system for a
backend engineer balancing learning and parenting. In light mode it feels like
an independent technical journal open beside a window; in dark mode it becomes
the same journal on a quiet desk after the children have gone to sleep. Both
modes stay focused, warm, intelligent, and gently humorous without becoming
cyberpunk, cute, or decorative.

- Density is **4/10, editorially airy**. Every section has room to breathe, while
  article metadata stays compact and useful.
- Variance is **7/10, confidently asymmetric**. The hero, profile information,
  skills, and article index use offset columns and intentional empty space.
- Motion is **5/10, quiet and fluid**. Interaction is noticeable through weight,
  opacity, and small transforms rather than spectacle.
- The panda remains the recognizable personal signature. Use the real profile
  image once as a restrained, centered profile portrait. Never repeat it inside
  the headline or use it as a decorative mascot elsewhere.
- The interface must feel like a real Japanese personal blog, not a SaaS landing
  page, developer dashboard, or generated portfolio template.

## 2. Color Palette & Roles

Use one restrained vermilion-to-copper accent family and consistent warm neutral
surfaces. Do not introduce cyan, purple, blue, green, or additional brand
accents.

### Light mode

- **Snow Paper** (`#F4F3EE`) — Main canvas and article reading background.
- **Raised Paper** (`#FAF9F5`) — Header and grouped surfaces.
- **Charcoal Ink** (`#1C1D1A`) — Primary text and display headlines.
- **Graphite Ink** (`#4F514B`) — Body copy and secondary descriptions.
- **Stone Metadata** (`#74766F`) — Dates, labels, and quiet helper text.
- **Whisper Rule** (`#D8D8D1`) — One-pixel dividers and boundaries.
- **Hokkaido Vermilion** (`#B85F48`) — The only accent.
- **Vermilion Wash** (`#F0DDD6`) — Selected, hover, and selection surfaces.
- **On Accent** (`#FFFDF9`) — Text placed on Hokkaido Vermilion.

### Dark mode

- **Night Paper** (`#171815`) — Main canvas and article reading background.
- **Raised Night Paper** (`#1E201C`) — Header and grouped surfaces.
- **Warm Ink** (`#F0EEE6`) — Primary text and display headlines.
- **Soft Ash** (`#BDBCB4`) — Body copy and secondary descriptions.
- **Smoke Metadata** (`#8A8C83`) — Dates, labels, and quiet helper text.
- **Quiet Rule** (`#383A34`) — One-pixel dividers and boundaries.
- **Hokkaido Copper** (`#D08A70`) — The only accent.
- **Copper Wash** (`#5A3227`) — Selected, hover, and selection surfaces.
- **On Accent** (`#2B1711`) — Text placed on Hokkaido Copper.

The accent hue keeps the same semantic role in both modes: primary CTA, active
links, focus rings, brand mark, and no more than two highlighted words in a
viewport. Shadows are neutral and nearly imperceptible: use
`0 18px 50px rgba(28, 29, 26, 0.08)` in light mode and
`0 18px 50px rgba(5, 6, 4, 0.24)` in dark mode. Never use colored shadows,
bright edge lighting, outer glows, neon effects, glass gradients, or gradient
text. Never use pure black.

## 3. Typography Rules

- **Display and headings:** `Outfit`, with `Noto Sans JP` for Japanese glyphs.
  Weight 650–700, tight tracking between `-0.035em` and `-0.02em`. Headings are
  composed and controlled, not oversized for impact alone.
- **Body:** `Noto Sans JP`, with `Outfit` for Latin text. Weight 400, line height
  1.85 for Japanese reading, maximum line length 65 characters.
- **Metadata and technical labels:** `JetBrains Mono`, weight 500, uppercase only
  for short Latin labels. Do not uppercase Japanese text.
- **Desktop hero:** `clamp(3.25rem, 5.8vw, 5.75rem)`, line height 1.06.
- **Article title:** `clamp(2.5rem, 4.6vw, 4.75rem)`, line height 1.12.
- **Section heading:** `clamp(2rem, 3.2vw, 3.25rem)`, line height 1.18.
- **Body:** `1.0625rem` desktop and `1rem` mobile.
- **Metadata:** `0.75rem` to `0.8125rem`, letter spacing `0.06em`.
- Hierarchy comes from spacing, weight, and ink color. Do not use large areas of
  bold text, decorative italics, or all-caps Japanese copy.
- Inter and generic serif fonts are banned. The design uses no serif typography.

## 4. Component Stylings

### Header

Use a 72-pixel desktop header on the active raised surface with a one-pixel rule
at the bottom. Keep the left brand and right social icons, but remove neon and
filled card treatments. The brand mark is a small 10-pixel accent square with
two-pixel corner rounding. Social icons are 44-pixel touch targets with no
background at rest; on hover they gain the active accent wash and primary ink.
Place a 44-pixel sun/moon theme toggle beside the social links. The header may
be sticky but should not use glassmorphism or heavy blur.

### Hero

Use a 12-column grid inside a 1280-pixel container. The main statement spans
columns 1–8. Profile context begins around column 10, leaving one deliberate
empty column between them. The headline stays left aligned. Do not place an image
inside the headline; the panda appears once in the profile column so the visual
identity stays clear and uncluttered.

Allow exactly one filled primary CTA: `記事を読む`. It uses the active accent,
On Accent text, a 14-pixel corner radius, and a minimum 48-pixel height. Keep
`職務経歴` and `My Talks` as quiet underlined text links with external-link icons,
not secondary buttons.

### Profile and skills

Give the profile and skill inventory one compact raised surface so it reads as a
distinct identity module against the open hero. Use a one-pixel structural
border, the active raised-surface color, a neutral paper shadow, and a 16-pixel
corner radius. Keep the portrait centered with a two-pixel accent ring. Remove
all emoji characters from skill labels.

Present skills under one simple `Skills` heading as five compact ruled groups:
Languages, Frameworks, Platform, Database, and Practices. Do not show a group
count or numeric group prefixes; the category labels already provide sufficient
hierarchy. Within each group, render real skill values as small rectangular
badges with a four-pixel corner radius, one-pixel neutral border, raised neutral
fill, and JetBrains Mono labels. Badges must remain grouped under their category
and wrap naturally; never merge every technology into one undifferentiated chip
cloud.

### Theme behavior

On first visit, follow `prefers-color-scheme`. A manual header-toggle selection
overrides the system preference and persists in local storage. Apply the stored
or system theme before the first paint to avoid a light-to-dark flash. Theme
changes may transition color and background color for 300 milliseconds; layout,
size, spacing, typography, and content never change between themes.

### Article index

Treat the article list as an editorial index, not a card gallery. Place the full
index section on a subtly contrasting neutral surface with top and bottom rules.
Use border-top dividers, generous vertical padding, and a clear reading order.
The latest story gains a raised neutral fill, accent top rule, small `Latest`
label, and stronger type, while every story aligns to one consistent title
column so the list scans cleanly. Other rows gain the raised neutral fill only on
hover. Each row contains the real date, title, and real tags only. Tags are
simple JetBrains Mono text; only the currently focused tag may use the active
accent wash. Do not fabricate reading time, view counts, excerpts, or statistics.

### Article content

Use a cardless reading surface. On desktop, place date and tag in a narrow left
metadata rail and the title/body in a wider center column, leaving asymmetric
whitespace on the right. Separate the article header from the body with a
one-pixel rule. Links use the active accent with a visible underline. Code blocks
use `#1C1D1A` in light mode and Deep Night (`#11120F`) in dark mode, with warm
light text and 16-pixel corners. Zenn message blocks use the active raised
surface and an accent left rule.

### Focus and active states

All controls have a two-pixel active-accent focus ring with a three-pixel
offset. Buttons translate down one pixel on active. Links shift no more than two
pixels horizontally on hover. Do not use scale effects larger than 1.01.

## 5. Layout Principles

- Use CSS Grid as the primary layout method and a centered maximum width of
  1280 pixels with 32-pixel desktop gutters.
- Use a base spacing unit of 8 pixels. Major section gaps use
  `clamp(4.5rem, 9vw, 8rem)`; internal groups use 24, 32, or 48 pixels.
- Preserve intentional empty columns. Do not fill whitespace with badges,
  statistics, decorative orbs, fake code windows, or abstract gradients.
- Every element occupies its own spatial zone. Text, images, and decorative marks
  never overlap.
- Cards are used only when elevation communicates hierarchy. Prefer rules,
  alignment, and negative space for articles and skills.
- Do not use a centered hero, three equal horizontal cards, bento grids, or a
  dashboard layout.
- Full-height compositions use `min-height: 100dvh`, never `100vh`.

### Homepage composition

1. Sticky restrained header.
2. Asymmetric hero with the real Japanese headline and one profile portrait.
3. Direct profile and skill ledger integrated into the hero's right column.
4. Editorial article index using the six real articles in date order.
5. Minimal footer containing only the real name and existing English descriptor.

### Article-page composition

1. Same restrained header.
2. Back link aligned to the main grid.
3. Asymmetric article header with a narrow metadata rail and broad title column.
4. Cardless readable body limited to 65 characters per line.
5. Same minimal footer. Do not add a table of contents, author card, share bar,
   related posts, newsletter, comments, or fabricated navigation.

## 6. Responsive Rules

- Below 768 pixels, all multi-column structures collapse to one column with
  20-pixel side padding and no horizontal scrolling.
- The panda remains a single 96-pixel centered profile portrait on mobile.
- Article metadata moves above the title. Article rows stack date, title, and
  tags vertically with 12-pixel gaps.
- Header social links collapse into one clearly labelled menu; the brand remains
  visible. Every touch target is at least 44 by 44 pixels.
- Headings scale with `clamp()`. Japanese body text never renders below 16 pixels.
- Section spacing reduces proportionally with
  `clamp(3rem, 8vw, 6rem)`.

## 7. Motion & Interaction

- Use spring-like easing equivalent to stiffness 100 and damping 20. CSS-only
  transitions may use `cubic-bezier(0.22, 1, 0.36, 1)`.
- Reveal article rows in a 60-millisecond stagger using only opacity and a
  six-pixel vertical transform.
- The brand square performs a restrained opacity breath from 0.72 to 1 over 3.6
  seconds. The profile image floats vertically by two pixels over 5 seconds.
- The latest-article indicator may pulse opacity slowly. No other perpetual
  motion is required.
- Animate only transform and opacity. Never animate width, height, top, left, or
  expensive filters.
- Under `prefers-reduced-motion: reduce`, remove perpetual motion, stagger, and
  smooth scrolling completely.

## 8. Anti-Patterns: Never Do

- No emojis anywhere in the generated interface.
- No Inter, generic serif fonts, or pure black.
- No purple, blue, cyan, neon, colored glow, or gradient text.
- No more than one accent hue and no oversaturated colors.
- No centered hero, overlapping elements, or absolute-positioned content stacks.
- No three-column equal-card rows, bento grids, excessive pills, or chip clouds.
- No custom mouse cursor or large hover scaling.
- No generic names, placeholder people, fake metrics, reading times, statistics,
  uptime figures, or system-performance sections.
- No `LABEL // YEAR` formatting.
- No filler copy such as “Elevate,” “Seamless,” “Unleash,” “Next-Gen,” “Scroll to
  explore,” or “Swipe down.”
- No extra navigation, testimonials, contact form, newsletter, social proof,
  decorative device mockups, or stock photography.
- Use the real `ぱんだ.dev`, `Yamanaka Junichi`, article titles, dates, tags,
  profile image, biography, skills, and external links supplied by the project.
