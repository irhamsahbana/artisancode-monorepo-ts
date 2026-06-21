import { Hono } from 'hono'

import activityLogRouter from '@/modules/activity_log/activity_log.index'
import branchRouter from '@/modules/branch/branch.index'
import businessProfileRouter from '@/modules/business_profile/business_profile.index'
import categoryRouter from '@/modules/category/category.index'
import companyRouter from '@/modules/company/company.index'
import contactRouter from '@/modules/contact/contact.index'
import customerRouter from '@/modules/customer/customer.index'
import dashboardRouter from '@/modules/dashboard/dashboard.index'
import enrollmentRouter from '@/modules/enrollment/enrollment.index'
import healthRouter from '@/modules/health/health.index'
import invoiceRouter from '@/modules/invoice/invoice.index'
import masterRouter from '@/modules/master/master.index'
import programRouter from '@/modules/program/program.index'
import roleAndPermissionRouter from '@/modules/role_and_permission/role_and_permission.index'
import storageRouter from '@/modules/storage/storage.index'
import studentRouter from '@/modules/student/student.index'
import teacherRouter from '@/modules/teacher/teacher.index'
import templateRouter from '@/modules/template/template.index'
import userRouter from '@/modules/user/user.index'
import webhookRouter from '@/modules/webhook/webhook.index'

const router = new Hono()

router.route('/health', healthRouter)
router.route('/templates', templateRouter)
router.route('/activity-logs', activityLogRouter)
router.route('/companies', companyRouter)
router.route('/branches', branchRouter)
router.route('/categories', categoryRouter)
router.route('/programs', programRouter)
router.route('/students', studentRouter)
router.route('/teachers', teacherRouter)
router.route('/enrollments', enrollmentRouter)
router.route('/invoices', invoiceRouter)
router.route('/users', userRouter)
router.route('/role-and-permissions', roleAndPermissionRouter)
router.route('/storage', storageRouter)
router.route('/webhooks', webhookRouter)
// CRM routes
router.route('/master', masterRouter)
router.route('/customers', customerRouter)
router.route('/contacts', contactRouter)
router.route('/business-profile', businessProfileRouter)
router.route('/dashboard', dashboardRouter)

export default router
