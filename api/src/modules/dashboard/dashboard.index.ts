import { AppEnv } from '@artisancode/types'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { Context } from 'hono'

import { getExecutor } from '@/common/executor'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { categories, customers } from '@/db/schema'

const router = new Hono()

router.get('/', authenticate, async (c: Context<AppEnv>) => {
  const user = getUserContext()
  const companyId = user?.company_id || ''

  const base = and(eq(customers.companyId, companyId), isNull(customers.deletedAt))
  const exec = getExecutor()

  const [totals, byStatus, byType, byCategory, byArea, byPotential] = await Promise.all([
    exec
      .select({
        total: sql<number>`count(*)::int`,
        totalProspects: sql<number>`count(*) filter (where ${customers.status} = 'prospect')::int`,
        totalActive: sql<number>`count(*) filter (where ${customers.status} = 'active')::int`,
        totalInactive: sql<number>`count(*) filter (where ${customers.status} = 'inactive')::int`,
        withContractHistory: sql<number>`count(*) filter (where ${customers.hasContractHistory} = true)::int`,
        highPotential: sql<number>`count(*) filter (where ${customers.potential} = 'high')::int`,
      })
      .from(customers)
      .where(base),

    exec
      .select({ status: customers.status, count: sql<number>`count(*)::int` })
      .from(customers)
      .where(base)
      .groupBy(customers.status),

    exec
      .select({ type: customers.type, count: sql<number>`count(*)::int` })
      .from(customers)
      .where(base)
      .groupBy(customers.type),

    exec
      .select({
        categoryId: customers.categoryId,
        name: categories.name,
        count: sql<number>`count(*)::int`,
      })
      .from(customers)
      .leftJoin(categories, eq(customers.categoryId, categories.id))
      .where(base)
      .groupBy(customers.categoryId, categories.name),

    exec
      .select({
        areaId: customers.areaId,
        name: categories.name,
        count: sql<number>`count(*)::int`,
      })
      .from(customers)
      .leftJoin(categories, eq(customers.areaId, categories.id))
      .where(base)
      .groupBy(customers.areaId, categories.name),

    exec
      .select({ potential: customers.potential, count: sql<number>`count(*)::int` })
      .from(customers)
      .where(base)
      .groupBy(customers.potential),
  ])

  const t = totals[0] ?? {
    total: 0,
    totalProspects: 0,
    totalActive: 0,
    totalInactive: 0,
    withContractHistory: 0,
    highPotential: 0,
  }

  return c.json(
    responseSuccess({
      totalCustomers: t.total,
      totalProspects: t.totalProspects,
      totalActive: t.totalActive,
      totalInactive: t.totalInactive,
      withContractHistory: t.withContractHistory,
      highPotential: t.highPotential,
      byStatus: byStatus.map((r) => ({ status: r.status, count: r.count })),
      byType: byType.map((r) => ({ type: r.type, count: r.count })),
      byCategory: byCategory
        .filter((r) => r.categoryId)
        .map((r) => ({ categoryId: r.categoryId ?? '', name: r.name ?? '', count: r.count })),
      byArea: byArea
        .filter((r) => r.areaId)
        .map((r) => ({ areaId: r.areaId ?? '', name: r.name ?? '', count: r.count })),
      byPotential: byPotential.map((r) => ({ potential: r.potential, count: r.count })),
    }),
  )
})

export default router
