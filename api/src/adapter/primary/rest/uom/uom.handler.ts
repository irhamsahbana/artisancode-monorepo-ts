import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IUomUsecase } from '@/contracts/uom.contract'
import * as Entity from '@/entities/uom.entity'

// Body schemas validate camelCase keys (frontend convention), pass through directly.
export function createUomHandler(usecase: IUomUsecase) {
  return {
    createUom: async (c: Context<AppEnv>) => {
      const data = await usecase.createUom(c.get('body'))
      return c.json(responseSuccess(data, 'Unit of measurement created successfully'), 201)
    },

    findUomList: async (c: Context<AppEnv>) => {
      const query = c.get('body')?._query || c.req.query()
      const { page, per_page, q, category, is_active } = query as Record<string, string>

      const data = await usecase.findUomList({
        q,
        category: category as Entity.UomCategory | undefined,
        isActive: is_active !== undefined ? is_active === 'true' : undefined,
        pagination: { page: Number(page) || 1, per_page: Number(per_page) || 100 },
      })
      return c.json(responseSuccess(data))
    },

    updateUom: async (c: Context<AppEnv>) => {
      const data = await usecase.updateUom({ ...c.get('body'), id: c.req.param('id') as string })
      return c.json(responseSuccess(data, 'Unit of measurement updated successfully'))
    },

    deleteUom: async (c: Context<AppEnv>) => {
      await usecase.deleteUom(c.req.param('id') as string)
      return c.json(responseSuccess(null, 'Unit of measurement deleted successfully'))
    },

    createConversion: async (c: Context<AppEnv>) => {
      const data = await usecase.createConversion(c.get('body'))
      return c.json(responseSuccess(data, 'Unit conversion created successfully'), 201)
    },

    findConversionList: async (c: Context<AppEnv>) => {
      const query = c.get('body')?._query || c.req.query()
      const { page, per_page } = query as Record<string, string>

      const data = await usecase.findConversionList({
        pagination: { page: Number(page) || 1, per_page: Number(per_page) || 100 },
      })
      return c.json(responseSuccess(data))
    },

    updateConversion: async (c: Context<AppEnv>) => {
      const data = await usecase.updateConversion({
        ...c.get('body'),
        id: c.req.param('id') as string,
      })
      return c.json(responseSuccess(data, 'Unit conversion updated successfully'))
    },

    deleteConversion: async (c: Context<AppEnv>) => {
      await usecase.deleteConversion(c.req.param('id') as string)
      return c.json(responseSuccess(null, 'Unit conversion deleted successfully'))
    },
  }
}
