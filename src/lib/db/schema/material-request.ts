import { pgTable, uuid, varchar, decimal, timestamp, text, integer } from "drizzle-orm/pg-core";

export const materialRequests = pgTable("material_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestType: varchar("request_type", { length: 50 }).notNull(),
  scheduleDate: timestamp("schedule_date"),
  status: varchar("status", { length: 50 }).default("draft"),
  warehouse: varchar("warehouse", { length: 255 }),
  companyId: uuid("company_id"),
  tenantId: uuid("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const materialRequestItems = pgTable("material_request_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  materialRequestId: uuid("material_request_id").references(() => materialRequests.id, { onDelete: "cascade" }).notNull(),
  item: varchar("item", { length: 255 }).notNull(),
  qty: decimal("qty", { precision: 20, scale: 4 }).notNull(),
  scheduleDate: timestamp("schedule_date"),
  warehouse: varchar("warehouse", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"),
});
