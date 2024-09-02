import { InferSelectModel } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
} from "drizzle-orm/sqlite-core";

export const contacts = sqliteTable(
  "contacts",
  {
    // attributes
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull().unique(),
    job: text("job"),
    company: text("company"),
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
      contact_status_idx: index("contact_status_idx").on(
        table.status
      ),
    };
  }
);

export type DB_NakedContact = InferSelectModel<typeof contacts>;
export type ContactStatus = DB_NakedContact["status"];
