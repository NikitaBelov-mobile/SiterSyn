import { redis, buildCacheKey, CACHE_TTL } from './redis'
import { TOONSpec } from '@/lib/ai/toon/dictionary'
import crypto from 'crypto'

/**
 * Cache Manager
 * Handles caching logic for site generation
 */
export class CacheManager {
  /**
   * Get from cache or generate new content
   */
  async getOrGenerate<T>(
    toonSpec: string,
    generator: () => Promise<T>,
    options: {
      ttl?: number
      skipCache?: boolean
    } = {}
  ): Promise<{ data: T; cached: boolean }> {
    const { ttl = CACHE_TTL.TOON, skipCache = false } = options

    // Skip cache if requested
    if (skipCache) {
      const data = await generator()
      return { data, cached: false }
    }

    // Generate cache key
    const cacheKey = this.generateKey(toonSpec)

    try {
      // Try to get from cache
      const cachedData = await redis.get(cacheKey)

      if (cachedData) {
        console.log('[Cache] Hit:', cacheKey)
        await this.incrementStats('hits')
        return {
          data: cachedData as T,
          cached: true,
        }
      }

      console.log('[Cache] Miss:', cacheKey)
      await this.incrementStats('misses')

      // Generate new content
      const data = await generator()

      // Store in cache
      await redis.set(cacheKey, data, { ex: ttl })

      return { data, cached: false }
    } catch (error) {
      console.error('[Cache] Error:', error)
      // On cache error, just generate without caching
      const data = await generator()
      return { data, cached: false }
    }
  }

  /**
   * Generate deterministic cache key from TOON spec
   */
  generateKey(toonSpec: string): string {
    // Normalize TOON spec first
    const normalized = this.normalizeTOON(toonSpec)

    // Generate hash
    const hash = crypto.createHash('sha256').update(normalized).digest('hex')

    return buildCacheKey('TOON', hash.substring(0, 16))
  }

  /**
   * Normalize TOON spec for consistent caching
   * Removes whitespace, sorts properties, etc.
   */
  normalizeTOON(toonSpec: string): string {
    try {
      // Remove all whitespace
      let normalized = toonSpec.replace(/\s+/g, '')

      // Convert to lowercase for case-insensitive matching
      normalized = normalized.toLowerCase()

      // Sort sections if they exist
      // Example: "s:[h,f,ct]" -> "s:[ct,f,h]"
      const sectionsMatch = normalized.match(/s:\[([^\]]+)\]/)
      if (sectionsMatch) {
        const sections = sectionsMatch[1].split(',').sort().join(',')
        normalized = normalized.replace(/s:\[([^\]]+)\]/, `s:[${sections}]`)
      }

      return normalized
    } catch (error) {
      console.error('[Cache] Normalization error:', error)
      return toonSpec
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    hits: number
    misses: number
    hitRate: number
    totalRequests: number
  }> {
    try {
      const [hits, misses] = await Promise.all([
        redis.get(buildCacheKey('STATS', 'hits')),
        redis.get(buildCacheKey('STATS', 'misses')),
      ])

      const hitsCount = Number(hits) || 0
      const missesCount = Number(misses) || 0
      const totalRequests = hitsCount + missesCount

      return {
        hits: hitsCount,
        misses: missesCount,
        hitRate: totalRequests > 0 ? hitsCount / totalRequests : 0,
        totalRequests,
      }
    } catch (error) {
      console.error('[Cache] Stats error:', error)
      return {
        hits: 0,
        misses: 0,
        hitRate: 0,
        totalRequests: 0,
      }
    }
  }

  /**
   * Reset cache statistics
   */
  async resetStats(): Promise<void> {
    try {
      await Promise.all([
        redis.del(buildCacheKey('STATS', 'hits')),
        redis.del(buildCacheKey('STATS', 'misses')),
      ])
    } catch (error) {
      console.error('[Cache] Reset stats error:', error)
    }
  }

  /**
   * Increment cache statistics
   */
  private async incrementStats(type: 'hits' | 'misses'): Promise<void> {
    try {
      const key = buildCacheKey('STATS', type)
      await redis.incr(key)
      // Set TTL on first increment
      await redis.expire(key, CACHE_TTL.STATS)
    } catch (error) {
      console.error('[Cache] Increment stats error:', error)
    }
  }

  /**
   * Invalidate cache for a specific TOON spec
   */
  async invalidate(toonSpec: string): Promise<void> {
    try {
      const cacheKey = this.generateKey(toonSpec)
      await redis.del(cacheKey)
      console.log('[Cache] Invalidated:', cacheKey)
    } catch (error) {
      console.error('[Cache] Invalidation error:', error)
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    try {
      // Note: This is a simple implementation
      // For production, you might want to use SCAN instead of keys
      const keys = await redis.keys(`${buildCacheKey('TOON', '')}*`)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
      console.log('[Cache] Cleared all:', keys.length, 'keys')
    } catch (error) {
      console.error('[Cache] Clear all error:', error)
    }
  }
}

/**
 * Singleton instance
 */
export const cacheManager = new CacheManager()
