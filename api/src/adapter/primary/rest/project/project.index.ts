import { Hono } from 'hono'

import { createProjectRepo } from '@/adapter/secondary/repository/project/project.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createProjectUsecase } from '@/modules/project/project.usecase'

import { createProjectHandler } from './project.handler'
import * as Schema from './project.schema'

const repo = createProjectRepo()
const usecase = createProjectUsecase(repo)
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
