import { GenerateShortUrlUseCase } from '../../src/application/use-cases/GenerateShortUrl'
import { InMemoryUrlsRepository } from '../repositories/InMemoryUrlsRepository'
import { InvalidUrlError } from '../../src/application/errors/InvalidUrlError'

describe('Generate Short URL Use Case', () => {
  let urlsRepository: InMemoryUrlsRepository
  let sut: GenerateShortUrlUseCase

  beforeEach(() => {
    urlsRepository = new InMemoryUrlsRepository()
    sut = new GenerateShortUrlUseCase(urlsRepository)
  })

  it('Should be able to generate a short url to a given url', async () => {
    const originalUrl = 'http://test.com'
    const result = await sut.execute({ originalUrl })

    expect(result).toEqual({
      shortUrl: expect.any(String),
      shortUrlId: expect.any(String),
    })
    expect(urlsRepository.items[0]).toEqual(
      expect.objectContaining({
        shortUrlId: result.shortUrlId,
        originalUrl,
      }),
    )
  })

  it('should not be able to generate a short url with an invalid url', async () => {
    await expect(
      sut.execute({ originalUrl: 'invalid-url' }),
    ).rejects.toBeInstanceOf(InvalidUrlError)
  })
})
