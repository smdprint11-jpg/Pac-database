import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  role: text('role').default('user_ranting'),
  targetUnitId: text('target_unit_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const appStateCollections = pgTable('app_state_collections', {
  id: serial('id').primaryKey(),
  collectionKey: text('collection_key').notNull().unique(),
  dataJson: text('data_json').notNull(),
  updatedByUid: text('updated_by_uid'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const pacOfficers = pgTable('pac_officers', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  nia: text('nia'),
  position: text('position').notNull(),
  department: text('department'),
  organization: text('organization').notNull(),
  phone: text('phone'),
  email: text('email'),
  photoUrl: text('photo_url'),
  period: text('period'),
  status: text('status').default('Aktif'),
  unitId: text('unit_id'),
  unitName: text('unit_name'),
  orderIndex: integer('order_index').default(1),
  bio: text('bio'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  collections: many(appStateCollections),
}));

export const appStateCollectionsRelations = relations(appStateCollections, ({ one }) => ({
  updater: one(users, {
    fields: [appStateCollections.updatedByUid],
    references: [users.uid],
  }),
}));
