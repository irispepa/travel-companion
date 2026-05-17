export type CityViewId = 'philly-out' | 'prague' | 'vienna' | 'budapest' | 'philly-in'
export type CityId = 'philly' | 'prague' | 'vienna' | 'budapest'

export interface ItineraryLink { label: string; url: string }
export interface ItineraryItem { id: string; name: string; time: string; duration: string; location: string; notes: string; links: ItineraryLink[]; done?: boolean; active?: boolean }
export interface ItineraryDay { date: string; items: ItineraryItem[] }
export interface ItineraryRecord { cityViewId: CityViewId; days: ItineraryDay[] }

export type ActivityTag = 'must-do' | 'food' | 'quick' | 'day-trip'
export interface ActivityItem { id: string; name: string; location: string; timeEstimate: string; cost: string; priority: number; notes: string; link: string; tags?: ActivityTag[]; done?: boolean; active?: boolean }
export interface ActivitiesRecord { cityId: CityId; items: ActivityItem[] }

export interface PhraseWord { english: string; local: string; phonetic?: string }
export interface InfoCard { title: string; body: string }
export interface PhraseCategory { name: string; words: PhraseWord[]; info: InfoCard[] }
export interface PhrasesRecord { cityId: CityId; categories: PhraseCategory[] }

export interface MemoryEntry { id: string; cityId: CityId; author: string; timestamp: string; location: string; photos: string[]; note: string }

export interface ExchangeRate { pair: string; rate: number; fetchedAt: string }

export interface CurrencyPref { from: string; to: string }
export interface UserPreferences {
  key: 'data'
  currencyPairs: Partial<Record<CityViewId, CurrencyPref>>
  favoritePhrases: Partial<Record<CityId, string[]>>
}

export interface AppMeta { key: 'data'; initialized: boolean }
