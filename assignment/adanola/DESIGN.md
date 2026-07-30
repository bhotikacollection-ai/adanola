# Adanola — Style Reference
> Editorial lookbook on white paper. A fashion editorial spread where typography and photography breathe across clean white surfaces, with black ink for type and a whisper-thin custom sans-serif (Favorit) carrying the entire brand voice.

**Theme:** light

Adanola is a gallery-like fashion canvas where the product photography is the entire visual language and the UI almost disappears. The interface is near-monochrome — white surfaces, black text, and a single thin sans-serif typeface (Favorit) — letting the color of the garments themselves become the only chromatic accent on most pages. Components are deliberately lightweight: no shadows, no gradients, no decorative borders, just hairline rules, ghost outlines on primary actions, and 4px corner radii that read as crisp rather than soft. Spacing is compact and consistent (4px base), but the generous whitespace around imagery creates a calm, editorial rhythm that treats every product shot as a full-bleed editorial spread. The overall feel is closer to a high-end print lookbook than a typical e-commerce grid.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Ink | `#000000` | `--color-carbon-ink` | Primary text, filled action buttons, icon strokes, hairlines — the dominant ink across the entire interface |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, text on dark fills, image backgrounds |
| Soft Mist | `#e5e7eb` | `--color-soft-mist` | Subtle surface alternation, disabled states, skeleton backgrounds, light dividers |
| Warm Fog | `#f0efe7` | `--color-warm-fog` | Off-white surface variant for subtle banding between product rows and editorial sections |
| Blush Sand | `#f5ebd5` | `--color-blush-sand` | Warm cream surface for editorial highlight sections and seasonal accents |
| Smoke Charcoal | `#333333` | `--color-smoke-charcoal` | Secondary text, input borders, subdued UI chrome |
| Onyx | `#1d1d1d` | `--color-onyx` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Stone Gray | `#cccccc` | `--color-stone-gray` | Placeholder backgrounds, image placeholder fills, neutral swatch defaults |
| Slate | `#2f3440` | `--color-slate` | Cool charcoal for product photography backgrounds and muted editorial surfaces |
| Olive Drab | `#636355` | `--color-olive-drab` | Warm muted surface for product photography contexts |
| Maroon Clay | `#523037` | `--color-maroon-clay` | Warm muted surface for product photography contexts |
| Deep Iris | `#222845` | `--color-deep-iris` | Cool muted surface for product photography contexts |
| Pewter | `#677284` | `--color-pewter` | Cool gray for product photography contexts |
| Driftwood | `#dfccbe` | `--color-driftwood` | Warm beige for product photography contexts |
| Pale Tide | `#badce4` | `--color-pale-tide` | Cool pastel surface for editorial accent sections |

## Tokens — Typography

### Favorit — Brand and UI typeface · `--font-favorit`
- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 9, 12, 14, 16, 20, 30
- **Letter spacing:** 0.025em

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 14px | 1.33 | 0.35px | `--text-body` |
| heading | 20px | 1.2 | 0.5px | `--text-heading` |
| display | 30px | 1.2 | 0.75px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px · **Density:** compact · **Page max-width:** 1440px · **Section gap:** 64px

### Border Radius
- tags/cards/images: 0px
- inputs/buttons: 4px

## Components

### Ghost CTA Button
Transparent fill, 1px solid #000000 border, Carbon Ink text, Favorit 12px weight 500, 4px radius, 6px 24px padding, no shadow.

### Filled Quick Add Button
Solid #000000 fill, white text, Favorit 12px weight 500, 4px radius, 4px 10px padding.

### Product Card
Zero border-radius, 16px padding, white background. Image edge-to-edge. Swatches, name, price. No shadow.

### Top Navigation Bar
White bg, hairline bottom border. Left categories, center wordmark ADANOLA, right icons.

### Announcement Bar
Black bg, white Favorit 9px centered promo text.

### Hero Image Section
Full-bleed lifestyle photo, white Favorit 30px weight 400 headline, ghost CTA.

### Product Grid
4-column desktop, 16–24px gap, 64px section rhythm.

## Do's and Don'ts

### Do
- Use Favorit (or Inter substitute) with 0.025em tracking everywhere
- Primary actions as ghost/outlined buttons; filled black for Quick Add only
- 0px radius on cards/images; 4px only on buttons/inputs
- Let product photography provide all color; UI stays monochrome
- Compact 4px spacing + generous 64px section gaps
- Black announcement bar above nav

### Don't
- No drop shadows or box-shadow elevation
- No saturated brand colors on buttons/links
- No rounded product images or card containers
- No display serifs or decorative typefaces
- No gradients, colored section bands, decorative patterns
- No icon containers, badges, or pill shapes
- No border-radius above 4px

## Elevation
Deliberately flat — whitespace and hairlines only. Chat widget uses solid black fill, not shadow.

## Imagery
Photography-dominant editorial activewear. Zero border-radius. Hero ~16:6. No illustrations or 3D.

## Layout
Full-bleed with 1440px content max. Hero → product grids ↔ split editorial. 4-col products, 2-col editorial.

## Quick Start CSS

```css
:root {
  --color-carbon-ink: #000000;
  --color-paper-white: #ffffff;
  --color-soft-mist: #e5e7eb;
  --color-warm-fog: #f0efe7;
  --color-blush-sand: #f5ebd5;
  --color-smoke-charcoal: #333333;
  --color-onyx: #1d1d1d;
  --color-stone-gray: #cccccc;
  --color-slate: #2f3440;
  --color-olive-drab: #636355;
  --color-maroon-clay: #523037;
  --color-deep-iris: #222845;
  --color-pewter: #677284;
  --color-driftwood: #dfccbe;
  --color-pale-tide: #badce4;
  --font-favorit: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --text-body: 14px;
  --text-heading: 20px;
  --text-display: 30px;
  --spacing-unit: 4px;
  --page-max-width: 1440px;
  --section-gap: 64px;
  --radius-buttons: 4px;
  --radius-cards: 0px;
}
```
