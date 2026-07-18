---
name: Soft Neon Dev
colors:
  surface: '#101224'
  surface-dim: '#101224'
  surface-bright: '#37374c'
  surface-container-lowest: '#0b0c1f'
  surface-container-low: '#191a2d'
  surface-container: '#1d1e31'
  surface-container-high: '#27283c'
  surface-container-highest: '#323347'
  on-surface: '#e1e0fb'
  on-surface-variant: '#d7c1c8'
  inverse-surface: '#e1e0fb'
  inverse-on-surface: '#2e2f43'
  outline: '#9f8c93'
  outline-variant: '#524349'
  surface-tint: '#ffafd4'
  primary: '#ffc9e0'
  on-primary: '#5a133d'
  primary-container: '#ff9ecd'
  on-primary-container: '#7b3059'
  inverse-primary: '#92436d'
  secondary: '#64d5f4'
  on-secondary: '#003641'
  secondary-container: '#109ebb'
  on-secondary-container: '#002e39'
  tertiary: '#abe794'
  on-tertiary: '#063900'
  tertiary-container: '#90cb7b'
  on-tertiary-container: '#215614'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd8e7'
  primary-fixed-dim: '#ffafd4'
  on-primary-fixed: '#3d0026'
  on-primary-fixed-variant: '#762b55'
  secondary-fixed: '#b0ecff'
  secondary-fixed-dim: '#64d5f4'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5e'
  tertiary-fixed: '#b5f39e'
  tertiary-fixed-dim: '#9ad685'
  on-tertiary-fixed: '#022100'
  on-tertiary-fixed-variant: '#1d5110'
  background: '#101224'
  on-background: '#e1e0fb'
  surface-variant: '#323347'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 4rem
  card-gap: 2.5rem
  section-margin: 6rem
  inner-padding: 2rem
---

## Brand & Style

The design system evolves the "Pop Dark" aesthetic into a refined, developer-centric workspace that balances playfulness with technical clarity. The brand personality is "Clean, Cute, and Playful," moving away from high-density chaos toward an organized, airy, and inviting interface. 

The visual style blends **Minimalism** with a **Tactile** edge. By utilizing significant whitespace and a softened dark palette, the UI reduces cognitive load while maintaining its personality through large radius curves and gentle neon accents. It aims to evoke a sense of approachable expertise—professional enough for a portfolio, but spirited enough to reflect a creative developer's personality.

## Colors

The palette is anchored by a soft charcoal-indigo base, providing a "Pop Dark" foundation that is easier on the eyes than pure black. The color system is streamlined to focus on two high-visibility accents:

*   **Primary (Soft Neon Pink):** Used for primary calls to action, profile borders, and key brand highlights.
*   **Secondary (Soft Cyan):** Used for technical tags, link states, and secondary interactive elements.
*   **Neutrals:** The background is a deep muted indigo, with surfaces using a slightly lighter variant to create depth without relying on heavy borders.
*   **Semantic Colors:** Success, Warning, and Error states should be desaturated to match the "soft" nature of the neon palette.

## Typography

This design system uses **Plus Jakarta Sans** as the primary typeface to deliver a soft, friendly, and geometric feel. It provides the "cute" aspect of the brand while remaining highly legible for technical blog content.

For metadata, tags, and code-adjacent labels, **Space Grotesk** is introduced. Its technical, slightly quirky proportions provide a "developer" aesthetic that contrasts beautifully with the rounded body text. 

Maintain high line-heights (1.6 for body) to support the goal of increased whitespace and breathability. Headlines should use tight letter-spacing to feel impactful and "pop."

## Layout & Spacing

The layout philosophy shifts from a compact "dashboard" feel to a fluid, spacious **Fixed Grid** model.

*   **Desktop:** 12-column grid with a max-width of 1200px. Gutters are set to 32px to ensure distinct separation between content blocks.
*   **Whitespace:** Increase vertical margins between sections significantly (80px-120px) to allow each part of the portfolio to stand alone.
*   **Mobile:** 4-column grid with 24px side margins. Content should stack vertically, maintaining generous 32px gaps between cards to avoid a cluttered look.
*   **Alignment:** Center-aligned containers for the profile and hero sections, with left-aligned grids for the blog list to maintain readability.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Subtle Glows** rather than traditional heavy shadows.

*   **Surfaces:** The main background is the darkest layer. Cards and containers use a slightly lighter indigo (`surface_hex`) to "lift" off the page.
*   **Glow Effects:** Accents use a soft, 20% opacity drop shadow of the primary or secondary color with a high blur radius (24px+). This creates a "neon" atmosphere without the harshness of high-contrast glows.
*   **Glassmorphism:** Navigation bars use a 12px backdrop blur with a 10% white tint to stay legible while scrolling over colorful content.

## Shapes

The shape language is defined by "Rounded" curves. 

*   **Cards & Containers:** Use `rounded-xl` (1.5rem) to maintain the playful, approachable character.
*   **Profile Image:** The panda icon is strictly circular with a consistent 4px border in the Primary Pink or a tri-color stroke (Pink, Cyan, Neutral) to reference the original's energy in a cleaner way.
*   **Interactive Elements:** Buttons and tags use `rounded-lg` (1rem) to feel tactile and soft.

## Components

### Profile Card
The profile section should be centered and spacious. The panda icon must be large (min 160px) with a simple, high-contrast border. Subtext and links should have generous 16px spacing between lines to avoid the "compressed" look of the reference.

### Blog List Cards
Blog cards should abandon the colorful backgrounds for a clean `surface_hex` background. 
- **Header:** Title in `headline-md`.
- **Meta:** Date and reading time in `label-md` using a muted neutral color.
- **Padding:** 32px internal padding on all sides.
- **Interaction:** On hover, the card should scale slightly (1.02x) and gain a soft primary-color glow.

### Chips & Tags
Tags use a secondary color background at 15% opacity with a solid 1px border. Use `Space Grotesk` for tag text to give it a technical "dev" feel.

### Buttons
Buttons are solid Primary Pink with dark text for high contrast. They should have a "squishy" feel—expanding slightly on hover and shrinking on click.

### Inputs
Search or contact fields should use a dark stroke that glows Cyan when focused, maintaining the "soft neon" theme.