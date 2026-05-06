import { describe, it, expect } from 'vitest'
import { sortActivities } from '../../../src/components/sections/activities/ActivitiesSection'

const items = [
  { id: '1', priority: 3, cost: '20 EUR', timeEstimate: '2h', name: 'B', location: '', notes: '', link: '' },
  { id: '2', priority: 5, cost: '5 EUR', timeEstimate: '1h', name: 'A', location: '', notes: '', link: '' },
]

describe('sortActivities', () => {
  it('sorts by priority descending by default', () => {
    const sorted = sortActivities(items, 'priority')
    expect(sorted[0].priority).toBe(5)
  })

  it('sorts by cost ascending', () => {
    const sorted = sortActivities(items, 'cost')
    expect(sorted[0].cost).toBe('20 EUR')
  })

  it('sorts by timeEstimate ascending', () => {
    const sorted = sortActivities(items, 'timeEstimate')
    expect(sorted[0].timeEstimate).toBe('1h')
  })
})
