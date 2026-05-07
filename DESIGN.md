---
name: Trip Companion
description: A personal offline travel journal for two, built for one specific trip.
colors:
  deep-navy: "#0f1923"
  dark-card: "#1a2a3a"
  darker-card: "#152030"
  warm-cream: "#e8dcc8"
  muted-gold: "#a08060"
  steel-blue: "#8ab4c8"
  muted-slate: "#5a6a7a"
  dim-overlay: "rgba(232, 220, 200, 0.35)"
typography:
  display:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  headline:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.3
  title:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  pill: "20px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.muted-gold}"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.md}"
    padding: "16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-gold}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  button-tab:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  button-tab-active:
    backgroundColor: "{colors.muted-gold}"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  card-default:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.md}"
    padding: "16px"
  card-alt:
    backgroundColor: "{colors.darker-card}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.md}"
    padding: "16px"
  input-default:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
---

# Design System: Trip Companion

## 1. Overview

**Creative North Star: "The Evening Dispatch"**

This is an interface designed for a specific evening in a foreign city. The phone comes out of a pocket in Prague or Budapest, the screen wakes, and what appears should feel like consulting a well-made thing: quiet, warm, already familiar. Not a product. Not a utility dashboard. Something closer to a late-night dispatch from a correspondent who knows this city and knows you.

The system is built on deep navy and warm cream, with muted gold used sparingly to mark what matters. Georgia serif carries the headings because it carries history without trying. The sans-serif handles data and labels with clean restraint. The contrast between them is the primary typographic gesture: warmth above, precision below.

This system explicitly rejects the following: the impersonal density of TripAdvisor and Google Trips, the cold efficiency of utility dark UIs like Citymapper, and every tell of AI-generated aesthetics (purple gradients, glassmorphism, card grids with icons and identical structure, left-stripe accents). It also rejects anything that could belong to any trip by any person. This was made for two people for one trip. Every decision should feel that specific.

**Key Characteristics:**
- Dark editorial: deep navy ground, warm cream text, gold used at most 10% per screen
- Serif headings carry place and time; sans-serif carries data and instruction
- Cards are the workhorse container but they do not dominate; spacing creates breathing room between them
- No decorative borders, no gradient overlays, no glassmorphism
- Motion is native-feeling: sheet slides, content fades, nothing bounces

## 2. Colors: The Evening Palette

A dark, warm palette rooted in navy with cream and gold as the light source.

### Primary
- **Deep Navy** (`#0f1923`): The ground. Page background, header background, the surface everything sits on. Never pure black; tinted toward blue to keep it from feeling harsh.
- **Muted Gold** (`#a08060`): The signal color. Used for labels, date headers, active states, the FAB, and primary actions. Never used decoratively. Its restraint makes it meaningful.

### Secondary
- **Steel Blue** (`#8ab4c8`): Links and navigation actions only. Cooler than gold to distinguish informational links from interactive actions.

### Neutral
- **Warm Cream** (`#e8dcc8`): Primary text color. Tinted warm to work with the navy background without cold blue-white harshness.
- **Dark Card** (`#1a2a3a`): Card and container backgrounds. Lighter than the page ground to create layering without shadows.
- **Darker Card Alt** (`#152030`): Secondary card variant, inputs, and nested surfaces. Slightly darker than the card ground.
- **Muted Slate** (`#5a6a7a`): Secondary text, captions, placeholder text. Cool, receding, never used for primary content.
- **Dim Overlay** (`rgba(232, 220, 200, 0.35)`): Modal backdrop text treatment only.

### Named Rules
**The Gold Restraint Rule.** Muted gold appears on at most 10% of any given screen's surface area. Its rarity is what makes it readable as a signal. Date headers, active chips, the FAB, primary CTA buttons: those are its homes. Decorative use anywhere else is prohibited.

**The No Stripe Rule.** `border-left` or `border-right` greater than 1px as a colored accent stripe is prohibited on any card, list item, callout, or alert. If visual differentiation is needed, use background tint (`darker-card`) or a full border at 1px opacity.

## 3. Typography

**Display / Heading Font:** Georgia (with `'Times New Roman', serif` fallback)
**Body / UI Font:** -apple-system, BlinkMacSystemFont (system sans-serif stack)
**Label Font:** Same system sans, smaller scale with tracked letterSpacing

**Character:** Georgia brings old-world editorial gravity to city names, section headers, and day labels. The system sans-serif keeps data, captions, and UI chrome legible and unobtrusive. The pairing works because they occupy separate registers: warmth above, precision below.

### Hierarchy
- **Display** (400 weight, 28px, 1.2 line-height): City names on the selector screen. The largest text in the interface; appears once per screen at most.
- **Headline** (400 weight, 20px, 1.3): Section titles within city views ("What to Do", "Memories"). Marks the top of a content section.
- **Title** (400 weight, 17px, 1.4 serif): Card titles, itinerary item names, phrase words. The primary piece of information in any list row.
- **Body** (400 weight, 14px, 1.5 sans): Notes, descriptions, phrase definitions, memory text. Max line length 65ch.
- **Label** (400 weight, 12px, 0.08em tracking, sans): Gold-colored data labels, currency codes, category tabs. Often uppercase or small-caps treatment.
- **Caption** (400 weight, 11px, 0.1em tracking, sans): Timestamps, phonetic guides, travel notes. Muted slate color. Recedes.

### Named Rules
**The Two-Register Rule.** Serif is for place, time, and meaning (city names, day headers, card titles, phrase words). Sans-serif is for data, instruction, and navigation (notes, labels, timestamps, button text). Never mix: a button is never serif, a city name is never sans.

**The Flat Scale Rule.** The type scale must have at least a 1.25 ratio between adjacent levels. Display (28px) to Headline (20px) is 1.4. Headline (20px) to Title (17px) is 1.18 — this is the weak link. When refining, push Title to 16px or Headline to 22px to restore the ratio.

## 4. Elevation

This system is flat by default. No shadows appear on cards at rest. Depth is conveyed through tonal layering: page ground (`deep-navy`) is the darkest surface; cards (`dark-card`) are lighter; inputs and nested surfaces (`darker-card-alt`) are in between. The three tones create a clear hierarchy without any shadow.

Shadows appear only in two contexts: the floating action button (FAB) in the Memories section, which is elevated by definition as a persistent floating control, and modal sheet overlays (calculator, add memory), which use a dark translucent backdrop (`rgba(0,0,0,0.7)`) to separate the sheet from the content beneath.

### Shadow Vocabulary
- **FAB shadow** (`0 4px 12px rgba(0,0,0,0.3)`): Used only on the Memories `+` button. Lifts the persistent floating action above the content plane.
- **Modal backdrop** (`rgba(0,0,0,0.7)` full-screen overlay): Used on CalculatorOverlay and AddMemorySheet. Not a shadow; a scrim.

### Named Rules
**The Flat-By-Default Rule.** Cards do not have shadows at rest, hover, or focus. Tonal difference between `deep-navy` and `dark-card` provides all necessary depth. If you reach for a box-shadow on a card, the answer is a background color change, not a shadow.

## 5. Components

### Buttons
Buttons are quiet. They don't compete with content. Only the FAB and the primary save action use the gold background.

- **Shape:** Gently rounded (10px radius for primary; 20px pill for tab/chip buttons)
- **Primary** (gold fill): `background: #a08060; color: #0f1923; padding: 16px; border-radius: 10px`. Used for Save Memory, primary form submission. Rare.
- **Ghost** (no background): `color: #a08060; font-size: 13px`. Used for Edit/Done toggles, Google Translate link, section-level secondary actions.
- **Tab / Chip** (toggle): `background: #1a2a3a; color: #e8dcc8; border-radius: 20px; padding: 4px 12px` at rest. Active state: `background: #a08060; color: #0f1923`.
- **Focus:** `outline: 2px solid #a08060; outline-offset: 2px` via `:focus-visible`. Applied globally.
- **Minimum touch target:** 44×44px on all interactive elements.

### Cards / Containers
Cards are the primary content container. They do not have borders, shadows, or left-stripe accents.

- **Corner Style:** Gently rounded (10px / `--radius-md`)
- **Default Background:** Dark Card (`#1a2a3a`)
- **Alt Background:** Darker Card Alt (`#152030`) for inputs and secondary surfaces
- **Shadow Strategy:** None (see Elevation)
- **Border:** None. No `border-left` accents. Never.
- **Internal Padding:** 16px (`--space-md`) standard; 24px (`--space-lg`) for dashboard section cards

### Inputs / Fields
Inputs are embedded in the surface. They use the darker alt background to read as recessed.

- **Style:** No border, `background: #152030; border-radius: 6px; padding: 10px 14px; color: #e8dcc8`
- **Focus:** Inherit global `:focus-visible` outline (gold, 2px)
- **Placeholder:** Muted slate (`#5a6a7a`)
- **Font size:** 14px body for text inputs; 24px for currency amount inputs (large for legibility while typing)

### Navigation / App Shell
The header is a single row: back arrow (left), city name centered in serif (display/headline size), calculator icon (right). Background is the page ground color, separated from content by a 1px border in dark-card color.

- **Back button:** Gold chevron/arrow, minimum 44×44px touch target
- **City name:** Georgia serif, 18px, cream, letterSpacing 1px
- **Calculator button:** Gold icon, minimum 44×44px touch target
- **Bottom clearance:** 88px padding-bottom on scrollable content areas to clear fixed FABs

### Sheet Overlays (Calculator, Add Memory)
Bottom sheets slide up from the page bottom. They do not use the full screen; they stop where content ends, with a rounded top edge.

- **Background:** Page ground (`#0f1923`), not a card color
- **Border radius:** 16px top corners only (`border-radius: 16px 16px 0 0`)
- **Backdrop:** `rgba(0,0,0,0.7)` full-screen scrim; tap outside to dismiss
- **Accessibility:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the sheet heading; focus trapped on open; focus returns to trigger on close

### Category Tabs (Phrases section)
Horizontal scrolling pill row. "All" tab always first. Active tab uses gold fill; inactive uses dark-card fill.

- **Overflow:** `overflow-x: auto`; no scrollbar visible; `-webkit-overflow-scrolling: touch`
- **Pill shape:** 20px border-radius
- **Spacing:** 8px gap between pills

### Signature Component: Day Group Header (Itinerary)
Date labels above itinerary day groups are the clearest application of the gold label treatment. Small, tracked, uppercase, gold on navy.

- `font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #a08060`
- Margin bottom 8px before first card in the group
- Margin bottom 24px after last card before next group

## 6. Do's and Don'ts

### Do:
- **Do** use `border-radius: 10px` (`--radius-md`) on all cards and primary interactive containers.
- **Do** use muted gold (`#a08060`) for date headers, active states, the FAB, and primary save actions — and nowhere else.
- **Do** use Georgia serif for all city names, section headings, day labels, card titles, and phrase words.
- **Do** use the system sans-serif for all notes, captions, timestamps, labels, tab text, and button text.
- **Do** ensure every interactive element has a minimum 44×44px touch target on iPhone.
- **Do** apply `outline: 2px solid #a08060; outline-offset: 2px` to `:focus-visible` on every interactive element.
- **Do** add `paddingBottom: 88px` to any scrollable list that has a fixed FAB above it.
- **Do** respect `prefers-reduced-motion` by wrapping all transitions in a motion query.
- **Do** use `role="dialog"`, `aria-modal="true"`, and a focus trap on every sheet overlay.
- **Do** use tonal layering (page ground → card → input) instead of shadows to convey depth.

### Don't:
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any card, list item, callout, or alert. This is the most common AI design tell in this palette; refuse it without exception.
- **Don't** use gradient text (`background-clip: text` with a gradient). Use a single solid color. Emphasis via weight or size only.
- **Don't** use glassmorphism, backdrop-blur, or semi-transparent card surfaces decoratively.
- **Don't** design anything that could belong to any trip by any person. If a screen could be from TripAdvisor, it has failed.
- **Don't** use box-shadows on cards at rest. The flat tonal system is the depth model; shadows signal floating elements only (FAB, modal backdrops).
- **Don't** use `opacity: 0.4` to de-emphasize past or disabled content. Use `color: #5a6a7a` (muted slate) instead — opacity at that level fails WCAG AA contrast.
- **Don't** use the Bitcoin symbol (`₿`) for the currency calculator button. Use a neutral exchange icon.
- **Don't** use index as a React key on filtered or reordering lists. Use stable content identifiers.
- **Don't** make section headers (h2) the same size as the app shell city label (h1). Display (28px) is for city names; Headline (20px) is for section titles; they must be visually distinct.
- **Don't** build anything that looks like a dark utility dashboard (Citymapper, Datadog, Grafana). Cold, dense, high-contrast. The opposite of this.
