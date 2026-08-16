import { Hono } from 'hono'

import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'

import { createProjectHandler } from './project.handler'
import { createProjectRepo } from './project.repo'
import * as Schema from './project.schema'
import { createProjectUsecase } from './project.usecase'

const repo = createProjectRepo()
const usecase = createProjectUsecase(repo)
const handler = createProjectHandler(usecase)

const router = new Hono()

router.post('/', authenticate, validate(Schema.createProjectSchema), handler.create)
router.get('/', authenticate, validateQuery(Schema.getProjectListSchema), handler.findList)
router.get('/visits', authenticate, handler.findAllVisits)
router.post('/visits', authenticate, validate(Schema.createProjectVisitSchema), handler.createVisit)
router.get('/:id', authenticate, handler.findById)
router.put('/:id', authenticate, validate(Schema.updateProjectSchema), handler.update)
router.delete('/:id', authenticate, handler.delete)
router.get('/:id/visits', authenticate, handler.findVisitsByProjectId)

export default router
