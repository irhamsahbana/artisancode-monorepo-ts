import { relations } from 'drizzle-orm'

import {
  broadcastLogs,
  broadcastTemplates,
  categories,
  contacts,
  customerRatings,
  customers,
  permissions,
  projectVisits,
  projects,
  quotations,
  rolePermissions,
  roles,
  unitConversions,
  uoms,
  users,
} from './tables'

// ---------------------------------------------------------------------------
// Role & Permission
// ---------------------------------------------------------------------------
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  rolePermissions: many(rolePermissions),
}))

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}))

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}))

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------
export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, { fields: [users.roleId], references: [roles.id] }),
}))

// ---------------------------------------------------------------------------
// Category (self-referential hierarchy)
// ---------------------------------------------------------------------------
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'categoryHierarchy',
  }),
  children: many(categories, { relationName: 'categoryHierarchy' }),
}))

// ---------------------------------------------------------------------------
// UoM & conversions
// ---------------------------------------------------------------------------
export const uomsRelations = relations(uoms, ({ many }) => ({
  conversionsFrom: many(unitConversions, { relationName: 'fromUnit' }),
  conversionsTo: many(unitConversions, { relationName: 'toUnit' }),
}))

export const unitConversionsRelations = relations(unitConversions, ({ one }) => ({
  fromUnit: one(uoms, {
    fields: [unitConversions.fromUnitId],
    references: [uoms.id],
    relationName: 'fromUnit',
  }),
  toUnit: one(uoms, {
    fields: [unitConversions.toUnitId],
    references: [uoms.id],
    relationName: 'toUnit',
  }),
}))

// ---------------------------------------------------------------------------
// Customer & Contact
// ---------------------------------------------------------------------------
export const customersRelations = relations(customers, ({ many }) => ({
  contacts: many(contacts),
  projects: many(projects),
  ratings: many(customerRatings),
}))

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  customer: one(customers, { fields: [contacts.customerId], references: [customers.id] }),
  projects: many(projects),
  ratings: many(customerRatings),
}))

// ---------------------------------------------------------------------------
// Project & visits & quotation
// ---------------------------------------------------------------------------
export const projectsRelations = relations(projects, ({ one, many }) => ({
  customer: one(customers, { fields: [projects.customerId], references: [customers.id] }),
  contact: one(contacts, { fields: [projects.contactId], references: [contacts.id] }),
  visits: many(projectVisits),
  quotations: many(quotations),
}))

export const projectVisitsRelations = relations(projectVisits, ({ one }) => ({
  project: one(projects, { fields: [projectVisits.projectId], references: [projects.id] }),
}))

export const quotationsRelations = relations(quotations, ({ one }) => ({
  project: one(projects, { fields: [quotations.projectId], references: [projects.id] }),
}))

// ---------------------------------------------------------------------------
// CustomerRating
// ---------------------------------------------------------------------------
export const customerRatingsRelations = relations(customerRatings, ({ one }) => ({
  customer: one(customers, {
    fields: [customerRatings.customerId],
    references: [customers.id],
  }),
  contact: one(contacts, {
    fields: [customerRatings.contactId],
    references: [contacts.id],
  }),
}))

// ---------------------------------------------------------------------------
// Broadcast
// ---------------------------------------------------------------------------
export const broadcastTemplatesRelations = relations(broadcastTemplates, ({ many }) => ({
  logs: many(broadcastLogs),
}))

export const broadcastLogsRelations = relations(broadcastLogs, ({ one }) => ({
  template: one(broadcastTemplates, {
    fields: [broadcastLogs.templateId],
    references: [broadcastTemplates.id],
  }),
}))
