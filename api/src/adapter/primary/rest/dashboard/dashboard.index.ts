import { AppEnv } from '@artisancode/types'
import { Context, Hono } from 'hono'

import { createDashboardRepo } from '@/adapter/secondary/repository/dashboard/dashboard.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { responseSuccess } from '@/common/rest_response'
import { createDashboardUsecase } from '@/modules/dashboard/dashboard.usecase'

const repo = createDashboardRepo()
const usecase = createDashboardUsecase(repo)

const router = new Hono()

router.get('/', authenticate, async (c: Context<AppEnv>) => {
  const data = await usecase.getMetrics({})
  return c.json(responseSuccess(data))
})

export default router
