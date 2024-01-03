/* eslint-disable no-useless-escape */
import { nanoid } from 'nanoid'
import dotenv from 'dotenv'
import { InvalidUrlError } from '../errors/InvalidUrlError'

dotenv.config()

export interface UrlProps {
  id?: string
  originalUrl: string
  shortUrlId?: string
  clicks?: number
  createdAt?: Date
}

export class Url {
  private _id?: string
  private _originalUrl: string
  private _shortUrlId: string
  private _clicks?: number
  private _createdAt?: Date

  constructor(data: UrlProps) {
    if (!this.validateUrl(data.originalUrl)) {
      throw new InvalidUrlError()
    }

    const shortUrlId = data.shortUrlId || nanoid()

    this._id = data.id
    this._originalUrl = data.originalUrl
    this._shortUrlId = shortUrlId
    this._clicks = data.clicks
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

  get shortUrlId() {
    return this._shortUrlId
  }

  get clicks() {
    return this._clicks
  }

  get createdAt() {
    return this._createdAt
  }

  getShortUrl(): string {
    return `${process.env.BASE_URL}/${this._shortUrlId}`
  }

  private validateUrl(value: string) {
    const urlPattern =
      /(http|ftp|https):\/\/([\w+?\.\w+])+([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)?/i

    return urlPattern.test(value)
  }
}
