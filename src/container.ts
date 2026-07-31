import { GenerateShortUrlUseCase } from "./application/use-cases/GenerateShortUrl";
import { GetOriginalUrlUseCase } from "./application/use-cases/GetOriginalUrl";
import { CachedUrlsRepository } from "./database/repositories/CachedUrlsRepository";
import { MongooseUrlsRepository } from "./database/repositories/MongooseUrlsRepository";

const urlsRepository = new CachedUrlsRepository(new MongooseUrlsRepository())

export const container = {
  repositories: {
    urls: urlsRepository
  },
  useCases: {
    generateShortUrl: new GenerateShortUrlUseCase(urlsRepository),
    getOriginalUrl: new GetOriginalUrlUseCase(urlsRepository)
  }
}