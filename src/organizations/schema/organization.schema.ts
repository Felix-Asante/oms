import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { Roles } from 'src/users/schema/roles.schema';
import { users } from 'src/users/schema/user.schema';

export const Organization = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  logo: text('logo'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  code: varchar('code', { length: 8 })
    .notNull()
    .$defaultFn(() => generateRandomString(8)),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const OrganizationMember = pgTable('organization_members', {
  user: uuid('user').references(() => users.id),
  organization: uuid('organization').references(() => Organization.id),
  role: uuid('role').references(() => Roles.id),
});

export const organizationMemberRelations = relations(
  OrganizationMember,
  ({ many }) => ({
    user: many(users),
    organization: many(Organization),
    role: many(Roles),
  }),
);
