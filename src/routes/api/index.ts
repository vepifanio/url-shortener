import { Router } from 'express'
import { ZodError, z } from 'zod'
import { InvalidUrlError } from '../../errors/InvalidUrlError'
import { MongooseUrlsRepository } from '../../database/repositories/MongooseUrlsRepository'
import { GenerateShortUrlUseCase } from '../../use-cases/GenerateShortUrl'

const apiRouter = Router()

const createShortUrlBodySchema = z.object({
  originalUrl: z.string(),
})

apiRouter.post('/short', async (req, res) => {
  const urlsRepository = new MongooseUrlsRepository()
  const generateShortUrl = new GenerateShortUrlUseCase(urlsRepository)

  try {
    const { originalUrl } = createShortUrlBodySchema.parse(req.body)

    const { shortUrl, shortUrlId } = await generateShortUrl.execute({
      originalUrl,
    })

    return res.status(201).send({
      shortUrl,
      shortUrlId,
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
