import { Hono } from 'hono'

import { createQuotationRepo } from '@/adapter/secondary/repository/quotation/quotation.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createQuotationUsecase } from '@/modules/quotation/quotation.usecase'

import { createQuotationHandler } from './quotation.handler'
import * as Schema from './quotation.schema'

const repo = createQuotationRepo()
const usecase = createQuotationUsecase(repo)
const handler = createQuotationHandler(usecase)

const router = new Hono()

// Public: RFQ form on the public site
router.post('/', validate(Schema.createQuotationSchema), handler.create)

router.get(
  '/',
  authenticate,
  requirePermission('quotations.view'),
  validateQuery(Schema.getQuotationListSchema),
  handler.findList,
)
router.put(
  '/:id/status',
  authenticate,
  requirePermission('quotations.update'),
  validate(Schema.updateQuotationStatusSchema),
  handler.updateStatus,
)
router.put(
  '/:id/assign',
  authenticate,
  requirePermission('quotations.update'),
  validate(Schema.assignQuotationSchema),
  handler.assignProject,
)

export default router
