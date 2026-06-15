import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type UserRole = 'owner' | 'admin' | 'member';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').$type<UserRole>().notNull().default('member'),
  createdAt: integer('created_at').notNull(),
});

export const userSessions = sqliteTable('user_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  crover_order_id: text('crover_order_id'),
  crover_synced: text('crover_synced').notNull().default('pending'),
  sent_email: integer('sent_email'),
  shipping_info: text('shipping_info').notNull(),
  items: text('items').notNull().default('[]'),
  stored_payment_method_id: text('stored_payment_method_id'),
  created_at: integer('created_at').notNull(),
});

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  order_id: integer('order_id').notNull().references(() => orders.id),
  cpay_id: text('cpay_id'),
  /** See `payment-status.ts` for `pending` vs `scheduled` semantics. */
  cpay_status: text('cpay_status').notNull(),
  customer_id: text('customer_id'),
  customer_name: text('customer_name').notNull(),
  customer_email: text('customer_email').notNull(),
  customer_phone: text('customer_phone'),
  line_items: text('line_items').notNull().default('[]'),
  /** Set for `scheduled` upsell rows; used when the cron runs stored-card. */
  amount_minor: integer('amount_minor'),
  currency: text('currency'),
  created_at: integer('created_at').notNull(),
});