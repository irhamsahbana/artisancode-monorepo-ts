import { Hono } from 'hono'

import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'

import { createUomHandler } from './uom.handler'
import { createUomRepo } from './uom.repo'
import * as Schema from './uom.schema'
import { createUomUsecase } from './uom.usecase'

const repo = createUomRepo()
const usecase = createUomUsecase(repo)
const handler = createUomHandler(usecase)

const uomRouter = new Hono()
const unitConversionRouter = new Hono()

uomRouter.post('/', authenticate, validate(Schema.createUomSchema), handler.createUom)
uomRouter.get('/', authenticate, validateQuery(Schema.getUomListSchema), handler.findUomList)
uomRouter.put('/:id', authenticate, validate(Schema.updateUomSchema), handler.updateUom)

unitConversionRouter.post(
  '/',
  authenticate,
  validate(Schema.createUnitConversionSchema),
  handler.createConversion,
)
unitConversionRouter.get(
  '/',
  authenticate,
  validateQuery(Schema.getUnitConversionListSchema),
  handler.findConversionList,
)
unitConversionRouter.put(
  '/:id',
  authenticate,
  validate(Schema.updateUnitConversionSchema),
  handler.updateConversion,
)

export default uomRouter
export { unitConversionRouter }
