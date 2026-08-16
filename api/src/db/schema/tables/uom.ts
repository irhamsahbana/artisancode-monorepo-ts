import { boolean, index, numeric, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core'

import { uomCategoryEnum } from '../enums'
import { defaultId, timestamps } from './helpers'

// ---------------------------------------------------------------------------
// UnitOfMeasurement (e.g. "sak", "kg", "m3")
// ---------------------------------------------------------------------------
export const uoms = pgTable(
  'uoms',
  {
    id: defaultId,
    name: text('name').notNull(),
    symbol: text('symbol').notNull().default(''),
    category: uomCategoryEnum('category').notNull().default('other'),
    isActive: boolean('is_active').notNull().default(true),
    ...timestamps,
  },
  (t) => [unique('uoms_symbol_unique').on(t.symbol), index('uoms_category_idx').on(t.category)],
)

// Meaning: 1 fromUnitId = factor * toUnitId (e.g. from=sak, to=kg, factor=40).
export const unitConversions = pgTable(
  'unit_conversions',
  {
    id: defaultId,
    fromUnitId: uuid('from_unit_id')
      .notNull()
      .references(() => uoms.id, { onDelete: 'cascade' }),
    toUnitId: uuid('to_unit_id')
      .notNull()
      .references(() => uoms.id, { onDelete: 'cascade' }),
    factor: numeric('factor').notNull(),
    ...timestamps,
  },
  (t) => [unique('unit_conversions_from_to_unique').on(t.fromUnitId, t.toUnitId)],
)
