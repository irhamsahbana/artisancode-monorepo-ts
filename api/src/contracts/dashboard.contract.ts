import * as Entity from '@/entities/dashboard.entity'

export interface IDashboardRepo {
  getMetrics(req: Record<never, never>): Promise<Entity.DashboardMetrics>
}

export interface IDashboardUsecase {
  getMetrics(req: Record<never, never>): Promise<Entity.DashboardMetrics>
}
