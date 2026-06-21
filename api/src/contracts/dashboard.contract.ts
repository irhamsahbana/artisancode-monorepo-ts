import * as Entity from '@/entities/dashboard.entity'

export interface IDashboardRepo {
  getMetrics(req: Entity.GetDashboardReq): Promise<Entity.DashboardMetrics>
}

export interface IDashboardUsecase {
  getMetrics(req: Entity.GetDashboardReq): Promise<Entity.DashboardMetrics>
}
