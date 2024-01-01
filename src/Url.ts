import { randomUUID } from 'crypto'
import { nanoid } from 'nanoid'

export interface IUrl {
  id?: string
  shortUrl: string
  originalUrl: string
  clicks?: number
  createdAt?: Date | null
}

export class Url {
  private _id: string
  private _shortUrl: string
  private _originalUrl: string
  private _clicks: number
  private _createdAt?: Date | null

  private constructor(data: IUrl) {
    this._id = data.id || randomUUID()
    this._originalUrl = data.originalUrl
    this._shortUrl = this.generateShortUrl()
    this._clicks = data.clicks || 0
    this._createdAt = data.createdAt
  }

  static create() {}

  private generateShortUrl() {
    const shortUrlId = nanoid()
    return `${process.env.BASE_URL}/${shortUrlId}`
  }
}
