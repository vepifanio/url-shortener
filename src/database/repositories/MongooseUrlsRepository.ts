import { Url } from '../../entity/Url'
import { UrlsRepository } from '../../repositories/UrlsRepository'
import { UrlModel } from '../models/UrlModel'

export class MongooseUrlsRepository implements UrlsRepository {
  async findByShortUrlId(shortUrlId: string): Promise<Url | null> {
    const persistedUrl = await UrlModel.findOne({
      shortUrlId,
    })

    if (!persistedUrl) {
      return null
    }

    const url = Url.create({
      id: persistedUrl.id,
      originalUrl: persistedUrl.originalUrl,
      shortUrlId: persistedUrl.shortUrlId,
      clicks: persistedUrl.clicks,
      createdAt: persistedUrl.createdAt,
    })

    return url
  }

  async save(url: Url): Promise<void> {
    const urlToPersist = new UrlModel({
      id: url.id,
      originalUrl: url.originalUrl,
      shortUrlId: url.shortUrlId,
      clicks: url.clicks,
      createdAt: url.createdAt,
    })

    await urlToPersist.save()
  }

  async addClick(url: Url): Promise<void> {
    await UrlModel.findOneAndUpdate(
      {
        id: url.id,
      },
      {
        $inc: {
          clicks: 1,
        },
      },
    )
  }
}
