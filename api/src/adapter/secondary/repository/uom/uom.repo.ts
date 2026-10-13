import { IUomRepo } from '@/contracts/uom.contract'
import { uoms, unitConversions } from '@/db/schema'
import * as Entity from '@/entities/uom.entity'

import { countConversionsForUom } from './uom.repo/count-conversions-for-uom'
import { createConversion } from './uom.repo/create-conversion'
import { createUom } from './uom.repo/create-uom'
import { deleteConversion } from './uom.repo/delete-conversion'
import { deleteUom } from './uom.repo/delete-uom'
import { findConversionList } from './uom.repo/find-conversion-list'
import { findUomList } from './uom.repo/find-uom-list'
import { updateConversion } from './uom.repo/update-conversion'
import { updateUom } from './uom.repo/update-uom'

export interface UomRepoDeps {
  uomToEntity: (data: typeof uoms.$inferSelect) => Entity.UnitOfMeasurement
  conversionToEntity: (data: typeof unitConversions.$inferSelect) => Entity.UnitConversion
}

function uomToEntity(data: typeof uoms.$inferSelect): Entity.UnitOfMeasurement {
  return {
    id: data.id,
    name: data.name,
    symbol: data.symbol,
    category: data.category,
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

function conversionToEntity(data: typeof unitConversions.$inferSelect): Entity.UnitConversion {
  return {
    id: data.id,
    fromUnitId: data.fromUnitId,
    toUnitId: data.toUnitId,
    factor: Number(data.factor),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

export function createUomRepo(): IUomRepo {
  const deps: UomRepoDeps = { uomToEntity, conversionToEntity }

  return {
    createUom: (req) => createUom(deps, req),
    findUomList: (req) => findUomList(deps, req),
    updateUom: (req) => updateUom(deps, req),
    countConversionsForUom: (uomId) => countConversionsForUom(uomId),
    deleteUom: (id) => deleteUom(id),
    createConversion: (req) => createConversion(deps, req),
    findConversionList: (req) => findConversionList(deps, req),
    updateConversion: (req) => updateConversion(deps, req),
    deleteConversion: (id) => deleteConversion(id),
  }
}

export default createUomRepo
