---
name: Trip Companion
description: A personal offline travel journal for two, built for one specific trip.
colors:
  paper: "#f4ede1"
  paper-deep: "#ebe2d2"
  white: "#fbf7ee"
  ink: "#1d1c1a"
  ink-soft: "#5b5751"
  ink-faint: "#9a9389"
  rule: "#d6cdb9"
  stamp: "#c8442a"
  stamp-deep: "#a8351f"
  ink-blue: "#1f3a5f"
  mustard: "#d39327"
  moss: "#5a6b3b"
typography:
  display:
    fontFamily: "'Inter Tight', 'Helvetica Neue', system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Inter Tight', 'Helvetica Neue', system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Inter Tight', 'Helvetica Neue', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "'Inter Tight', 'Helvetica Neue', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
    textTransform: "uppercase"
  caption:
    fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.2em"
    textTransform: "uppercase"
  hand:
    fontFamily: "'Caveat', cursive"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  pill: "999px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
    border: "1px solid {colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.stamp}"
    rounded: "none"
    fontSize: "13px"
    fontWeight: 500
  button-tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
    border: "1px solid {colors.ink}"
  button-tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
    border: "1px solid {colors.ink}"
  card-default:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    border: "1px solid {colors.ink}"
  card-active:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
    border: "1px solid {colors.ink}"
    boxShadow: "2px 3px 0 {colors.ink}"
  card-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    border: "1px solid {colors.ink}"
  input-default:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    border: "none"
---

# Design System: Trip Companion

## 1. Overview

**Creative North Star: "Postcard from Europe"**

The phone comes out of a pocket on a cobblestone street in Prague and the screen should look like something already found there: an aged postcard, a rubber stamp, a handwritten note tucked into a travel journal. Not a product that could be for anyone. A specific artifact made for two specific people on one specific trip.

The system is built on warm paper and near-black ink. Color is used through stamps: each city has its own accent (Prague is stamp red, Vienna is mustard, Budapest is moss green). Cards sit on white paper with a hard ink border and a slight offset shadow, the way a photograph or note sits on a journal page. The monospace font carries labels and coordinates; Inter Tight carries everything else. Caveat appears for anything handwritten: personal notes, annotations, captions.

This system explicitly rejects dark utility (cold, data-forward, anonymous) and AI-generated aesthetics (gradients, glassmorphism, hero metrics, left-stripe accents). It also rejects anything that could belong to any trip by any person. Every decision should feel that specific.

**Key Characteristics:**
- Light editorial: warm paper ground, near-black ink, white card surfaces
- Per-city stamp colors mark what is current and active — never used generically
- Cards use white paper background, 1px ink border, hard 2–3px offset shadow (no blur)
- Monospace for labels, stamps, coordinates; Inter Tight for all prose and data
- Caveat for handwritten annotations, personal notes
- Postmarks, map doodles, and pin SVGs as illustrative elements — not decoration, but place-specificity

## 2. Colors: The Paper Palette

A warm, light palette. Ink on paper, with per-city accent stamps.

### Surface
- **Paper** (`#f4ede1`): Page background. The warmest neutral, carries the journal feeling.
- **Paper Deep** (`#ebe2d2`): Section backgrounds, card alternates, input surfaces.
- **White** (`#fbf7ee`): Card surfaces and overlays. Slightly warm white — never pure `#fff`.

### Ink
- **Ink** (`#1d1c1a`): Primary text, borders, icon strokes, button fills. The single authoritative dark.
- **Ink Soft** (`#5b5751`): Secondary text, back-navigation labels, muted body copy.
- **Ink Faint** (`#9a9389`): Tertiary text, placeholders, empty states, timestamps.
- **Rule** (`#d6cdb9`): Dividers, inactive borders, subtle separators.

### City Stamp Colors
Each city has an accent used for its postmark, active state indicators, and coordinate labels. Never interchangeable; the color belongs to the place.
- **Prague / Stamp Red** (`#c8442a`): The primary stamp. Also used for active itinerary time labels and focus states.
- **Stamp Deep** (`#a8351f`): Pressed or active state of stamp red.
- **Vienna / Mustard** (`#d39327`): Vienna's stamp and pin color.
- **Budapest / Moss** (`#5a6b3b`): Budapest's stamp and pin color.
- **Ink Blue** (`#1f3a5f`): Navigation pins and landmark accents across all cities.

### Named Rules
**The Stamp Rule.** City accent colors appear in postmarks, coordinate labels, active tab states, and landmark pins for their respective city. They are not general-purpose accents. Never use stamp red for Vienna content or mustard for Prague. If a component needs an accent and you do not know which city it belongs to, use ink.

**The No Stripe Rule.** `border-left` or `border-right` greater than 1px as a colored accent stripe is prohibited on any card, list item, callout, or alert. Visual differentiation uses background tint or full 1px borders.

## 3. Typography

**Display / Prose Font:** Inter Tight (`--font-display`, `--font-sans`, `--font-serif` — all resolve to the same Inter Tight stack)
**Label / Stamp Font:** JetBrains Mono (`--font-mono`) — coordinates, stub labels, tab stamps, timestamps
**Handwritten Font:** Caveat (`--font-hand`) — personal annotations, memory captions, informal notes

**Character:** Inter Tight at large weights and tight tracking carries the editorial quality of the city dashboard: a tight `0.95` line-height `56px` city name reads like a bold editorial headline, not a UI label. JetBrains Mono in uppercase at `0.18–0.22em` letter-spacing carries coordinates and stub labels with the precision of a printed form or travel document. Caveat appears sparingly for anything meant to feel handwritten.

### Hierarchy
- **Display** (500 weight, 56px, 0.95 line-height, `-0.03em` tracking): City name on the dashboard. One per screen. The single largest text element.
- **Headline** (500 weight, 24px, 1.2 line-height, `-0.02em` tracking): Section titles ("Today", section headings).
- **Title** (500 weight, 15px, 1.4 line-height): Card titles, itinerary item names, activity names.
- **Body** (400 weight, 14px, 1.5 line-height): Descriptions, notes, phrase definitions. Max line length 65ch.
- **Label** (JetBrains Mono, 500 weight, 10px, `0.18em` tracking, uppercase): Stub card headers, coordinates, nav labels ("← TRIP", "DAY 01 / 10"). Gold or city-accent color.
- **Caption** (JetBrains Mono, 400 weight, 9–11px, `0.2em` tracking, uppercase): Timestamps, phonetic guides, "NOTHING PLANNED YET" empty states. Ink faint color.
- **Hand** (Caveat, 400 weight, 14px, 1.5 line-height): Personal notes, memory text, handwritten-feel annotations.

### Named Rules
**The Mono-for-Stamps Rule.** JetBrains Mono is used for all text that references time, coordinates, document structure, or quantity: stub labels, dates, city codes, the "DAY 01/10" counter, nav labels. Inter Tight handles everything else. Caveat is handwriting only.

**The Tight-Headline Rule.** The city name display uses `lineHeight: 0.95` and `letterSpacing: -0.03em`. This is intentional — it reads as editorial, not app. Do not relax these to default values.

## 4. Elevation and Borders

This system uses hard offset shadows, not blur-based shadows. The aesthetic is a photograph or note laid on a journal page — it has physical presence, not a diffuse drop shadow.

### Shadow Vocabulary
- **Active card / selected row** (`boxShadow: '2px 3px 0 #1d1c1a'`): The hard offset shadow. Applied to the currently active itinerary row, selected cards, and the FAB. The offset direction is always bottom-right.
- **FAB** (`boxShadow: '2px 3px 0 #1d1c1a'`): Same treatment, signals float.
- **Modal backdrop** (`rgba(0,0,0,0.6)` full-screen scrim): Used on CalculatorOverlay and AddMemorySheet.

### Border Treatment
Cards use `border: '1px solid #1d1c1a'` (ink border) on white paper background. Inactive cards use the rule color (`#d6cdb9`) for borders. The 1px ink border at rest becomes active with the offset shadow when selected.

### Named Rules
**The Hard Shadow Rule.** When a shadow is needed, use a hard 2–3px offset with zero blur: `2px 3px 0 #1d1c1a`. Never use `blur` values greater than 0 on card shadows. Gaussian blur-based shadows belong to a different aesthetic entirely.

**The Flat-By-Default Rule.** Most cards at rest have no shadow — only ink border. The offset shadow is reserved for active, selected, or floating states. Do not add resting shadows.

## 5. Components

### Buttons

- **Primary / Tab active** (ink fill): `background: #1d1c1a; color: #f4ede1; border: 1px solid #1d1c1a; border-radius: 999px; padding: 7px 14px; font-size: 13px; font-weight: 500`. Used for active tab pills, confirm actions.
- **Tab inactive**: `background: transparent; color: #1d1c1a; border: 1px solid #1d1c1a; border-radius: 999px; padding: 7px 14px`. Same shape, no fill.
- **Ghost / Secondary**: `color: #c8442a; font-size: 13px; font-weight: 500; background: transparent`. Used for "Edit →" links, secondary navigational actions. Stamp red, no border.
- **Navigation text**: `font-family: JetBrains Mono; font-size: 11px; letter-spacing: 0.16em; color: #5b5751`. Used for "← TRIP" back navigation.
- **Focus:** `outline: 2px solid #c8442a; outline-offset: 2px` via `:focus-visible`.
- **Minimum touch target:** 44×44px on all interactive elements.

### Cards / Containers

Cards are paper on paper. White surface, ink border, occasional hard shadow.

- **Default**: `background: #fbf7ee; border: 1px solid #1d1c1a; border-radius: 10px; padding: 10px 12px`
- **Active / selected**: adds `box-shadow: 2px 3px 0 #1d1c1a`
- **Dark variant** (for stub cards): `background: #1d1c1a; color: #f4ede1; border: 1px solid #1d1c1a; border-radius: 10px`
- **Inactive**: `border: 1px solid #d6cdb9` (rule color, not ink)
- **No** border-left accents. No shadows on resting cards (unless active).

### Stub Cards (Dashboard)

Three-column grid on the city dashboard: Weather, FX rate, Next Up. Small format info cards.

- One uses the dark variant (inverted: ink background, paper text) — typically the FX rate as the most frequently consulted value.
- Label row: JetBrains Mono, 9px, `0.18em` tracking, `opacity: 0.7`
- Value: Inter Tight, 22px, 500 weight, `lineHeight: 1`, `-0.02em` tracking
- Sub-label: 11px, `opacity: 0.7`

### Postmark Component

A circular stamp shape used on the city dashboard. Per-city accent color, slightly rotated (~-9deg), with a dashed inner ring.

- `width: 62px; height: 62px; border-radius: 50%; border: 1.5px solid {cityColor}; transform: rotate(-9deg); opacity: 0.82`
- Inner ring: `position: absolute; inset: 4px; border-radius: 50%; border: 1px dashed {cityColor}; opacity: 0.5`
- City code (uppercase, JetBrains Mono, 8px, `0.18em` tracking) + thin divider + date (7px)

### Map Doodle

An inline SVG illustration used as the city map thumbnail on the dashboard. Elements:
- Hatched paper-texture background pattern (`#dfd6c2` with `#c8bfa8` dots)
- River path in city-specific blue-grey
- Stylized street lines in `#a89e85`
- Location pins using city accent colors
- North arrow (compass rose, minimal)
- "OPEN IN MAPS" button overlaid at bottom-left: white pill button, ink border, JetBrains Mono 10px

### Plan Row (Itinerary)

Each itinerary item is a horizontal row card.

- Inactive: `border: 1px solid #d6cdb9; border-radius: 10px; padding: 12px 14px`
- Active: `border: 1px solid #1d1c1a; box-shadow: 2px 3px 0 #1d1c1a; background: #fbf7ee`
- Done: `opacity: 0.55` with line-through on title
- Time column: JetBrains Mono, 12px, 600 weight; active time uses stamp red (`#c8442a`)
- Title: Inter Tight, 15px, 500 weight
- Location sub-label: 12px, ink-soft

### Tab Pills (Navigation)

Horizontal scrolling pill row used for section navigation (What to do / What to say / Itinerary / Memories).

- `overflow-x: auto; -webkit-overflow-scrolling: touch`; no visible scrollbar
- Gap: 6px between pills
- Pill shape: `border-radius: 999px`
- Active: ink fill. Inactive: transparent with ink border.
- Font: Inter Tight, 13px, 500 weight

### City Selector

The home screen. Each city is a full-width card with the city name as a large display headline, a postmark, and a short italic tagline.

- City name: Inter Tight, display size, with per-city emphasis
- Postmark: rotated, city-accent color
- Tagline: Inter Tight, 13px, italic, ink-soft
- Navigation: JetBrains Mono, 10px, tracked uppercase for coordinate labels and city codes

### Sheet Overlays (Calculator, Add Memory)

Bottom sheets slide up from the page bottom.

- **Background:** Paper (`#f4ede1`), not white
- **Border radius:** 16px top corners only (`border-radius: 16px 16px 0 0`)
- **Backdrop:** `rgba(0,0,0,0.6)` full-screen scrim; tap outside to dismiss
- **Accessibility:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`; focus trapped on open; focus returns to trigger on close

### Inputs / Fields

- `background: #ebe2d2; border-radius: 6px; padding: 10px 14px; color: #1d1c1a; border: none`
- Focus: global `:focus-visible` outline (stamp red, 2px)
- Placeholder: ink-faint (`#9a9389`)
- Currency amount input: 24px, for legibility while typing

## 6. Do's and Don'ts

### Do:
- **Do** use `border: 1px solid #1d1c1a` on active cards and `border: 1px solid #d6cdb9` on resting cards.
- **Do** use the hard offset shadow `box-shadow: 2px 3px 0 #1d1c1a` only for active, selected, or floating states.
- **Do** use JetBrains Mono for all labels that reference time, coordinates, document structure, or quantities.
- **Do** use Inter Tight for all prose, headings, card titles, and body copy.
- **Do** use Caveat only for genuinely handwritten-feeling text: memory captions, personal annotations.
- **Do** use per-city accent colors (stamp red, mustard, moss) only for that city's content: postmark, coordinate label, pins, active states within that city.
- **Do** ensure every interactive element has a minimum 44×44px touch target on iPhone.
- **Do** apply `outline: 2px solid #c8442a; outline-offset: 2px` to `:focus-visible` on every interactive element.
- **Do** add `paddingBottom: 80px` to any scrollable list that has a fixed FAB above it.
- **Do** respect `prefers-reduced-motion` by wrapping all transitions in a motion query.
- **Do** use `role="dialog"`, `aria-modal="true"`, and a focus trap on every sheet overlay.
- **Do** use warm paper (`#f4ede1`) as the page background and white (`#fbf7ee`) as the card surface.

### Don't:
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any card, list item, callout, or alert.
- **Don't** use gradient text (`background-clip: text`). Emphasis via weight or size only.
- **Don't** use glassmorphism, backdrop-blur, or semi-transparent card surfaces decoratively.
- **Don't** use Gaussian blur-based shadows on cards. Hard offset or nothing.
- **Don't** use stamp red (`#c8442a`) generically as an accent. It belongs to Prague and to primary actions only.
- **Don't** use `opacity: 0.4` to de-emphasize disabled content. Use ink-faint (`#9a9389`) instead — opacity at that level fails WCAG AA contrast.
- **Don't** design anything that could belong to any trip by any person. If a screen could be from TripAdvisor, it has failed.
- **Don't** make the interface dark. This is a light-mode-only system. The paper feel depends on warm off-white backgrounds.
- **Don't** introduce new color tokens. Use existing ones from `src/styles/tokens.css`.
- **Don't** use pure `#000` or `#fff`. The warmest dark is `#1d1c1a` (ink); the warmest white is `#fbf7ee` (white token).
- **Don't** use index as a React key on filtered or reordering lists. Use stable content identifiers.
