import { Hono } from 'hono'

import { createDashboardRepo } from '@/adapter/secondary/repository/dashboard/dashboard.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { createDashboardUsecase } from '@/modules/dashboard/dashboard.usecase'

import { createDashboardHandler } from './dashboard.handler'

const repo = createDashboardRepo()
const usecase = createDashboardUsecase(repo)
const handler = createDashboardHandler(usecase)

const router = new Hono()

router.get('/', authenticate, handler.getMetrics)

export default router
