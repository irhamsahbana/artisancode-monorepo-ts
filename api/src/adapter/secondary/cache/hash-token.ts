import crypto from 'crypto'

// ponytail: cache keys must not leak the raw JWT/refresh token to whoever can
// read Redis key names (e.g. KEYS, RedisInsight). Hashing is one-way, so the
// key is useless without the original token, while lookups stay a simple
// re-hash of the same input.
export const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex')
