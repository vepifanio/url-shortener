import { Url } from '../../application/entity/Url'
import { UrlsRepository } from '../../application/repositories/UrlsRepository'

export class InMemoryUrlsRepository implements UrlsRepository {
  items: Url[] = []

  async findByShortUrlId(shortUrlId: string): Promise<Url | null> {
    const url = this.items.find((item) => item.shortUrlId === shortUrlId)

    return url || null
  }

  async save(url: Url): Promise<void> {
    this.items.push(url)
  }

  async addClick(url: Url): Promise<void> {
    const urlIndex = this.items.findIndex((item) => item.id === url.id)
    const clickIncrementedUrl = Url.create({
      id: url.id,
      originalUrl: url.originalUrl,
      shortUrlId: url.shortUrlId,
      clicks: url.clicks !== undefined ? url.clicks + 1 : 0,
      createdAt: url.createdAt,
    })
    this.items[urlIndex] = clickIncrementedUrl
  }
}
