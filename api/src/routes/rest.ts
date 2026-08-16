import { Hono } from 'hono'

import broadcastRouter from '@/adapter/primary/rest/broadcast/broadcast.index'
import businessProfileRouter from '@/adapter/primary/rest/business_profile/business_profile.index'
import categoryRouter from '@/adapter/primary/rest/category/category.index'
import contactRouter from '@/adapter/primary/rest/contact/contact.index'
import customerRouter from '@/adapter/primary/rest/customer/customer.index'
import dashboardRouter from '@/adapter/primary/rest/dashboard/dashboard.index'
import healthRouter from '@/adapter/primary/rest/health/health.index'
import productRouter from '@/adapter/primary/rest/product/product.index'
import projectRouter from '@/adapter/primary/rest/project/project.index'
import quotationRouter from '@/adapter/primary/rest/quotation/quotation.index'
import ratingRouter from '@/adapter/primary/rest/rating/rating.index'
import roleAndPermissionRouter from '@/adapter/primary/rest/role_and_permission/role_and_permission.index'
import uomRouter, { unitConversionRouter } from '@/adapter/primary/rest/uom/uom.index'
import userRouter from '@/adapter/primary/rest/user/user.index'

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
