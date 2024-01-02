import { Router } from 'express'
import { ZodError, z } from 'zod'
import { UrlModel } from '../database/models/UrlModel'
import { InvalidUrlError } from '../errors/InvalidUrlError'

const getOriginalUrlRoute = Router()

const getOriginalUrlParamsSchema = z.object({
  urlId: z.string(),
})

getOriginalUrlRoute.get('/:urlId', async (req, res) => {
  try {
    const { urlId } = getOriginalUrlParamsSchema.parse(req.params)

    const url = await UrlModel.findOne({
      shortUrlId: urlId,
    })

    if (!url) {
      return res.status(401).send({
        message: 'URL not found.',
      })
    }

    url.$inc('clicks', 1)

    await url.save()

    return res.send({
      originalUrl: url.originalUrl,
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

export { getOriginalUrlRoute }
