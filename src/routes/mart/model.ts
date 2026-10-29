// model.ts
import { t } from 'elysia'
import type { InferInsertModel } from 'drizzle-orm'
import { table } from '../../database/schema'

export const CreateMartBody = t.Object({
    slug: t.String(),
    sku: t.String(),
    name: t.String(),
    description: t.String(),
    price: t.Integer(),
    currency: t.String({
        "maxLength": 3,
        "default": 'BDT'
    }),
    stock: t.Integer({
        "default": 0
    }),
    isActive: t.Boolean({
        "default": true
    })
})

export type CreateMartBody = Omit<
    InferInsertModel<typeof table.product>,
    'id' | 'createdAt' | 'updatedAt'
>