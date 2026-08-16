import * as schema from '../schema'
import { db } from './client'

const { unitConversions } = schema

// From web/src/data/unit-conversions.ts — 1 fromUnitId = factor * toUnitId
const UNIT_CONVERSIONS = [
  { fromUnitId: 'uom3', toUnitId: 'uom1', factor: '40' }, // Sak -> Kilogram
  { fromUnitId: 'uom1', toUnitId: 'uom2', factor: '1000' }, // Kilogram -> Gram
  { fromUnitId: 'uom4', toUnitId: 'uom5', factor: '1000' }, // Meter Kubik -> Liter
] as const

export async function seedUnitConversions(uomIds: Map<string, string>) {
  let total = 0
  for (const conversion of UNIT_CONVERSIONS) {
    const fromUnitId = uomIds.get(conversion.fromUnitId)
    const toUnitId = uomIds.get(conversion.toUnitId)
    if (!fromUnitId || !toUnitId) {
      console.log(`  Skipping unit conversion - uom not found`)
      continue
    }
    const existing = await db.query.unitConversions.findFirst({
      where: (t, { eq, and }) => and(eq(t.fromUnitId, fromUnitId), eq(t.toUnitId, toUnitId)),
    })
    if (existing) {
      total++
      continue
    }
    await db.insert(unitConversions).values({ fromUnitId, toUnitId, factor: conversion.factor })
    total++
  }
  console.log(`  unit_conversions: ${total} records`)
}
