import { Url } from '../../application/entity/Url'
import { UrlsRepository } from '../../application/repositories/UrlsRepository'
import { MongooseUrlsRepository } from './MongooseUrlsRepository'
import { redisCache } from '../../cache/RedisCache'

export class CachedUrlsRepository implements UrlsRepository {
  private readonly CACHE_KEY_PREFIX = 'url:'
  private readonly TTL_SECONDS: number

  constructor(
    private readonly innerRepository: UrlsRepository = new MongooseUrlsRepository()
  ) {
    this.TTL_SECONDS = Number(process.env.REDIS_TTL) || 3600
  }

  private getCacheKey(shortUrlId: string): string {
    return `${this.CACHE_KEY_PREFIX}${shortUrlId}`
  }

  async findByShortUrlId(shortUrlId: string): Promise<Url | null> {
    const cacheKey = this.getCacheKey(shortUrlId)

    // Try to get from cache first
    const cachedUrl = await redisCache.get<Url>(cacheKey)
    if (cachedUrl) {
      console.log(`Cache HIT for ${shortUrlId}`)
      return cachedUrl
    }

    console.log(`Cache MISS for ${shortUrlId}`)

    // Cache miss - query database
    const url = await this.innerRepository.findByShortUrlId(shortUrlId)

    if (url) {
      // Store in cache for future requests
      await redisCache.set(cacheKey, url, this.TTL_SECONDS)
    }

    return url
  }

  async save(url: Url): Promise<void> {
    // Save to database first
    await this.innerRepository.save(url)

    // Invalidate cache for this URL (in case it was cached with a different ID)
    const cacheKey = this.getCacheKey(url.shortUrlId)
    await redisCache.del(cacheKey)
  }

  async addClick(url: Url): Promise<void> {
    // Update database
    await this.innerRepository.addClick(url)

    // Invalidate cache so next read gets updated click count
    const cacheKey = this.getCacheKey(url.shortUrlId)
    await redisCache.del(cacheKey)
  }
}