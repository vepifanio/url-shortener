import { GetOriginalUrlUseCase } from '../../src/application/use-cases/GetOriginalUrl'
import { makeUrl } from '../factories/makeUrl'
import { InMemoryUrlsRepository } from '../repositories/InMemoryUrlsRepository'

describe('Get Original URL Use Case', () => {
  let urlsRepository: InMemoryUrlsRepository
  let sut: GetOriginalUrlUseCase

  beforeEach(() => {
    urlsRepository = new InMemoryUrlsRepository()
    sut = new GetOriginalUrlUseCase(urlsRepository)
  })

  it('should be able to get the original url of an given short url id', async () => {
    const url = makeUrl({
      originalUrl: 'http://test.com',
    })

    urlsRepository.items.push(url)

    const result = await sut.execute({ shortUrlId: url.shortUrlId })

    expect(result).toEqual({
      originalUrl: url.originalUrl,
    })
  })

  it('should be able to increment the number of clicks of an url each time when its original url is requested', async () => {
    const url = makeUrl({
      originalUrl: 'http://test.com',
    })

    urlsRepository.items.push(url)

    await sut.execute({ shortUrlId: url.shortUrlId })
    await sut.execute({ shortUrlId: url.shortUrlId })

    expect(urlsRepository.items[0].clicks).toBe(2)
  })
})
