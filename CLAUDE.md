# Travel Companion

## Design Context

### Users
Iris and Niko — two people on a Central European trip (Prague → Vienna → Budapest). Using this on iPhones, installed as a PWA. Opening it in the moment: at a café, on the metro, before bed. Not power users — they want orientation fast, not features.

### Brand Personality
Warm, personal, intimate. This app was made for two specific people for one specific trip. It should feel like a hand-crafted travel journal, not a product. Three words: **warm, personal, grounded**.

### Emotional Goal
When opened mid-trip, the user should feel **grounded and oriented** — "everything I need is here." No anxiety, no friction, no cognitive load. The app handles logistics quietly so they can be present in the moment.

### Aesthetic Direction
- **Light editorial** base: warm paper (`#f4ede1`), deep paper (`#ebe2d2`), near-black ink (`#1d1c1a`), stamp red (`#c8442a`)
- Feels like a hand-made travel journal — aged paper, rubber stamps, handwritten notes, polaroid photos
- Serif-adjacent: Inter Tight for display, JetBrains Mono for labels/stamps, Caveat for handwritten elements
- Cards use white paper background, 1px ink border, hard 2–3px offset shadow (no blur) — scrapbook aesthetic
- Light mode only; the paper feel depends on warm off-white backgrounds

### Design Principles
1. **Warmth over precision** — Prefer rounded corners, warm tones, and generous spacing over tight, data-dense layouts
2. **Hierarchy first** — Every screen should have one clear focal point; secondary info recedes naturally
3. **Motion with purpose** — Transitions and micro-interactions should feel native and unhurried, not flashy
4. **Personal, not generic** — City names, day labels, and place-specific details should feel handpicked, not templated
5. **Invisible infrastructure** — Offline capability, data persistence, and loading states should be seamless and never interrupt the experience

### Polish Priorities (in order)
1. Typography & visual hierarchy — sizing scale, rhythm between sections
2. Animations & transitions — page changes, micro-interactions that feel native to iOS

### Tech Constraints
- React 19 + TypeScript + Vite, no component library
- All styles are inline React styles using CSS custom properties from `src/styles/tokens.css`
- IndexedDB via `idb` for offline-first storage, DB currently at **version 2**
- PWA on iPhone — portrait orientation, touch targets, no hover states

### Key Design Tokens (from `src/styles/tokens.css`)
- Colors: `--color-paper` `--color-paper-deep` `--color-ink` `--color-ink-soft` `--color-ink-faint` `--color-rule` `--color-stamp` `--color-white`
- Fonts: `--font-display` (Inter Tight) · `--font-mono` (JetBrains Mono) · `--font-hand` (Caveat)
- Spacing: `--space-xs/sm/md/lg/xl/2xl/3xl` (4pt scale)
- Do not introduce new color tokens — use existing ones

## Development

### Local dev server
```bash
npm run dev
```
Service worker does not run in dev mode — offline support requires a production build.

### Test on iPhone (local network)
```bash
npm run build && npx vite preview --host
```
Opens at `http://192.168.4.32:4173` (IP may vary). Only works while phone is on the same wifi — not suitable for offline testing.

### Run tests
```bash
npm test
```

## Deployment

The app is deployed to GitHub Pages at `https://irispepa.github.io/travel-companion/`.

The repo must be **public** for GitHub Pages to serve. Workflow:
1. Make repo public
2. `npm run deploy` — builds and pushes to `gh-pages` branch
3. Wait ~1 minute for Pages to update
4. Install PWA on iPhones from `https://irispepa.github.io/travel-companion/` in Safari
5. Make repo private again

Once installed, the PWA works fully offline (except currency conversion). Reinstalling requires making the repo public again.
