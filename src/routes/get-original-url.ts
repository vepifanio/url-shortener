import { Router } from 'express'
import { z } from 'zod'
import { UrlModel } from '../database/models/UrlModel'

const getOriginalUrlRoute = Router()

const getOriginalUrlParamsSchema = z.object({
  urlId: z.string(),
})

getOriginalUrlRoute.get('/:urlId', async (req, res) => {
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
})

export { getOriginalUrlRoute }
