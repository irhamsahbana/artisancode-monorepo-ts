import { Hono } from 'hono'

import { createHealthRepo } from '@/adapter/secondary/repository/health/health.repo'
import { createHealthUsecase } from '@/modules/health/health.usecase'

import { createHealthHandler } from './health.handler'

const repo = createHealthRepo()
const usecase = createHealthUsecase(repo)
const handler = createHealthHandler(usecase)

const router = new Hono()
router.get('/', handler.check)

export default router
