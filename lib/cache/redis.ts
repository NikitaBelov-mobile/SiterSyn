import { Redis } from '@upstash/redis'

/**
 * Upstash Redis client singleton
 * Used for caching generated sites and templates
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Cache key prefixes for organization
 */
export const CACHE_PREFIXES = {
  SITE: 'site:',
  TOON: 'toon:',
  TEMPLATE: 'template:',
  STATS: 'stats:',
  RATE_LIMIT: 'ratelimit:',
} as const

/**
 * Cache TTL settings (in seconds)
 */
export const CACHE_TTL = {
  SITE: 60 * 60 * 24 * 7, // 7 days
  TOON: 60 * 60 * 24 * 30, // 30 days
  TEMPLATE: 60 * 60 * 24 * 90, // 90 days
  STATS: 60 * 60, // 1 hour
  RATE_LIMIT: 60 * 60, // 1 hour
} as const

/**
 * Helper function to build cache keys
 */
export function buildCacheKey(prefix: keyof typeof CACHE_PREFIXES, ...parts: string[]): string {
  return `${CACHE_PREFIXES[prefix]}${parts.join(':')}`
}
