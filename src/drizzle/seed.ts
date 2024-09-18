import 'dotenv/config';

import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

async function main() {
  db.query.users.findMany();
}

main()
  .then()
  .catch((error) => {
    console.log(`seeding error:`, error);
    process.exit(1);
  });
