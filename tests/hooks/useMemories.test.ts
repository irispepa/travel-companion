import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { makeTestWrapper } from '../helpers/testWrapper'
import { useMemories } from '../../src/hooks/useMemories'

beforeEach(() => indexedDB.deleteDatabase('trip-companion'))

describe('useMemories', () => {
  it('adds and retrieves a memory', async () => {
    const { result } = renderHook(() => useMemories('prague'), { wrapper: makeTestWrapper() })
    await waitFor(() => {
      expect(result.current.addMemory).toBeDefined()
    }, { timeout: 3000 })
    await act(async () => {
      await result.current.addMemory({
        id: '1', cityId: 'prague', author: 'Iris',
        timestamp: '2026-06-14T10:00:00Z', location: 'Prague Castle',
        photos: [], note: 'Amazing view'
      })
    })
    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].note).toBe('Amazing view')
  })
})
