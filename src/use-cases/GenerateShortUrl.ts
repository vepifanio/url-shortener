import { Url } from '../entity/Url'
import { UrlsRepository } from '../repositories/UrlsRepository'

interface GenerateShortUrlUseCaseData {
  originalUrl: string
}

interface GenerateShortUrlUseCaseResponse {
  shortUrl: string
  shortUrlId: string
}

export class GenerateShortUrlUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    originalUrl,
  }: GenerateShortUrlUseCaseData): Promise<GenerateShortUrlUseCaseResponse> {
    const url = Url.create({
      originalUrl,
    })

    await this.urlsRepository.save(url)

    return {
      shortUrl: url.getShortUrl(),
      shortUrlId: url.shortUrlId,
    }
  }
}
