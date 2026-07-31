import { CachedUrlsRepository } from '../../src/database/repositories/CachedUrlsRepository'
import { InMemoryUrlsRepository } from './InMemoryUrlsRepository'
import { redisCache } from '../../src/cache/RedisCache'
import { makeUrl } from '../factories/makeUrl'

describe('Cached Urls Repository', () => {
  let innerRepo: InMemoryUrlsRepository
  let cachedRepo: CachedUrlsRepository

  beforeEach(() => {
    innerRepo = new InMemoryUrlsRepository()
    cachedRepo = new CachedUrlsRepository(innerRepo)
    vi.clearAllMocks()
  })

  it('should return from cache (cache hit) if key exists in Redis', async () => {
    const url = makeUrl({ originalUrl: 'http://test.com', shortUrlId: 'cached-id' })
    
    vi.spyOn(redisCache, 'get').mockResolvedValueOnce(url)
    const findByInnerSpy = vi.spyOn(innerRepo, 'findByShortUrlId')

    const result = await cachedRepo.findByShortUrlId('cached-id')

    expect(result).toEqual(url)
    expect(findByInnerSpy).not.toHaveBeenCalled()
  })

  it('should query inner repository on cache miss and store in Redis', async () => {
    const url = makeUrl({ originalUrl: 'http://test.com', shortUrlId: 'miss-id' })
    innerRepo.items.push(url)

    vi.spyOn(redisCache, 'get').mockResolvedValueOnce(null)
    const setCacheSpy = vi.spyOn(redisCache, 'set').mockResolvedValueOnce()

    const result = await cachedRepo.findByShortUrlId('miss-id')

    expect(result).toEqual(url)
    expect(setCacheSpy).toHaveBeenCalledWith('url:miss-id', url, expect.any(Number))
  })

  it('should invalidate cache when saving a url', async () => {
    const url = makeUrl({ originalUrl: 'http://test.com', shortUrlId: 'save-id' })
    const delCacheSpy = vi.spyOn(redisCache, 'del').mockResolvedValueOnce()

    await cachedRepo.save(url)

    expect(innerRepo.items).toContain(url)
    expect(delCacheSpy).toHaveBeenCalledWith('url:save-id')
  })

  it('should invalidate cache when adding a click', async () => {
    const url = makeUrl({ originalUrl: 'http://test.com', shortUrlId: 'click-id', clicks: 0 })
    innerRepo.items.push(url)

    const delCacheSpy = vi.spyOn(redisCache, 'del').mockResolvedValueOnce()

    await cachedRepo.addClick(url)

    expect(delCacheSpy).toHaveBeenCalledWith('url:click-id')
  })
})
