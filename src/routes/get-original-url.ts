import { Router } from 'express'
import { ZodError, z } from 'zod'
import { InvalidUrlError } from '../application/errors/InvalidUrlError'
import { UrlNotFoundError } from '../application/errors/UrlNotFoundError'
import { container } from '../container'

const getOriginalUrlRoute = Router()

const getOriginalUrlParamsSchema = z.object({
  urlId: z.string(),
})

getOriginalUrlRoute.get('/:urlId', async (req, res) => {
  try {
    const { urlId } = getOriginalUrlParamsSchema.parse(req.params)

    const { originalUrl } = await container.useCases.getOriginalUrl.execute({
      shortUrlId: urlId,
    })

    return res.redirect(originalUrl)
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
