import { CityId, DayWeather } from '../db/schema'

const CITY_LOCATION: Record<CityId, string> = {
  prague: 'Prague',
  vienna: 'Vienna',
  budapest: 'Budapest',
  philly: 'Philadelphia',
}

function mapWeatherCode(code: number): DayWeather['kind'] {
  if (code === 113) return 'sun'
  if (code === 116) return 'partly'
  if ([119, 122, 143, 248, 260, 227, 230].includes(code)) return 'cloud'
  if (
    [176, 200, 263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359, 362,
     365, 368, 371, 374, 377, 386, 389, 392, 395].includes(code)
  ) return 'rain'
  return 'cloud'
}

export async function fetchWeather(
  cityId: CityId,
  _date: string,
): Promise<{ kind: DayWeather['kind']; temp: number } | null> {
  const location = CITY_LOCATION[cityId]
  if (!location) return null

  try {
    const res = await fetch(
      `https://wttr.in/${encodeURIComponent(location)}?format=j1`,
    )
    if (!res.ok) return null

    const json = await res.json()
    const day = json?.weather?.[0]
    if (!day) return null

    const hourly = day.hourly
    const codeStr =
      hourly?.[4]?.weatherCode ?? hourly?.[0]?.weatherCode ?? null
    const code = codeStr != null ? Number(codeStr) : null
    if (code == null || isNaN(code)) return null

    const tempStr = day.avgtempC ?? day.maxtempC ?? null
    const temp = tempStr != null ? Number(tempStr) : null
    if (temp == null || isNaN(temp)) return null

    return { kind: mapWeatherCode(code), temp }
  } catch {
    return null
  }
}
