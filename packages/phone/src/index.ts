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
 * Normalizes phone input by stripping non-digit characters, leading trunk '0'
 * (e.g. '08...' -> '8...'), and redundant country code if pasted with prefix.
 */
export function normalizePhoneDigits(
  input: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
): string {
  let digits = input.replace(/\D/g, '')
  if (!digits) return ''

  if (countryCode && digits.startsWith(countryCode) && digits.length > countryCode.length + 6) {
    digits = digits.slice(countryCode.length)
  } else if (digits.startsWith('628') && digits.length >= 11) {
    digits = digits.slice(2)
  }

  if (digits.startsWith('08') || (digits.startsWith('0') && digits.length > 1)) {
    digits = digits.slice(1)
  }

  return digits.slice(0, 15)
}

/**
 * Formats local phone digits in standard chunked groups:
 * 3 digits - 4 digits - 4 digits (e.g. "821-8844-9289").
 * Any trailing digits (up to ITU max 15 digits) appear in a 4th chunk.
 */
export function formatPhone(
  input: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
): string {
  const digits = normalizePhoneDigits(input, countryCode)
  if (!digits) return ''

  const parts: string[] = []
  if (digits.length > 0) parts.push(digits.slice(0, 3))
  if (digits.length > 3) parts.push(digits.slice(3, 7))
  if (digits.length > 7) parts.push(digits.slice(7, 11))
  if (digits.length > 11) parts.push(digits.slice(11, 15))

  return parts.join('-')
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
