import { Hono } from 'hono'

import { createUserRepo } from '@/adapter/secondary/repository/user/user.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createUserUsecase } from '@/modules/user/user.usecase'

import { createUserHandlerDeps } from './user.handler'
import * as Schema from './user.schema'

const router = new Hono()
const repo = createUserRepo()
const usecase = createUserUsecase(repo)
const handler = createUserHandlerDeps(usecase)

router.post('/login', validate(Schema.loginSchema), handler.login)
router.post('/logout', authenticate, handler.logout)
router.post('/refresh-token', validate(Schema.refreshTokenSchema), handler.refreshToken)

router.get('/me', authenticate, handler.me)
router.patch('/me', authenticate, validate(Schema.updateAccountSchema), handler.updateAccount)

router.post('/', authenticate, validate(Schema.createUserSchema), handler.create)
router.get('/', authenticate, validateQuery(Schema.getUserListSchema), handler.findList)
router.get('/:id', authenticate, handler.findById)
router.put('/:id', authenticate, validate(Schema.updateUserSchema), handler.update)
router.delete('/:id', authenticate, handler.delete)

export default router
