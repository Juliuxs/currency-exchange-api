import { Router } from 'express'
import { getCurrentExchangeRates } from '../controller/current-rates.js'
import { CurrentExchangeRatesSchema } from '../schema/current-rates.js'
import { validate } from '../middleware/input-validator.js'
import { logsValidationSchema } from '../schema/access-logs.js'
import { getAccessLogsController } from '../controller/access-logs.js'

const router = Router()

router.get('/v1/current-rates', validate(CurrentExchangeRatesSchema), getCurrentExchangeRates)
router.get('/v1/access-logs', validate(logsValidationSchema), getAccessLogsController)

export { router }
