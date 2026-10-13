import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IContactUsecase } from '@/contracts/contact.contract'
import * as Entity from '@/entities/contact.entity'

import { createContactHandler } from '../contact.handler'

describe('ContactHandler - update', () => {
  const mockContact: Entity.Contact = {
    id: 'ct-1',
    customerId: 'cust-1',
    name: 'Budi Updated',
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
    update: mock(async () => mockContact),
  } as unknown as IContactUsecase

  const handler = createContactHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.put('/:id', (c) => {
    c.set('body', { name: 'Budi Updated' } as any)
    return handler.update(c)
  })

  it('should return 200 with updated contact', async () => {
    const res = await app.request('/ct-1', { method: 'PUT' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('Budi Updated')
    expect(mockUsecase.update).toHaveBeenCalled()
  })
})
