import { CityViewId, CityId } from '../db/schema'

export interface CityViewConfig {
  cityViewId: CityViewId
  cityId: CityId
  label: string
  mapEmbedUrl: string
  savedSpotsUrl: string
  translateFrom?: string
  translateTo?: string
  defaultCurrencyFrom: string
  defaultCurrencyTo: string
  travelNote?: string
}

export const CITY_VIEWS: CityViewConfig[] = [
  {
    cityViewId: 'philly-out',
    cityId: 'philly',
    label: 'Philadelphia',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d195795.43135808128!2d-75.26393!3d39.9526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6b7d8d4b54beb%3A0x89f514d88784e13b!2sPhiladelphia%2C%20PA!5e0!3m2!1sen!2sus!4v1699000000000!5m2!1sen!2sus',
    savedSpotsUrl: 'https://maps.google.com/maps',
    defaultCurrencyFrom: 'USD',
    defaultCurrencyTo: 'CZK',
    travelNote: 'Uber → PHL → layover → PRG'
  },
  {
    cityViewId: 'prague',
    cityId: 'prague',
    label: 'Prague',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d81908.59089232535!2d14.3539!3d50.0755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b939c0970798b%3A0x400af0f6614b1b0!2sPrague%2C%20Czechia!5e0!3m2!1sen!2sus!4v1699000000001!5m2!1sen!2sus',
    savedSpotsUrl: 'https://maps.google.com/maps',
    translateFrom: 'en',
    translateTo: 'cs',
    defaultCurrencyFrom: 'CZK',
    defaultCurrencyTo: 'USD'
  },
  {
    cityViewId: 'vienna',
    cityId: 'vienna',
    label: 'Vienna',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d85304.27764573463!2d16.3738!3d48.2082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d079e5136ca4f%3A0xfdc9d9b674848d8!2sVienna%2C%20Austria!5e0!3m2!1sen!2sus!4v1699000000002!5m2!1sen!2sus',
    savedSpotsUrl: 'https://maps.google.com/maps',
    translateFrom: 'en',
    translateTo: 'de',
    defaultCurrencyFrom: 'EUR',
    defaultCurrencyTo: 'USD'
  },
  {
    cityViewId: 'budapest',
    cityId: 'budapest',
    label: 'Budapest',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d86408.62289453474!2d19.0402!3d47.4979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741c334d1d4cfc9%3A0x400c4290c1e1160!2sBudapest%2C%20Hungary!5e0!3m2!1sen!2sus!4v1699000000003!5m2!1sen!2sus',
    savedSpotsUrl: 'https://maps.google.com/maps',
    translateFrom: 'en',
    translateTo: 'hu',
    defaultCurrencyFrom: 'HUF',
    defaultCurrencyTo: 'USD'
  },
  {
    cityViewId: 'philly-in',
    cityId: 'philly',
    label: 'Philadelphia',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d195795.43135808128!2d-75.26393!3d39.9526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6b7d8d4b54beb%3A0x89f514d88784e13b!2sPhiladelphia%2C%20PA!5e0!3m2!1sen!2sus!4v1699000000004!5m2!1sen!2sus',
    savedSpotsUrl: 'https://maps.google.com/maps',
    defaultCurrencyFrom: 'HUF',
    defaultCurrencyTo: 'USD',
    travelNote: 'BUD → layover → PHL → Uber'
  }
]

export function getCityView(id: CityViewId): CityViewConfig {
  return CITY_VIEWS.find(c => c.cityViewId === id)!
}
