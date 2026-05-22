import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { makeTestWrapper } from '../helpers/testWrapper'
import { openAppDB } from '../../src/db/client'
import { useLineOfDay } from '../../src/hooks/useLineOfDay'

beforeEach(async () => {
  const db = await openAppDB()
  try { await db.clear('linesOfDay') } catch { /* ignore */ }
})

describe('useLineOfDay', () => {
  it('returns empty string when no line exists', async () => {
    const { result } = renderHook(() => useLineOfDay('prague', '2026-06-14'), { wrapper: makeTestWrapper() })
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 5000 })
    expect(result.current.text).toBe('')
  })

  it('persists a line via setLine', async () => {
    const { result } = renderHook(() => useLineOfDay('prague', '2026-06-14'), { wrapper: makeTestWrapper() })
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 5000 })
    await act(async () => { await result.current.setLine('We got lost twice.') })
    expect(result.current.text).toBe('We got lost twice.')
  })
})
