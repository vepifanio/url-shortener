import { Router } from 'express'
import { apiRouter } from './api'
import { getOriginalUrlRoute } from './get-original-url'

const router = Router()

router.use('/api', apiRouter)
router.use(getOriginalUrlRoute)

export { router }
