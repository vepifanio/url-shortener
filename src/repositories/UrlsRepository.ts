import { Url } from '../entity/Url'

export interface UrlsRepository {
  findByShortUrlId(shortUrlId: string): Promise<Url | null>
  save(url: Url): Promise<void>
  addClick(url: Url): Promise<void>
}
