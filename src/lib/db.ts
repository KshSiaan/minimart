import { drizzle } from 'drizzle-orm/neon-http';
import { env } from './env';

export const db = drizzle(env.DB_URL);
