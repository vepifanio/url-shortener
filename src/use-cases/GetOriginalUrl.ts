import { UrlNotFoundError } from '../errors/UrlNotFoundError'
import { UrlsRepository } from '../repositories/UrlsRepository'

interface GetOriginalUrlUseCaseData {
  shortUrlId: string
}

interface GetOriginalUrlUseCaseResponse {
  originalUrl: string
}

export class GetOriginalUrlUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    shortUrlId,
  }: GetOriginalUrlUseCaseData): Promise<GetOriginalUrlUseCaseResponse> {
    const url = await this.urlsRepository.findByShortUrlId(shortUrlId)

    if (!url) {
      throw new UrlNotFoundError()
    }

    await this.urlsRepository.addClick(url)

    return {
      originalUrl: url.originalUrl,
    }
  }
}
