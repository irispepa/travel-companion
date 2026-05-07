# Impeccable Audit — Travel Companion PWA

_Audited: 2026-05-06_

---

## Anti-Patterns Verdict

**Pass — does NOT look AI-generated.** The dark editorial aesthetic is intentional and consistent. No purple gradient on white, no glassmorphism, no hero metrics, no card grid with fake data. The navy/cream/gold palette is restrained and purposeful. The main AI-slop risk is `Georgia` serif — it's the default "editorial serif" choice and feels slightly generic — but it's not disqualifying given the constraints.

One concern: the `InfoCard` component (phrases section) has a **left gold border accent** — the design spec explicitly calls these out as an anti-pattern to avoid. It appears inconsistently (only on `InfoCard` and the storage warning), which makes it feel like an accident rather than a system.

---

## Executive Summary

| Severity | Count |
|---|---|
| Critical | 2 |
| High | 7 |
| Medium | 8 |
| Low | 5 |

**Top issues:**
1. All interactive `<button>` elements have no focus indicator — keyboard/assistive navigation is broken
2. Modal overlays (`CalculatorOverlay`, `AddMemorySheet`) missing `role="dialog"`, `aria-modal`, and focus trap
3. No loading or empty states in data sections — blank screens on first load

**Overall quality:** Solid foundation, thoughtful tokens, well-structured. Main gaps are accessibility (focus management, ARIA) and the complete absence of transitions/loading states.

---

## Detailed Findings

### Critical

**[C1] Missing focus indicators on all interactive elements**
- **Location:** `global.css` + every component with `<button>`
- **Category:** Accessibility
- **Description:** `global.css` does not define `:focus-visible` styles. No component adds focus rings. All 20+ buttons render invisibly when focused.
- **Impact:** Keyboard and switch-access users cannot determine which element is focused. Completely breaks non-touch navigation.
- **WCAG:** 2.4.7 Focus Visible (AA)
- **Fix:** Add `:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; }` to global.css
- **Command:** `/harden`

**[C2] Modal overlays missing role, aria-modal, and focus trap**
- **Location:** `CalculatorOverlay.tsx`, `AddMemorySheet.tsx`
- **Category:** Accessibility
- **Description:** Both modals are plain `<div>` elements. No `role="dialog"`, no `aria-modal="true"`, no `aria-labelledby`. Focus is not trapped — tabbing exits the modal. No programmatic focus on open.
- **Impact:** Screen reader users are not informed a dialog opened; focus leaks to background content.
- **WCAG:** 4.1.2 Name, Role, Value (A); 2.1.2 No Keyboard Trap (A)
- **Fix:** Add `role="dialog" aria-modal="true" aria-labelledby="dialog-title"` + focus trap logic on mount
- **Command:** `/harden`

---

### High

**[H1] No loading state in any data section**
- **Location:** `ActivitiesSection`, `ItinerarySection`, `PhrasesSection`, `MemoriesSection`
- **Category:** Accessibility / UX
- **Description:** All hooks load from IndexedDB asynchronously. No loading flag is surfaced — the list renders as empty until data arrives.
- **Impact:** First open shows blank content. Users cannot distinguish "loading" from "no data." Particularly jarring in Memories (shows "No memories yet" before data loads).
- **Fix:** Each hook should return `isLoading: boolean`; sections show a skeleton or spinner while true
- **Command:** `/harden`

**[H2] Touch targets below 44×44px**
- **Location:** Multiple components
- **Description:** The following elements are too small for reliable touch:
  - `AppShell` back/calculator buttons: `fontSize: 20` with no explicit height/width — likely ~28×28px
  - `CategoryTabs` buttons: `padding: '4px 12px'` — approximately 28px tall
  - `ItineraryCardEdit` up/down arrows: no padding at all — ~20×20px
  - `MemoryEntry` delete button `×`: `fontSize: 14`, no padding — ~20×20px
- **Impact:** Missed taps on iPhone, especially for small fingers or motion impairment.
- **WCAG:** 2.5.5 Target Size (AAA); Apple HIG minimum 44pt
- **Fix:** Add `minHeight: 44, minWidth: 44` + padding to affected buttons
- **Command:** `/harden`

**[H3] `InfoCard` left-border accent violates design spec**
- **Location:** `InfoCard.tsx:6`, `MemoriesSection.tsx` storage warning
- **Category:** Theming / Anti-pattern
- **Description:** `borderLeft: '3px solid var(--color-gold)'` — design spec explicitly states "Clean, no left-border accents."
- **Impact:** Visual inconsistency; makes these cards look like a different component system.
- **Fix:** Remove left borders; background color differentiation (`var(--color-bg-card-alt)`) already handles the visual separation
- **Command:** `/normalize`

**[H4] Calculator button icon is semantically wrong**
- **Location:** `AppShell.tsx:15`
- **Description:** The calculator button uses `₿` (Bitcoin symbol). The `aria-label="calculator"` is correct but the visible glyph communicates "crypto" not "currency calculator."
- **Impact:** Sighted users will be confused.
- **Fix:** Use a neutral icon (`⇄`, or an SVG) or `🧮` if emoji is acceptable
- **Command:** Direct edit

**[H5] `<select>` elements unstyled on iOS**
- **Location:** `ActivitiesSection.tsx` sort select, `CurrencyPicker.tsx`
- **Description:** iOS Safari renders native `<select>` in system style (light gray pill) and ignores background-color unless `appearance: none` is set.
- **Impact:** Sort dropdown and currency picker will look broken on iPhone.
- **Fix:** Add `WebkitAppearance: 'none', appearance: 'none'` and force background color
- **Command:** `/normalize`

**[H6] Index used as React key in phrase lists**
- **Location:** `PhrasesSection.tsx` — `words.map((w, i) => <PhraseCard key={i} ...>)` and `info.map`
- **Description:** Index-as-key causes incorrect reconciliation when the list reorders on category filter change.
- **Fix:** Use `w.english` or a stable ID as key
- **Command:** Direct edit

**[H7] Memory photos have empty alt text**
- **Location:** `MemoryEntry.tsx:20`
- **Description:** `alt=""` treats photos as decorative. These are user-captured memories — the primary content of the entry.
- **Impact:** Screen readers skip the images entirely; content is lost.
- **WCAG:** 1.1.1 Non-text Content (A)
- **Fix:** Use `alt={entry.note || 'Memory photo'}`
- **Command:** `/harden`

---

### Medium

**[M1] No transitions or animations anywhere**
- **Location:** All components
- **Category:** UX / Motion
- **Description:** No CSS transitions on expand/collapse (ActivityRow), no sheet slide-up animation on modals, no page transitions.
- **Impact:** App feels abrupt and non-native on iPhone. Top stated polish priority.
- **Fix:** Sheet overlays: `transform: translateY` + `transition`; expand/collapse: height animation; page changes: view transitions API
- **Command:** `/animate`

**[M2] Typography scale is flat and inconsistent**
- **Location:** All section headers, card content
- **Description:** Section h2s are `fontSize: 18` across all sections. Card titles range 15–20px with no system. `AppShell` h1 is also 18px — same as section headers below it. No clear visual hierarchy.
- **Impact:** Pages lack visual anchoring; the eye has no clear entry point.
- **Fix:** Establish a scale: display 24+, section 20, card 17, body 14, caption 12. Apply consistently.
- **Command:** `/normalize` then `/polish`

**[M3] Calculator rate info not announced to screen readers**
- **Location:** `CalculatorOverlay.tsx:38`
- **Description:** The offline rate message is a `<p>` with no live region association.
- **Fix:** Add `role="status"` so screen readers announce it when it appears
- **Command:** `/harden`

**[M4] `CityMap` reads `navigator.onLine` synchronously on render**
- **Location:** `CityMap.tsx:7`
- **Description:** No event listener for `online`/`offline` events. If device goes offline after mount, the iframe stays visible. `navigator.onLine` can also return `true` on captive portals.
- **Fix:** Add `useEffect` with `online`/`offline` listeners to update state
- **Command:** `/harden`

**[M5] Hard-coded pixel values mixed with token variables**
- **Location:** Throughout codebase
- **Description:** `margin: '8px 0'`, `gap: 8`, `gap: 16`, `padding: '12px 16px'`, `height: 180`, `bottom: 24, right: 24` — all bypass the spacing token system.
- **Impact:** Global spacing adjustments are fragile.
- **Fix:** Replace with `var(--space-*)` tokens; add `--space-2xl` if needed
- **Command:** `/normalize`

**[M6] `<label aria-label>` misuse in AddMemorySheet**
- **Location:** `AddMemorySheet.tsx:40`
- **Description:** `aria-label` on a `<label>` element is incorrect. The textarea should be linked via `htmlFor`/`id`.
- **Fix:** Add `htmlFor="memory-note"` on label, `id="memory-note"` on textarea
- **Command:** `/harden`

**[M7] Viewport meta tag — text scaling risk**
- **Location:** `index.html`
- **Description:** If viewport includes `user-scalable=no` or `maximum-scale=1`, iOS users cannot zoom.
- **WCAG:** 1.4.4 Resize Text (AA)
- **Fix:** Ensure `<meta name="viewport" content="width=device-width, initial-scale=1">` with no scale restrictions
- **Command:** `/harden`

**[M8] FAB overlaps scrollable content in MemoriesSection**
- **Location:** `MemoriesSection.tsx`
- **Description:** The `+` FAB is `position: fixed, bottom: 24`. No bottom padding on the list — last entry scrolls behind the button.
- **Fix:** Add `paddingBottom: 88` to the list container
- **Command:** `/polish`

---

### Low

**[L1] `₿` icon renders inconsistently across emoji fonts** — see H4

**[L2] `Georgia` is the default editorial serif — slightly generic**
- **Location:** `tokens.css`
- **Description:** For a warm personal travel app, `Iowan Old Style` (available on iOS) would feel more considered and distinctive.
- **Command:** `/normalize` or direct token edit

**[L3] `opacity: 0.4` on past itinerary items fails contrast**
- **Location:** `ItineraryCard.tsx:8`
- **Description:** Cream on navy at 40% opacity ≈ 2:1 contrast ratio. Below WCAG AA (4.5:1).
- **Fix:** Use `color: var(--color-muted)` instead of opacity reduction
- **WCAG:** 1.4.3 Contrast (AA)
- **Command:** `/harden`

**[L4] Star badge renders empty if priority is 0**
- **Location:** `ActivityRow.tsx`
- **Description:** `'★'.repeat(0)` produces an empty string with no fallback.
- **Fix:** Fallback to `'—'` if priority is 0

**[L5] `isOffline` label is semantically imprecise**
- **Location:** `CalculatorOverlay.tsx`
- **Description:** `isOffline` in the rate hook likely means "used cached data" not "device is offline." Label should reflect that.

---

## Patterns & Systemic Issues

1. **Hard-coded px values in 15+ locations** — spacing token system exists but isn't enforced
2. **Touch targets universally undersized** — every icon-only button and tab pill is below 44px
3. **No focus indicators on any interactive element** — global.css has no `:focus-visible` rule
4. **No transitions anywhere** — consistent absence; a single `/animate` pass addresses the whole app
5. **Index-as-key in two list renders** — will cause reconciliation bugs on filter/search changes

---

## Positive Findings

- Token system is solid — colors and radii consistently referenced via `var()`
- ARIA labels on all icon buttons (`back`, `calculator`, `add memory`, `delete memory`)
- Offline fallback in CityMap — correct in intent
- Image compression on memory upload — proactively handles storage constraints
- `rel="noopener noreferrer"` on all external links
- `loading="lazy"` on map iframe
- Storage quota warning — thoughtful edge case

---

## Recommended Priority

**Immediate:**
1. Add `:focus-visible` outline to global.css — 2 lines, fixes C1 globally
2. Fix touch target sizes on icon buttons and tabs
3. Remove left-border accents from InfoCard/storage warning

**Short-term:**
4. Add `role="dialog"` + focus trap to both modals
5. Fix `<select>` appearance on iOS
6. Fix past-item contrast (opacity → muted color)
7. Add paddingBottom to memory list to clear FAB
8. Fix index-as-key in PhrasesSection

**Medium-term (design polish):**
9. Establish and apply consistent type scale
10. Add sheet slide-up + expand/collapse transitions
11. Add loading states to data hooks
12. Fix CityMap online detection

**Long-term:**
13. Consider `Iowan Old Style` serif font
14. Replace `₿` calculator icon

---

## Suggested Commands

| Command | Addresses |
|---|---|
| `/harden` | C1, C2, H1, H2, H7, M3, M4, M6, M7, L3 |
| `/normalize` | H3, H5, M2, M5 |
| `/animate` | M1 (entire app) |
| `/polish` | M8, typography rhythm |
| Direct edits | H4 (icon), H6 (keys), L4 (star fallback) |
