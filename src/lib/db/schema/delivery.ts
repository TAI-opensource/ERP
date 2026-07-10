import { pgTable, uuid, varchar, decimal, timestamp, text, integer } from "drizzle-orm/pg-core";

export const packingSlips = pgTable("packing_slips", {
  id: uuid("id").primaryKey().defaultRandom(),
  deliveryNoteId: uuid("delivery_note_id"),
  packingDate: timestamp("packing_date").notNull(),
  status: varchar("status", { length: 50 }).default("draft"),
  companyId: uuid("company_id"),
  tenantId: uuid("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const packingSlipItems = pgTable("packing_slip_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  packingSlipId: uuid("packing_slip_id").references(() => packingSlips.id, { onDelete: "cascade" }).notNull(),
  item: varchar("item", { length: 255 }).notNull(),
  qty: decimal("qty", { precision: 20, scale: 4 }).notNull(),
  description: text("description"),
});

export const shipments = pgTable("shipments", {
  id: uuid("id").primaryKey().defaultRandom(),
  deliveryNoteId: uuid("delivery_note_id"),
  shipmentDate: timestamp("shipment_date").notNull(),
  trackingNo: varchar("tracking_no", { length: 255 }),
  carrier: varchar("carrier", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"),
  companyId: uuid("company_id"),
  tenantId: uuid("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deliveryTrips = pgTable("delivery_trips", {
  id: uuid("id").primaryKey().defaultRandom(),
  driver: varchar("driver", { length: 255 }),
  vehicle: varchar("vehicle", { length: 255 }),
  departureTime: timestamp("departure_time"),
  status: varchar("status", { length: 50 }).default("planned"),
  companyId: uuid("company_id"),
  tenantId: uuid("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deliveryStops = pgTable("delivery_stops", {
  id: uuid("id").primaryKey().defaultRandom(),
  deliveryTripId: uuid("delivery_trip_id").references(() => deliveryTrips.id, { onDelete: "cascade" }).notNull(),
  customer: varchar("customer", { length: 255 }),
  address: text("address"),
  status: varchar("status", { length: 50 }).default("pending"),
  deliveryTime: timestamp("delivery_time"),
  sortOrder: integer("sort_order").default(0),
});
