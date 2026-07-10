import { pgTable, uuid, varchar, integer, timestamp, text } from "drizzle-orm/pg-core";

export const dunnings = pgTable("dunnings", {
  id: uuid("id").primaryKey().defaultRandom(),
  customer: varchar("customer", { length: 255 }).notNull(),
  salesInvoiceId: uuid("sales_invoice_id"),
  dunningDate: timestamp("dunning_date").notNull(),
  dunningLevel: integer("dunning_level").default(1),
  status: varchar("status", { length: 50 }).default("draft"),
  companyId: uuid("company_id"),
  tenantId: uuid("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dunningLetters = pgTable("dunning_letters", {
  id: uuid("id").primaryKey().defaultRandom(),
  dunningId: uuid("dunning_id").references(() => dunnings.id, { onDelete: "cascade" }).notNull(),
  letterText: text("letter_text").notNull(),
  sentDate: timestamp("sent_date"),
  sentVia: varchar("sent_via", { length: 50 }),
});
