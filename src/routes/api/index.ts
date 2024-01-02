import { Router } from 'express'
import { ZodError, z } from 'zod'
import { UrlModel } from '../../database/models/UrlModel'
import { Url } from '../../entity/Url'
import { InvalidUrlError } from '../../errors/InvalidUrlError'

const apiRouter = Router()

const createShortUrlBodySchema = z.object({
  originalUrl: z.string(),
})

apiRouter.post('/short', async (req, res) => {
  try {
    const { originalUrl } = createShortUrlBodySchema.parse(req.body)

    const url = Url.create({
      originalUrl,
    })

    const persistedUrl = new UrlModel({
      originalUrl: url.originalUrl,
      shortUrlId: url.shortUrlId,
    })

    await persistedUrl.save()

    return res.status(201).send({
      shortUrl: url.getShortUrl(),
      shorUrlId: url.shortUrlId,
    })
  } catch (error) {
    console.error(error)

    if (error instanceof InvalidUrlError || error instanceof ZodError) {
      return res.status(400).send({
        error: error.message,
      })
    }

    if (error instanceof Error) {
      return res.status(500).send({
        error: error.message,
      })
    }

    return res.status(500).send()
  }
})

export { apiRouter }
