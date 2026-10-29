import openapi from '@elysia/openapi'
import { Elysia } from 'elysia'
import { martRoute } from './routes/mart'
import { cors } from '@elysia/cors'
// import { auth } from './routes/auth'

export const app = new Elysia({
    "prefix": "/api"
})
    .use(cors({
        "credentials": true,
        "exposeHeaders": true,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "origin": ["*"]
    }))
    .use(openapi())
    .use(martRoute)

export type App = typeof app