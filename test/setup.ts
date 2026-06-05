import { vi } from 'vitest'

// Mock Redis cache for tests
const memoryCache = new Map<string, unknown>()

vi.mock('../src/cache/RedisCache', () => ({
  redisCache: {
    get: vi.fn(async <T>(key: string): Promise<T | null> => {
      const value = memoryCache.get(key)
      return (value as T) || null
    }),
    set: vi.fn(async (key: string, value: unknown): Promise<void> => {
      memoryCache.set(key, value)
    }),
    del: vi.fn(async (key: string): Promise<void> => {
      memoryCache.delete(key)
    }),
    exists: vi.fn(async (key: string): Promise<boolean> => {
      return memoryCache.has(key)
    }),
    connect: vi.fn(async (): Promise<void> => {}),
    disconnect: vi.fn(async (): Promise<void> => {}),
    getClient: vi.fn(() => ({})),
  },
}))

// Clear cache before each test
beforeEach(() => {
  memoryCache.clear()
})

// Increase timeout for integration tests
vi.setConfig({ testTimeout: 30000, hookTimeout: 30000 })
