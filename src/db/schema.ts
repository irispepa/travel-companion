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

export type MemoryKind = 'photo' | 'note' | 'food' | 'voice' | 'ticket'

interface BaseMemory {
  id: string
  cityId: CityId
  author: 'Iris' | 'Niko' | 'both'
  timestamp: string
  location?: string
}

export interface PhotoMemory extends BaseMemory  { kind: 'photo';  photoSrc: string; caption?: string }
export interface NoteMemory extends BaseMemory   { kind: 'note';   body: string; tone?: 'cream' | 'white' }
export interface FoodMemory extends BaseMemory   { kind: 'food';   dish: string; note: string }
export interface VoiceMemory extends BaseMemory  { kind: 'voice';  audioSrc: string; audioBlob?: Blob; duration: number; caption?: string; waveform: number[] }
export interface TicketMemory extends BaseMemory { kind: 'ticket'; from: string; to: string; date: string; time: string; line?: string; caption?: string }

export type MemoryEntry = PhotoMemory | NoteMemory | FoodMemory | VoiceMemory | TicketMemory

export interface LineOfDay  { id: string; cityId: CityId; date: string; text: string; updatedAt: string }
export interface DayWeather { id: string; cityId: CityId; date: string; kind: 'sun' | 'cloud' | 'partly' | 'rain'; temp: number; fetchedAt: string }

export interface ExchangeRate { pair: string; rate: number; fetchedAt: string }

export interface CurrencyPref { from: string; to: string }
export interface UserPreferences {
  key: 'data'
  currencyPairs: Partial<Record<CityViewId, CurrencyPref>>
  favoritePhrases: Partial<Record<CityId, string[]>>
}

export interface AppMeta { key: 'data'; initialized: boolean; seedVersion: number }
