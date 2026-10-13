import { Hono } from 'hono'

import { createContactRepo } from '@/adapter/secondary/repository/contact/contact.repo'
import { createCustomerRepo } from '@/adapter/secondary/repository/customer/customer.repo'
import { createProductRepo } from '@/adapter/secondary/repository/product/product.repo'
import { createProjectRepo } from '@/adapter/secondary/repository/project/project.repo'
import { transactor } from '@/common/executor'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createProductUsecase } from '@/modules/product/product.usecase'
import { createProjectUsecase } from '@/modules/project/project.usecase'

import { createProjectHandler } from './project.handler'
import * as Schema from './project.schema'

const repo = createProjectRepo()
const customerRepo = createCustomerRepo()
const contactRepo = createContactRepo()
const productRepo = createProductRepo()
const productUsecase = createProductUsecase(productRepo)
const usecase = createProjectUsecase(repo, customerRepo, contactRepo, productUsecase, transactor)
const handler = createProjectHandler(usecase)

const router = new Hono()

router.post(
  '/',
  authenticate,
  requirePermission('projects.create'),
  validate(Schema.createProjectSchema),
  handler.create,
)
router.get(
  '/',
  authenticate,
  requirePermission('projects.view'),
  validateQuery(Schema.getProjectListSchema),
  handler.findList,
)
router.get('/template', authenticate, requirePermission('projects.view'), handler.downloadTemplate)
router.post(
  '/import/dry-run',
  authenticate,
  requirePermission('projects.create'),
  handler.dryRunImport,
)
router.post('/import', authenticate, requirePermission('projects.create'), handler.executeImport)

router.get('/visits', authenticate, requirePermission('project_visits.view'), handler.findAllVisits)
router.get('/map', authenticate, requirePermission('projects.view'), handler.findMapMarkers)
router.post(
  '/visits',
  authenticate,
  requirePermission('project_visits.create'),
  validate(Schema.createProjectVisitSchema),
  handler.createVisit,
)
router.get('/:id', authenticate, requirePermission('projects.view'), handler.findById)
router.put(
  '/:id',
  authenticate,
  requirePermission('projects.update'),
  validate(Schema.updateProjectSchema),
  handler.update,
)
router.delete('/:id', authenticate, requirePermission('projects.delete'), handler.delete)
router.get(
  '/:id/visits',
  authenticate,
  requirePermission('project_visits.view'),
  handler.findVisitsByProjectId,
)

export default router
