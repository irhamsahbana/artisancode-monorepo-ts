import HealthRepo from '@/adapter/secondary/repository/health/health.repo'
import HealthUsecase from '@/modules/health/health.usecase'

import healthHandler from './health.handler'

const repo = new HealthRepo()
const usecase = new HealthUsecase(repo)
const handler = healthHandler(usecase)

export default handler
