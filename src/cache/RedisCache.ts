import Redis from 'ioredis'
import { config } from '../Config'

class RedisCache {
  private client: Redis
  private static instance: RedisCache

  private constructor() {
    this.client = new Redis({
      host: config.get('REDIS_HOST'),
      port: Number(config.get('REDIS_PORT')),
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          return null // Stop retrying
        }
        return Math.min(times * 100, 3000)
      },
      lazyConnect: true,
    })

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err)
    })

    this.client.on('connect', () => {
      console.log('Redis connected')
    })
  }

  static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache()
    }
    return RedisCache.instance
  }

  async connect(): Promise<void> {
    if (this.client.status === 'wait') {
      await this.client.connect()
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit()
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key)
      if (value === null) {
        return null
      }
      return JSON.parse(value) as T
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error)
      return null
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      const ttl = ttlSeconds || Number(config.get('REDIS_TTL'))
      await this.client.setex(key, ttl, serialized)
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error)
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (error) {
      console.error(`Redis DEL error for key ${key}:`, error)
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error)
      return false
    }
  }

  getClient(): Redis {
    return this.client
  }
}

export const redisCache = RedisCache.getInstance()