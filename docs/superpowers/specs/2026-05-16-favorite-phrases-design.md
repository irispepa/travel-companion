# Favorite Phrases — Design Spec

**Date:** 2026-05-16  
**Status:** Approved

## Overview

Add the ability to star individual phrases on the Phrases page. Favorited phrases sort to the top of the list. Favorites are scoped per city and persisted in IndexedDB.

## Behavior

- Each phrase row has a star icon on the right (already rendered as a decorative `StarEmpty` SVG in `PhraseRow`)
- Tapping the star toggles favorite state instantly — no animation
- Favorited star: filled terracotta (`--color-stamp`, `#c8442a`)
- Unfavorited star: outline in `--color-ink-faint`
- Favorited phrases sort to the top of the visible list, preserving relative order within each group
- Sort applies after category filter and search filter — favorites within the active category float up
- No new UI chrome: no filter chips, no labels, no empty states needed

## Data Model

Extend `UserPreferences` in `src/db/schema.ts`:

```ts
export interface UserPreferences {
  key: 'data'
  currencyPairs: Partial<Record<CityViewId, CurrencyPref>>
  favoritePhrases: Partial<Record<CityId, string[]>>  // english strings
}
```

- Keyed by `CityId` (not `CityViewId`) — phrases are city-scoped, not view-scoped
- Value is an array of `english` strings — the natural unique key for a `PhraseWord`
- No new IndexedDB object store; no DB version bump required
- Reading a missing `favoritePhrases` key returns `undefined`, treated as empty

## Repository

New functions in `src/db/repositories/userPreferences.ts`:

- `getFavoritePhrases(db, cityId): Promise<string[]>` — returns array of favorited `english` strings for the city, empty array if none
- `toggleFavoritePhrase(db, cityId, english): Promise<void>` — adds if absent, removes if present; reads then writes the full preferences record

## Hook

New `src/hooks/useFavoritePhrases.ts`:

- Accepts `cityId: CityId`
- Returns `{ favorites: Set<string>, toggle: (english: string) => void }`
- `favorites` is a `Set` for O(1) lookup during render
- `toggle` calls `toggleFavoritePhrase`, then refreshes local state
- Loads on mount via `useDb` context (same pattern as `useUserPreferences`)

## Components

**`PhraseRow`** (`src/components/sections/phrases/PhraseRow.tsx`):
- Add `isFavorite: boolean` prop
- Add `onToggle: () => void` prop
- Star renders filled terracotta when `isFavorite`, outline `--color-ink-faint` otherwise
- Star wrapped in a `<button>` (all: unset, min touch target 44px) calling `onToggle`

**`PhrasesSection`** (`src/components/sections/phrases/PhrasesSection.tsx`):
- Call `useFavoritePhrases(config.cityId)`
- After `searchPhrases` filtering, sort `words`: favorites first (stable, preserving relative order within each group)
- Pass `isFavorite` and `onToggle` to each `PhraseRow`

## Sort Logic

```ts
const sorted = [
  ...words.filter(w => favorites.has(w.english)),
  ...words.filter(w => !favorites.has(w.english)),
]
```

## Files Changed

| File | Change |
|------|--------|
| `src/db/schema.ts` | Add `favoritePhrases` field to `UserPreferences` |
| `src/db/repositories/userPreferences.ts` | Add `getFavoritePhrases`, `toggleFavoritePhrase` |
| `src/hooks/useFavoritePhrases.ts` | New hook |
| `src/components/sections/phrases/PhraseRow.tsx` | Add `isFavorite`, `onToggle` props; interactive star |
| `src/components/sections/phrases/PhrasesSection.tsx` | Wire hook, sort logic |

## Testing

- Unit tests for `getFavoritePhrases` and `toggleFavoritePhrase` in `tests/db/repositories/userPreferences.test.ts`
- Unit test for `useFavoritePhrases` hook
- Unit test for sort logic in `PhrasesSection` (can test `searchPhrases` + sort as a pure function)
