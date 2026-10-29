import openapi from '@elysia/openapi'
import { Elysia, file } from 'elysia'
import { martRoute } from './routes/mart'
import { cors } from '@elysia/cors'
import { staticPlugin } from '@elysia/static'
// import { auth } from './routes/auth'

export const app = new Elysia()
    .use(cors({
        "credentials": true,
        "exposeHeaders": true,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "origin": ["*"]
    }))
    .use(staticPlugin())
    .use(openapi())
    .get('/', () => file('public/index.html'))
    .use(martRoute)

export type App = typeof app