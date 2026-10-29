import { pgTable, varchar, timestamp, text, integer, boolean, char, check } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

export const product = pgTable(
    'product',
    {
        id: varchar('id', { length: 128 }).$defaultFn(() => createId()).primaryKey(),
        slug: varchar('slug', { length: 256 }).notNull().unique(),
        sku: varchar('sku', { length: 256 }).notNull().unique(),
        name: varchar('name', { length: 256 }).notNull(),
        description: text('description').notNull(),
        price: integer('price').notNull(),
        currency: char('currency', { length: 3 }).notNull().default('BDT'),
        stock: integer('stock').notNull().default(0),
        isActive: boolean('is_active').notNull().default(true),
        createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { mode: 'date' })
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull()
    },
    (t) => [
        check('price_non_negative', sql`${t.price} >= 0`),
        check('stock_non_negative', sql`${t.stock} >= 0`)
    ]
)

export const table = { product } as const
export type Table = typeof table