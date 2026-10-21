import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IContactUsecase } from '@/contracts/contact.contract'
import * as Entity from '@/entities/contact.entity'

import { createContactHandler } from '../contact.handler'

describe('ContactHandler - search', () => {
  const mockContact: Entity.Contact = {
    id: 'ct-1',
    customerId: 'cust-1',
    name: 'Budi Santoso',
    position: 'Project Manager',
    whatsapp: '08123456789',
    countryCode: '62',
    email: 'budi@wika.com',
    landline: null,
    landlineCountryCode: '62',
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
    search: mock(async () => [mockContact]),
  } as unknown as IContactUsecase

  const handler = createContactHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/search', handler.search)

  it('should return 200 with search results', async () => {
    const res = await app.request('/search?q=Budi')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.length).toBe(1)
    expect(mockUsecase.search).toHaveBeenCalledWith('Budi')
  })
})
