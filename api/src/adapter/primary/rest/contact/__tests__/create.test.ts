import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IContactUsecase } from '@/contracts/contact.contract'
import * as Entity from '@/entities/contact.entity'

import { createContactHandler } from '../contact.handler'

describe('ContactHandler - create', () => {
  const mockContact: Entity.Contact = {
    id: 'ct-1',
    customerId: 'cust-1',
    name: 'Budi Santoso',
    position: 'Project Manager',
    whatsapp: '08123456789',
    countryCode: '62',
    email: 'budi@wika.com',
    gender: 'male',
    birthPlace: null,
    dateOfBirth: null,
    religion: null,
    education: null,
    address: null,
    spouseName: null,
    spouseOccupation: null,
    childrenNames: null,
    childrenOccupation: null,
    profiling: null,
    notes: null,
    isPrimary: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const mockUsecase = {
    create: mock(async () => mockContact),
    findById: mock(async () => mockContact),
    findList: mock(async () => ({ items: [mockContact], pagination: { total: 1, page: 1, per_page: 10, last_page: 1 } })),
    search: mock(async () => [mockContact]),
    searchPersons: mock(async () => ({ items: [], pagination: { total: 0, page: 1, per_page: 10, last_page: 1 } })),
    update: mock(async () => mockContact),
    delete: mock(async () => {}),
  } as unknown as IContactUsecase

  const handler = createContactHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/', (c) => {
    c.set('body', { customer_id: 'cust-1', name: 'Budi Santoso' } as any)
    return handler.create(c)
  })

  it('should return 201 with created contact', async () => {
    const res = await app.request('/', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('ct-1')
    expect(mockUsecase.create).toHaveBeenCalled()
  })
})
