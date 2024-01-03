import { randomUUID } from 'node:crypto'
import { Url, UrlProps } from '../../src/application/entity/Url'
import { nanoid } from 'nanoid'

export function makeUrl(props: Partial<UrlProps>) {
  return Url.create({
    id: randomUUID(),
    clicks: 0,
    createdAt: new Date(),
    originalUrl: 'http://test.com',
    shortUrlId: nanoid(),
    ...props,
  })
}
