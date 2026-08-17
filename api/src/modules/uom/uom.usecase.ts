import { AppError, ErrorCode } from '@artisancode/types'

import { IUomRepo, IUomUsecase } from '@/contracts/uom.contract'

export interface UomUsecaseDeps {
  repo: IUomRepo
}

export function createUomUsecase(repo: IUomRepo): IUomUsecase {
  const deps: UomUsecaseDeps = { repo }

  return {
    createUom: (req) => deps.repo.createUom(req),

    findUomList: (req) => deps.repo.findUomList(req),

    updateUom: async (req) => {
      const item = await deps.repo.updateUom(req)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Unit of measurement not found')
      return item
    },

    deleteUom: async (id) => {
      const conversionCount = await deps.repo.countConversionsForUom(id)
      if (conversionCount > 0) {
        throw new AppError(
          ErrorCode.CONFLICT,
          `Cannot delete: still used by ${conversionCount} unit conversion(s)`,
        )
      }
      await deps.repo.deleteUom(id)
    },

    createConversion: async (req) => {
      if (req.fromUnitId === req.toUnitId) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          'from_unit_id and to_unit_id must be different',
        )
      }
      return deps.repo.createConversion(req)
    },

    findConversionList: (req) => deps.repo.findConversionList(req),

    updateConversion: async (req) => {
      const item = await deps.repo.updateConversion(req)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Unit conversion not found')
      return item
    },

    deleteConversion: (id) => deps.repo.deleteConversion(id),
  }
}
