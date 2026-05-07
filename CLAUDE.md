# Travel Companion

## Design Context

### Users
Iris and Niko — two people on a Central European trip (Prague → Vienna → Budapest). Using this on iPhones, installed as a PWA. Opening it in the moment: at a café, on the metro, before bed. Not power users — they want orientation fast, not features.

### Brand Personality
Warm, personal, intimate. This app was made for two specific people for one specific trip. It should feel like a hand-crafted travel journal, not a product. Three words: **warm, personal, grounded**.

### Emotional Goal
When opened mid-trip, the user should feel **grounded and oriented** — "everything I need is here." No anxiety, no friction, no cognitive load. The app handles logistics quietly so they can be present in the moment.

### Aesthetic Direction
- **Dark editorial** base: deep navy (`#0f1923`), warm cream (`#e8dcc8`), muted gold (`#a08060`), steel blue (`#8ab4c8`)
- Warm and place-specific in feel — closer to Airbnb's travel editorial warmth than utility-first dark UIs
- Serif type for headings evokes the old-world texture of Central European destinations
- Cards are clean with no left-border accents — modern, no AI design anti-patterns
- Always dark mode; no toggle needed

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
- IndexedDB via `idb` for offline-first storage
- PWA on iPhone — portrait orientation, touch targets, no hover states
