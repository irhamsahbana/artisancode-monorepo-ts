import { AppEnv, AppError, ErrorCode } from '@artisancode/types'
import { Hono } from 'hono'
import { Context } from 'hono'

import { createBusinessProfileRepo } from '@/adapter/secondary/repository/business_profile/business_profile.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { RateLimitKey, rateLimit } from '@/common/middlewares/rate_limit.middleware'
import { validate } from '@/common/middlewares/validation.middleware'
import { responseSuccess } from '@/common/rest_response'
import {
  ICON_EXT_BY_MIME,
  MAX_ICON_SIZE_BYTES,
  deleteIcon,
  saveIcon,
} from '@/common/storage/branding-storage'
import * as Entity from '@/entities/business_profile.entity'
import { createBusinessProfileUsecase } from '@/modules/business_profile/business_profile.usecase'

import * as Schema from './business_profile.schema'

const repo = createBusinessProfileRepo()
const usecase = createBusinessProfileUsecase(repo)

const router = new Hono()

router.get(
  '/',
  authenticate,
  requirePermission('business_profiles.view'),
  async (c: Context<AppEnv>) => {
    const data = await usecase.find()
    return c.json(responseSuccess(data))
  },
)

router.patch(
  '/',
  authenticate,
  requirePermission('business_profiles.update'),
  validate(Schema.updateBusinessProfileSchema),
  async (c: Context<AppEnv>) => {
    const body = c.get('body')

    const payload: Entity.UpdateBusinessProfileReq = {
      name: body.name,
      businessType: body.business_type,
      phone: body.phone,
      countryCode: body.country_code,
      email: body.email,
      address: body.address,
    }

    const data = await usecase.update(payload)
    return c.json(responseSuccess(data, 'Business profile updated successfully'))
  },
)

router.post(
  '/icon',
  authenticate,
  requirePermission('business_profiles.update'),
  async (c: Context<AppEnv>) => {
    const body = await c.req.parseBody()
    const file = body.file
    if (!(file instanceof File)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'File ikon wajib diunggah')
    }

    const ext = ICON_EXT_BY_MIME[file.type]
    if (!ext) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, `Tipe file tidak didukung: ${file.type}`)
    }
    if (file.size > MAX_ICON_SIZE_BYTES) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Ukuran file maksimal 2MB')
    }

    const filename = await saveIcon(file, ext)
    const data = await usecase.update({ iconFilename: filename })
    return c.json(responseSuccess(data, 'Icon berhasil diperbarui'))
  },
)

router.delete(
  '/icon',
  authenticate,
  requirePermission('business_profiles.update'),
  async (c: Context<AppEnv>) => {
    await deleteIcon()
    const data = await usecase.update({ iconFilename: null })
    return c.json(responseSuccess(data, 'Icon dihapus'))
  },
)

// Public — unauthenticated by design, so the login page (pre-auth) can also
// show the business name in the tab title. Rate-limited since it's public.
router.get(
  '/branding',
  rateLimit({ windowMs: 60 * 1000, max: 30, keyPrefix: RateLimitKey.BUSINESS_BRANDING }),
  async (c: Context<AppEnv>) => {
    const data = await usecase.branding()
    return c.json(responseSuccess(data))
  },
)

export default router
