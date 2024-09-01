import { InferSelectModel, relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

import { passwords } from "./passwords";

export const users = sqliteTable(
  "users",
  {
    // attributes
    id: text("id").primaryKey().notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull().unique(),
    about: text("about").notNull(),
    first_name: text("first_name"),
    last_name: text("last_name"),
    company_name: text("company_name"),
    address: text("address"),
    city: text("city"),
    region: text("region"),
    zip: text("zip"),
    role: text("role", {
      enum: ["ADMIN", "MANAGER", "WAITER", "CUSTOMER", "SUPPLIER"],
    }).notNull(),
    status: text("status", {
      enum: [
        "DELETED",
        "PENDING",
        "REJECTED",
        "CONFIRMED",
        "ACTIVE",
        "PASSIVE",
      ],
    }).notNull(),
    // relations
    created_by: text("created_by").references(
      (): AnySQLiteColumn => users.id
    ),
    updated_by: text("updated_by").references(
      (): AnySQLiteColumn => users.id
    ),
    deleted_by: text("deleted_by").references(
      (): AnySQLiteColumn => users.id
    ),
    // timestamps
    created_at: integer("created_at", { mode: "timestamp" })
      .$default(() => new Date())
      .notNull(),
    updated_at: integer("updated_at", { mode: "timestamp" }),
    deleted_at: integer("deleted_at", { mode: "timestamp" }),
  },
  (table) => {
    return {
      user_role_idx: index("user_role_idx").on(table.role),
      user_status_idx: index("user_status_idx").on(table.status),
    };
  }
);

export const userRelations = relations(users, ({ one }) => ({
  password: one(passwords, {
    fields: [users.id],
    references: [passwords.user_id],
  }),
  creator: one(users, {
    fields: [users.created_by],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [users.updated_by],
    references: [users.id],
  }),
  deleter: one(users, {
    fields: [users.deleted_by],
    references: [users.id],
  }),
}));
export type CUD = {
  creator: NakedUser | null;
  updater: NakedUser | null;
  deleter: NakedUser | null;
};
export type NakedUser = InferSelectModel<typeof users>;
export type User = NakedUser & CUD;

export type UserStatus = NakedUser["status"];
export type UserRole = NakedUser["role"];
