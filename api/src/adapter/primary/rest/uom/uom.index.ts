import { Hono } from 'hono'

import { createUomRepo } from '@/adapter/secondary/repository/uom/uom.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createUomUsecase } from '@/modules/uom/uom.usecase'

import { createUomHandler } from './uom.handler'
import * as Schema from './uom.schema'

const repo = createUomRepo()
const usecase = createUomUsecase(repo)
const handler = createUomHandler(usecase)

const uomRouter = new Hono()
const unitConversionRouter = new Hono()

uomRouter.post(
  '/',
  authenticate,
  requirePermission('uoms.create'),
  validate(Schema.createUomSchema),
  handler.createUom,
)
uomRouter.get(
  '/',
  authenticate,
  requirePermission('uoms.view'),
  validateQuery(Schema.getUomListSchema),
  handler.findUomList,
)
uomRouter.put(
  '/:id',
  authenticate,
  requirePermission('uoms.update'),
  validate(Schema.updateUomSchema),
  handler.updateUom,
)

unitConversionRouter.post(
  '/',
  authenticate,
  requirePermission('unit_conversions.create'),
  validate(Schema.createUnitConversionSchema),
  handler.createConversion,
)
unitConversionRouter.get(
  '/',
  authenticate,
  requirePermission('unit_conversions.view'),
  validateQuery(Schema.getUnitConversionListSchema),
  handler.findConversionList,
)
unitConversionRouter.put(
  '/:id',
  authenticate,
  requirePermission('unit_conversions.update'),
  validate(Schema.updateUnitConversionSchema),
  handler.updateConversion,
)

export default uomRouter
export { unitConversionRouter }
