import { Router } from 'express'
import { ZodError, z } from 'zod'
import { InvalidUrlError } from '../../application/errors/InvalidUrlError'
import { container } from '../../container'

const apiRouter = Router()

const createShortUrlBodySchema = z.object({
  originalUrl: z.string().url('Invalid URL.'),
})

apiRouter.post('/short', async (req, res) => {
  try {
    const { originalUrl } = createShortUrlBodySchema.parse(req.body)

    const { shortUrl, shortUrlId } = await container.useCases.generateShortUrl.execute({
      originalUrl,
    })

    return res.status(201).send({
      shortUrl,
      shortUrlId,
    })
  } catch (error) {
    console.error(error)

    if (error instanceof InvalidUrlError) {
      return res.status(400).send({
        error: error.message,
      })
    }

    if (error instanceof ZodError) {
      return res.status(400).send({
        error: error.errors[0].message,
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
