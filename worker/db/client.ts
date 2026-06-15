import '../env.d.ts';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function db(env: Env) {
  return drizzle(env.DB, { schema });
}
