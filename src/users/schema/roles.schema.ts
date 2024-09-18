import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const Roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull(),
  permissions: text('permissions')
    .array()
    .default(sql`'{}'::text[]`)
    .notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
