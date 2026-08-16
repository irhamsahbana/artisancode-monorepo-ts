import { Hono } from 'hono'

import roleAndPermissionRouter from '@/adapter/primary/rest/role_and_permission/role_and_permission.index'
import broadcastRouter from '@/modules/broadcast/broadcast.index'
import businessProfileRouter from '@/modules/business_profile/business_profile.index'
import categoryRouter from '@/modules/category/category.index'
import contactRouter from '@/modules/contact/contact.index'
import customerRouter from '@/modules/customer/customer.index'
import dashboardRouter from '@/modules/dashboard/dashboard.index'
import healthRouter from '@/modules/health/health.index'
import productRouter from '@/modules/product/product.index'
import projectRouter from '@/modules/project/project.index'
import quotationRouter from '@/modules/quotation/quotation.index'
import ratingRouter from '@/modules/rating/rating.index'
import uomRouter, { unitConversionRouter } from '@/modules/uom/uom.index'
import userRouter from '@/modules/user/user.index'

const router = new Hono()

// Infrastructure
router.route('/health', healthRouter)

// Identity & Access
router.route('/users', userRouter)
router.route('/role-and-permissions', roleAndPermissionRouter)
router.route('/roles', roleAndPermissionRouter) // Alias to fix frontend path mismatch

// Core CRM
router.route('/business-profile', businessProfileRouter)
router.route('/dashboard', dashboardRouter)
router.route('/categories', categoryRouter)
router.route('/customers', customerRouter)
router.route('/contacts', contactRouter)

// Catalog & Project
router.route('/uoms', uomRouter)
router.route('/unit-conversions', unitConversionRouter)
router.route('/products', productRouter)
router.route('/projects', projectRouter)
router.route('/quotations', quotationRouter)
router.route('/ratings', ratingRouter)

// Marketing
router.route('/broadcasts', broadcastRouter)

export default router
