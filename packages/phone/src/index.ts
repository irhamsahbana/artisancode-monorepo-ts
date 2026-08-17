export interface CountryCode {
  /** Dial code digits, no "+", e.g. "62". */
  code: string
  label: string
}

// ponytail: curated shortlist covering this CRM's realistic contacts
// (Indonesia-based business + occasional regional/overseas leads), not an
// exhaustive ITU country list.
export const COUNTRY_CODES: CountryCode[] = [
  { code: '62', label: 'Indonesia (+62)' },
  { code: '65', label: 'Singapura (+65)' },
  { code: '60', label: 'Malaysia (+60)' },
  { code: '86', label: 'Tiongkok (+86)' },
  { code: '81', label: 'Jepang (+81)' },
  { code: '82', label: 'Korea Selatan (+82)' },
  { code: '91', label: 'India (+91)' },
  { code: '971', label: 'Uni Emirat Arab (+971)' },
  { code: '61', label: 'Australia (+61)' },
  { code: '1', label: 'Amerika Serikat (+1)' },
]

export const DEFAULT_COUNTRY_CODE = '62'

/** Strips formatting and a leading trunk "0" from a locally-entered number. */
export function localPhoneDigits(input: string): string {
  const digits = input.replace(/\D/g, '')
  return digits.startsWith('0') ? digits.slice(1) : digits
}

/**
 * Combines a country dial code with a local number into the full digit
 * string used by wa.me links, e.g. ("62", "0812...") -> "62812...".
 * Guards against double-prefixing local numbers that already carry the
 * country code (pre-existing data saved before country_code was split out).
 */
export function toFullPhone(countryCode: string, localNumber: string): string {
  const local = localPhoneDigits(localNumber)
  if (!local) return ''
  return local.startsWith(countryCode) ? local : `${countryCode}${local}`
}
