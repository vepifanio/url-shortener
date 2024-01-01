import { nanoid } from 'nanoid'

export interface UrlProps {
  id?: string
  originalUrl: string
  shortUrl: string
  clicks?: number
  createdAt?: Date
}

export class Url {
  private _id?: string
  private _originalUrl: string
  private _shortUrl: string
  private _clicks?: number
  private _createdAt?: Date

  constructor(data: UrlProps) {
    this._id = data.id
    this._originalUrl = data.originalUrl
    this._shortUrl = this.generateUrl()
    this._createdAt = data.createdAt
  }

  static create(props: UrlProps) {
    return new Url(props)
  }

  get id() {
    return this._id
  }

  get originalUrl() {
    return this._originalUrl
  }

  get shortUrl() {
    return this._shortUrl
  }

  get clicks() {
    return this._clicks
  }

  get createdAt() {
    return this._createdAt
  }

  private generateUrl(): string {
    const shortUrlId = nanoid()
    return `${process.env.BASE_URL}/${shortUrlId}`
  }
}
