import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { makeTestWrapper } from '../helpers/testWrapper'
import { useFavoritePhrases } from '../../src/hooks/useFavoritePhrases'
import { openAppDB } from '../../src/db/client'

beforeEach(async () => {
  const db = await openAppDB()
  try {
    await db.clear('userPreferences')
  } catch {
    // Ignore errors if store doesn't exist yet
  }
})

describe('useFavoritePhrases', () => {
  it('returns empty Set on first load', async () => {
    const { result } = renderHook(() => useFavoritePhrases('prague'), { wrapper: makeTestWrapper() })
    await waitFor(() => expect(result.current.favorites).toBeDefined(), { timeout: 10000 })
    expect(result.current.favorites.size).toBe(0)
  })

  it('adds a phrase when toggled', async () => {
    const { result } = renderHook(() => useFavoritePhrases('prague'), { wrapper: makeTestWrapper() })
    await waitFor(() => expect(result.current.toggle).toBeDefined(), { timeout: 10000 })
    await act(async () => { await result.current.toggle('Thank you') })
    expect(result.current.favorites.has('Thank you')).toBe(true)
  })

  it('removes a phrase on second toggle', async () => {
    const { result } = renderHook(() => useFavoritePhrases('prague'), { wrapper: makeTestWrapper() })
    await waitFor(() => expect(result.current.toggle).toBeDefined(), { timeout: 10000 })
    await act(async () => { await result.current.toggle('Thank you') })
    await act(async () => { await result.current.toggle('Thank you') })
    expect(result.current.favorites.has('Thank you')).toBe(false)
  })
})
