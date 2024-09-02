import { InferSelectModel, relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
} from "drizzle-orm/sqlite-core";

import { passwords } from "./passwords";

export const users = sqliteTable(
  "users",
  {
    // attributes
    id: text("id").primaryKey().notNull(),
    email: text("email").notNull().unique(),
    status: text("status", {
      enum: ["DELETED", "ACTIVE", "PASSIVE"],
    }).notNull(),
    // timestamps
    created_at: integer("created_at", { mode: "timestamp" })
      .$default(() => new Date())
      .notNull(),
    updated_at: integer("updated_at", { mode: "timestamp" }),
    deleted_at: integer("deleted_at", { mode: "timestamp" }),
  },
  (table) => {
    return {
      user_status_idx: index("user_status_idx").on(table.status),
    };
  }
);

export const userRelations = relations(users, ({ one }) => ({
  password: one(passwords, {
    fields: [users.id],
    references: [passwords.user_id],
  }),
}));

export type DB_NakedUser = InferSelectModel<typeof users>;

export type UserStatus = DB_NakedUser["status"];
