import { ThemeProvider } from 'next-themes'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'

import { AppLayout } from '@/components/layout/app-layout'
import { Toaster } from '@/components/ui/sonner'
import { AccountSettings } from '@/pages/account-settings'
import { BusinessProfile } from '@/pages/business-profile'
import { CustomerDetail } from '@/pages/customers/customer-detail'
import { CustomerForm } from '@/pages/customers/customer-form'
import { CustomerList } from '@/pages/customers/customer-list'
import { Dashboard } from '@/pages/dashboard'
import { Login } from '@/pages/login'
import { Areas } from '@/pages/master/areas'
import { CustomerTypes } from '@/pages/master/customer-types'
import { RelationStatus } from '@/pages/master/relation-status'
import { Segmentation } from '@/pages/master/segmentation'
import './index.css'

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'customers/new', element: <CustomerForm /> },
      { path: 'customers/:id', element: <CustomerDetail /> },
      { path: 'customers/:id/edit', element: <CustomerForm /> },
      { path: 'master/customer-types', element: <CustomerTypes /> },
      { path: 'master/segmentation', element: <Segmentation /> },
      { path: 'master/areas', element: <Areas /> },
      { path: 'master/relation-status', element: <RelationStatus /> },
      { path: 'settings/profile', element: <BusinessProfile /> },
      { path: 'settings/account', element: <AccountSettings /> },
    ],
  },
])

const elem = document.getElementById('root')
if (!elem) throw new Error('Missing #root element')

const app = (
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
)

if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem))
  root.render(app)
} else {
  createRoot(elem).render(app)
}
