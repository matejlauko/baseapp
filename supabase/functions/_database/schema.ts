import {
  bigint,
  boolean,
  integer,
  pgSchema,
  text,
  timestamp,
  uuid,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

const authSchema = pgSchema('auth')
const appBaseSchema = pgSchema('app_base')

/* AUTH */
export const AuthUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
})

/* ITEMS */

// Define the enum type for item type
export const itemTypeEnum = appBaseSchema.enum('item_type', ['task', 'note'])

// Define the items table schema
export const Items = appBaseSchema.table('items', {
  id: uuid('id').primaryKey(),
  text: text('text').notNull(),
  type: itemTypeEnum('type').notNull(),
  tags: text('tags').array(),
  completed: boolean('completed'),
  createdAt: timestamp('created_at', { mode: 'string', withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true }).notNull(),
  deleted: boolean('deleted').default(false).notNull(),
  userId: uuid('user_id').references(() => AuthUsers.id, {
    onDelete: 'set null',
  }),
  revision: bigint('revision', { mode: 'bigint' }).notNull(),
  parentId: uuid('parent_id').references((): AnyPgColumn => Items.id, {
    onDelete: 'cascade',
  }),
  // path: text('path').array().notNull(), // Array of ancestor IDs (not used)
  isExpanded: boolean('is_expanded').default(true),
  order: integer('order'), // Order within siblings
})

export type SelectItem = typeof Items.$inferSelect
export type InsertItem = typeof Items.$inferInsert

// const commonSchemaRefine = {
//   tags: z.array(z.string()),
// }

export const selectItemSchema = createSelectSchema(Items).omit({
  deleted: true,
  revision: true,
  userId: true,
})
export type Item = z.infer<typeof selectItemSchema>

export const createItemSchema = createInsertSchema(Items).pick({
  id: true,
  text: true,
  type: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
  completed: true,
  isExpanded: true,
  parentId: true,
  path: true,
  order: true,
  // -- omit
  // deleted: true,
  // user_id: true,
  // revision: true,
})
export type CreateItem = z.infer<typeof createItemSchema>

export const updateItemSchema = createInsertSchema(Items)
  .pick({
    id: true,
    text: true,
    type: true,
    tags: true,
    updatedAt: true,
    completed: true,
    isExpanded: true,
    parentId: true,
    path: true,
    order: true,
    // -- omit
    // deleted: true,
    // user_id: true,
    // created_at: true,
    // revision: true,
  })
  .partial()
  .required({ id: true })
export type UpdateItem = z.infer<typeof updateItemSchema>

/* SYNC CLIENTS */

export const SyncClients = appBaseSchema.table('sync_clients', {
  id: uuid('id').primaryKey(),
  clientGroupId: uuid('client_group_id'),
  revision: bigint('revision', { mode: 'bigint' }).notNull(),
  lastMutationId: integer('last_mutation_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }).notNull().defaultNow(),
  userId: uuid('user_id')
    .references(() => AuthUsers.id, { onDelete: 'cascade' })
    .notNull(),
})
