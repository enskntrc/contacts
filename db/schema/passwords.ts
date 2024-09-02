import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { InferSelectModel } from "drizzle-orm";

export const passwords = sqliteTable("passwords", {
  // attributes
  id: text("id").primaryKey().notNull(),
  hash: text("hash").notNull(),
  status: text("status", {
    enum: ["DELETED", "ACTIVE", "PASSIVE"],
  }).notNull(),
  // relations
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  // timestamps
  created_at: integer("created_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }),
  deleted_at: integer("deleted_at", { mode: "timestamp" }),
});

export type DB_Password = InferSelectModel<typeof passwords>;

export type PasswordStatus = DB_Password["status"];
