import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProductUsecase } from '@/contracts/product.contract'
import * as Entity from '@/entities/product.entity'

export function createProductHandler(usecase: IProductUsecase) {
  return {
    create: async (c: Context<AppEnv>) => {
      const data = await usecase.create(c.get('body'))
      return c.json(responseSuccess(data, 'Product created successfully'), 201)
    },

    findList: async (c: Context<AppEnv>) => {
      const query = c.get('body')?._query || c.req.query()
      const { page, per_page, q, is_active } = query as Record<string, string>

      const data = await usecase.findList({
        q,
        isActive: is_active !== undefined ? is_active === 'true' : undefined,
        pagination: { page: Number(page) || 1, per_page: Number(per_page) || 100 },
      })
      return c.json(responseSuccess(data))
    },

    update: async (c: Context<AppEnv>) => {
      const payload: Entity.UpdateProductReq = { ...c.get('body'), id: c.req.param('id') as string }
      const data = await usecase.update(payload)
      return c.json(responseSuccess(data, 'Product updated successfully'))
    },

    delete: async (c: Context<AppEnv>) => {
      await usecase.delete(c.req.param('id') as string)
      return c.json(responseSuccess(null, 'Product deleted successfully'))
    },
  }
}
