import { eq, desc, ilike, or, sql, getTableColumns, and } from 'drizzle-orm'
import { status } from 'elysia'

import { table } from '../../database/schema'
import type { CreateMartBody } from './model'
import { db } from '../../lib/db'

const { product } = table

const escapeLike = (s: string) => s.replace(/[\\%_]/g, '\\$&')

export type SearchOpts = { q?: string; limit?: number; offset?: number }


export const mart = {
    async GetMarts({ q, limit = 20, offset = 0 }: SearchOpts = {}) {
        // "steel  Water pot" -> ["steel", "water", "pot"] (deduped, capped at 8)
        const terms = [...new Set((q ?? '').toLowerCase().split(/\s+/).filter(Boolean))].slice(0, 8)

        // Each keyword must match at least one field (AND across keywords, OR across fields)
        const termFilters = terms.map((t) => {
            const p = `%${escapeLike(t)}%`
            return or(
                ilike(product.name, p),
                ilike(product.sku, p),
                ilike(product.slug, p),
                ilike(product.description, p)
            )
        })

        // Relevance: name hit = 5, sku/slug hit = 3, description hit = 1, summed over keywords
        const score = terms.length
            ? sql<number>`(${sql.join(
                terms.map((t) => {
                    const p = `%${escapeLike(t)}%`
                    return sql`(
                      (case when ${product.name} ilike ${p} then 5 else 0 end) +
                      (case when ${product.sku} ilike ${p} or ${product.slug} ilike ${p} then 3 else 0 end) +
                      (case when ${product.description} ilike ${p} then 1 else 0 end)
                  )`
                }),
                sql` + `
            )})`
            : sql<number>`0`

        const rows = await db
            .select({
                ...getTableColumns(product),
                score,
                total: sql<number>`count(*) over()`.mapWith(Number)
            })
            .from(product)
            .where(and(eq(product.isActive, true), ...termFilters))
            .orderBy(...(terms.length ? [desc(score)] : []), desc(product.createdAt))
            .limit(limit)
            .offset(offset)

        return {
            items: rows.map(({ total, score, ...item }) => item),
            total: rows[0]?.total ?? 0,
            limit,
            offset
        }
    },

    async GetMart(slug: string) {
        const [row] = await db.select().from(product).where(eq(product.slug, slug))
        if (!row) throw status(404, {
            message: 'Product not found',
            slug,
            code: 404
        })
        return {
            data: row,
            message: `Product with slug ${slug} found`
        }
    },

    async CreateMart(body: CreateMartBody) {
        try {
            const [row] = await db.insert(product).values(body).returning()
            return row
        } catch (e: any) {
            // 23505 = unique_violation (slug or sku already exists)
            if ((e.cause?.code ?? e.code) === '23505') {
                throw status(409, {
                    message: 'Product with the same slug or SKU already exists',
                    code: 409
                })
            }
            throw e
        }
    },

    async UpdateMart(id: string, body: Partial<CreateMartBody>) {
        const [row] = await db
            .update(product)
            .set(body)
            .where(eq(product.id, id))
            .returning()
        if (!row) throw status(404, {
            message: 'Product not found',
            id,
            code: 404
        })
        return row
    },

    async DeleteMart(id: string) {
        const [row] = await db
            .delete(product)
            .where(eq(product.id, id))
            .returning()
        if (!row) throw status(404, {
            message: 'Product not found',
            id,
            code: 404
        })
        return { data: row, message: `Product with ID ${id} deleted` }
    }
}