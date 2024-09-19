import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { LoginMethods } from 'src/common/enums/auth.enum';

export const LoginMethodEnum = pgEnum('login_methods', [
  LoginMethods.emailPassword,
  LoginMethods.social,
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  photo: text('photo'),
  social_id: varchar('social_id', { length: 20 }),
  login_method: LoginMethodEnum('login_methods').default(
    LoginMethods.emailPassword,
  ),
  date_of_birth: timestamp('date_of_birth'),
  city: text('city'),
  country: text('country'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
