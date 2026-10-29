import { Elysia, t } from 'elysia'
import { mart, SearchOpts } from './service'
import * as MartModel from './model'

export const martRoute = new Elysia({ prefix: '/api/products' })
    .get(
        '/',
        {
            query: t.Object({
                q: t.Optional(t.String({ description: 'Space-separated keywords. Every keyword must match name, SKU, slug, or description.', maxLength: 200 })),
                limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20, description: 'Page size' })),
                offset: t.Optional(t.Numeric({ minimum: 0, default: 0, description: 'Rows to skip' }))
            }),
        },
        ({ query }) => mart.GetMarts(query)
    )
    .get('/:slug', ({ params }) => mart.GetMart(params.slug))
    .post('/', {
        body: MartModel.CreateMartBody
    }, ({ body }) => mart.CreateMart(body))
    .patch('/:id', {
        body: t.Partial(MartModel.CreateMartBody)
    }, ({ params, body }) => mart.UpdateMart(params.id, body))
    .delete('/:id', ({ params }) => mart.DeleteMart(params.id))