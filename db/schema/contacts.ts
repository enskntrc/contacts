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
    status: text("status", {
      enum: ["DELETED", "ACTIVE", "PASSIVE"],
    }).notNull(),
    prefix: text("prefix"),
    first_name: text("name").notNull(),
    middle_name: text("middle_name"),
    last_name: text("last_name").notNull(),
    suffix: text("suffix"),
    phonetic_first: text("phonetic_first"),
    phonetic_middle: text("phonetic_middle"),
    phonetic_last: text("phonetic_last"),
    nickname: text("nickname"),
    file_as: text("file_as"),

    company: text("company"),
    job_title: text("job_title"),
    department: text("department"),

    email: text("email"),
    phone: text("phone").notNull().unique(),

    country: text("country"),
    street: text("street"),
    postcode: text("postal_code"),
    district: text("district"),
    province: text("province"),

    b_day: text("b_day"),
    b_month: text("b_month"),
    b_year: text("b_year"),

    notes: text("notes"),

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
