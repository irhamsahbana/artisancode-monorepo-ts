import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IProjectRepo } from '@/contracts/project.contract'
import { projects, projectVisits } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

function toEntity(data: typeof projects.$inferSelect): Entity.Project {
  return {
    id: data.id,
    projectNumber: data.projectNumber,
    customerId: data.customerId,
    contactId: data.contactId,
    name: data.name,
    location: data.location,
    latitude: data.latitude ? Number(data.latitude) : null,
    longitude: data.longitude ? Number(data.longitude) : null,
    sourceOfFunds: data.sourceOfFunds,
    picName: data.picName,
    status: data.status,
    estimatedValue: data.estimatedValue ? Number(data.estimatedValue) : null,
    spkNumber: data.spkNumber,
    lostReason: data.lostReason,
    winnerCompetitor: data.winnerCompetitor,
    products: data.products,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

function visitToEntity(data: typeof projectVisits.$inferSelect): Entity.ProjectVisit {
  return {
    id: data.id,
    projectId: data.projectId,
    visitDate: data.visitDate,
    metWith: data.metWith,
    topic: data.topic,
    notes: data.notes,
    createdAt: data.createdAt,
  }
}

function generateProjectNumber(): string {
  return `PRJ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

export function createProjectRepo(): IProjectRepo {
  return {
    create: async (req) => {
      const [row] = await getExecutor()
        .insert(projects)
        .values({
          projectNumber: req.projectNumber || generateProjectNumber(),
          customerId: req.customerId,
          contactId: req.contactId ?? null,
          name: req.name,
          location: req.location,
          latitude: req.latitude?.toString(),
          longitude: req.longitude?.toString(),
          sourceOfFunds: req.sourceOfFunds,
          picName: req.picName,
          status: req.status ?? 'prospect',
          estimatedValue: req.estimatedValue?.toString(),
          spkNumber: req.spkNumber,
          lostReason: req.lostReason,
          winnerCompetitor: req.winnerCompetitor,
          products: (req.products ?? []).map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
          })),
          notes: req.notes,
        })
        .returning()
      return toEntity(row)
    },

    findById: async (id) => {
      const [row] = await getExecutor()
        .select()
        .from(projects)
        .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
        .limit(1)
      return row ? toEntity(row) : null
    },

    findList: async (req) => {
      const { pagination = {}, q, status, customerId } = req
      const { page = 1, per_page = 10 } = pagination
      const offset = (page - 1) * per_page

      const conditions = [isNull(projects.deletedAt)]
      if (q) {
        const search = or(
          ilike(projects.name, `%${q}%`),
          ilike(projects.location, `%${q}%`),
          ilike(projects.projectNumber, `%${q}%`),
        )
        if (search) conditions.push(search)
      }
      if (status) conditions.push(eq(projects.status, status))
      if (customerId) conditions.push(eq(projects.customerId, customerId))
      const where = and(...conditions)

      const exec = getExecutor()
      const [items, countResult] = await Promise.all([
        exec
          .select()
          .from(projects)
          .where(where)
          .orderBy(sql`${projects.createdAt} desc`)
          .limit(per_page)
          .offset(offset),
        exec
          .select({ count: sql<number>`count(*)::int` })
          .from(projects)
          .where(where),
      ])

      const total = countResult[0]?.count ?? 0
      return {
        items: items.map(toEntity),
        pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
      }
    },

    update: async (req) => {
      const updates: Partial<typeof projects.$inferInsert> = { updatedAt: new Date() }
      if (req.projectNumber !== undefined) updates.projectNumber = req.projectNumber
      if (req.customerId !== undefined) updates.customerId = req.customerId
      if (req.contactId !== undefined) updates.contactId = req.contactId
      if (req.name !== undefined) updates.name = req.name
      if (req.location !== undefined) updates.location = req.location
      if (req.latitude !== undefined) updates.latitude = req.latitude?.toString()
      if (req.longitude !== undefined) updates.longitude = req.longitude?.toString()
      if (req.sourceOfFunds !== undefined) updates.sourceOfFunds = req.sourceOfFunds
      if (req.picName !== undefined) updates.picName = req.picName
      if (req.status !== undefined) updates.status = req.status
      if (req.estimatedValue !== undefined) updates.estimatedValue = req.estimatedValue?.toString()
      if (req.spkNumber !== undefined) updates.spkNumber = req.spkNumber
      if (req.lostReason !== undefined) updates.lostReason = req.lostReason
      if (req.winnerCompetitor !== undefined) updates.winnerCompetitor = req.winnerCompetitor
      if (req.products !== undefined)
        updates.products = req.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        }))
      if (req.notes !== undefined) updates.notes = req.notes

      const [row] = await getExecutor()
        .update(projects)
        .set(updates)
        .where(and(eq(projects.id, req.id), isNull(projects.deletedAt)))
        .returning()
      return row ? toEntity(row) : null
    },

    delete: async (id) => {
      await getExecutor()
        .update(projects)
        .set({ deletedAt: new Date() })
        .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
    },

    createVisit: async (req) => {
      const [row] = await getExecutor()
        .insert(projectVisits)
        .values({
          projectId: req.projectId,
          visitDate: req.visitDate,
          metWith: req.metWith,
          topic: req.topic,
          notes: req.notes,
        })
        .returning()
      return visitToEntity(row)
    },

    findVisitsByProjectId: async (projectId) => {
      const rows = await getExecutor()
        .select()
        .from(projectVisits)
        .where(eq(projectVisits.projectId, projectId))
        .orderBy(desc(projectVisits.visitDate))
      return rows.map(visitToEntity)
    },

    findAllVisits: async () => {
      const rows = await getExecutor()
        .select()
        .from(projectVisits)
        .orderBy(desc(projectVisits.visitDate))
      return rows.map(visitToEntity)
    },
  }
}
