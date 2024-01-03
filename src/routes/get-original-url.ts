import { Router } from 'express'
import { ZodError, z } from 'zod'
import { MongooseUrlsRepository } from '../database/repositories/MongooseUrlsRepository'
import { GetOriginalUrlUseCase } from '../application/use-cases/GetOriginalUrl'
import { InvalidUrlError } from '../application/errors/InvalidUrlError'
import { UrlNotFoundError } from '../application/errors/UrlNotFoundError'

const getOriginalUrlRoute = Router()

const getOriginalUrlParamsSchema = z.object({
  urlId: z.string(),
})

getOriginalUrlRoute.get('/:urlId', async (req, res) => {
  try {
    const { urlId } = getOriginalUrlParamsSchema.parse(req.params)
    const urlsRepository = new MongooseUrlsRepository()
    const getOriginalUrlUseCase = new GetOriginalUrlUseCase(urlsRepository)

    const { originalUrl } = await getOriginalUrlUseCase.execute({
      shortUrlId: urlId,
    })

    return res.send({
      originalUrl,
    })
  } catch (error) {
    console.error(error)

    switch (true) {
      case error instanceof UrlNotFoundError:
        return res.status(404).send({
          error: error.message,
        })
      case error instanceof InvalidUrlError || error instanceof ZodError:
        return res.status(400).send({
          error: error.message,
        })
      case error instanceof Error:
        return res.status(500).send({
          error: error.message,
        })
      default:
        return res.status(500).send()
    }
  }
})

export { getOriginalUrlRoute }
