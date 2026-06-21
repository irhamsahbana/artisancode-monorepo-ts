export interface DashboardMetrics {
  totalCustomers: number
  totalProspects: number
  totalActive: number
  totalInactive: number
  withContractHistory: number
  highPotential: number
  byStatus: { status: string; count: number }[]
  byType: { type: string; count: number }[]
  byCategory: { categoryId: string; name: string; count: number }[]
  byArea: { areaId: string; name: string; count: number }[]
  byPotential: { potential: string; count: number }[]
}
