import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  date,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { companies } from "./core";
import { users } from "./auth";
import { items } from "./stock";

export const bom = pgTable(
  "bom",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    itemCode: varchar("item_code", { length: 100 }).notNull(),
    itemName: varchar("item_name", { length: 255 }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).default("1").notNull(),
    uom: varchar("uom", { length: 50 }).default("Nos"),
    bomType: varchar("bom_type", { length: 50 }).default("manufacture").notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    routingId: uuid("routing_id"),
    totalCost: decimal("total_cost", { precision: 20, scale: 4 }).default("0"),
    description: text("description"),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("bom_tenant_id_idx").on(t.tenantId),
    index("bom_company_id_idx").on(t.companyId),
    index("bom_item_id_idx").on(t.itemId),
    index("bom_type_idx").on(t.bomType),
  ]
);

export const bomItems = pgTable(
  "bom_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    bomId: uuid("bom_id")
      .notNull()
      .references(() => bom.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    itemName: varchar("item_name", { length: 255 }),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    uom: varchar("uom", { length: 50 }).default("Nos"),
    rate: decimal("rate", { precision: 20, scale: 4 }).default("0"),
    amount: decimal("amount", { precision: 20, scale: 4 }).default("0"),
    warehouseId: uuid("warehouse_id"),
    costCenter: varchar("cost_center", { length: 100 }),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("bom_items_tenant_id_idx").on(t.tenantId),
    index("bom_items_bom_id_idx").on(t.bomId),
    index("bom_items_item_id_idx").on(t.itemId),
  ]
);

export const workCenters = pgTable(
  "work_centers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 50 }),
    description: text("description"),
    workStationType: varchar("work_station_type", { length: 50 }),
    hourlyRate: decimal("hourly_rate", { precision: 20, scale: 4 }),
    capacity: integer("capacity"),
    costCenter: varchar("cost_center", { length: 100 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("work_centers_tenant_id_idx").on(t.tenantId),
    index("work_centers_company_id_idx").on(t.companyId),
  ]
);

export const operations = pgTable(
  "operations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    operationName: varchar("operation_name", { length: 255 }).notNull(),
    description: text("description"),
    workCenterId: uuid("work_center_id").references(() => workCenters.id),
    setupTime: decimal("setup_time", { precision: 10, scale: 2 }),
    runTime: decimal("run_time", { precision: 10, scale: 2 }),
    queueTime: decimal("queue_time", { precision: 10, scale: 2 }),
    costPerHour: decimal("cost_per_hour", { precision: 20, scale: 4 }),
    subcontracted: boolean("subcontracted").default(false).notNull(),
    subcontractedTo: varchar("subcontracted_to", { length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("operations_tenant_id_idx").on(t.tenantId),
    index("operations_company_id_idx").on(t.companyId),
    index("operations_work_center_id_idx").on(t.workCenterId),
  ]
);

export const workOrders = pgTable(
  "work_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    workOrderNumber: varchar("work_order_number", { length: 50 }).notNull(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    itemName: varchar("item_name", { length: 255 }),
    bomId: uuid("bom_id").references(() => bom.id),
    quantityToManufacture: decimal("quantity_to_manufacture", { precision: 20, scale: 4 }).notNull(),
    quantityManufactured: decimal("quantity_manufactured", { precision: 20, scale: 4 }).default("0"),
    quantityScrapped: decimal("quantity_scrapped", { precision: 20, scale: 4 }).default("0"),
    uom: varchar("uom", { length: 50 }).default("Nos"),
    plannedStartDate: date("planned_start_date"),
    plannedEndDate: date("planned_end_date"),
    actualStartDate: date("actual_start_date"),
    actualEndDate: date("actual_end_date"),
    warehouseId: uuid("warehouse_id"),
    sourceWarehouseId: uuid("source_warehouse_id"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    progressPercentage: integer("progress_percentage").default(0),
    costCenter: varchar("cost_center", { length: 100 }),
    estimatedTotalCost: decimal("estimated_total_cost", { precision: 20, scale: 4 }),
    actualTotalCost: decimal("actual_total_cost", { precision: 20, scale: 4 }),
    remarks: text("remarks"),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    cancelledBy: uuid("cancelled_by").references(() => users.id),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("work_orders_tenant_id_idx").on(t.tenantId),
    index("work_orders_company_id_idx").on(t.companyId),
    index("work_orders_item_id_idx").on(t.itemId),
    index("work_orders_bom_id_idx").on(t.bomId),
    index("work_orders_status_idx").on(t.status),
    index("work_orders_date_idx").on(t.plannedStartDate, t.plannedEndDate),
    uniqueIndex("work_orders_number_company_idx").on(t.workOrderNumber, t.companyId),
  ]
);

export const jobCards = pgTable(
  "job_cards",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    jobCardNumber: varchar("job_card_number", { length: 50 }).notNull(),
    workOrderId: uuid("work_order_id")
      .notNull()
      .references(() => workOrders.id, { onDelete: "cascade" }),
    operationId: uuid("operation_id")
      .notNull()
      .references(() => operations.id),
    workCenterId: uuid("work_center_id").references(() => workCenters.id),
    sequence: integer("sequence"),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    completedQty: decimal("completed_qty", { precision: 20, scale: 4 }).default("0"),
    scrappedQty: decimal("scrapped_qty", { precision: 20, scale: 4 }).default("0"),
    timeInMins: integer("time_in_mins"),
    plannedStartDate: date("planned_start_date"),
    plannedEndDate: date("planned_end_date"),
    actualStartDate: date("actual_start_date"),
    actualEndDate: date("actual_end_date"),
    costPerHour: decimal("cost_per_hour", { precision: 20, scale: 4 }),
    totalCost: decimal("total_cost", { precision: 20, scale: 4 }).default("0"),
    remarks: text("remarks"),
    createdBy: uuid("created_by").references(() => users.id),
    completedBy: uuid("completed_by").references(() => users.id),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("job_cards_tenant_id_idx").on(t.tenantId),
    index("job_cards_company_id_idx").on(t.companyId),
    index("job_cards_work_order_id_idx").on(t.workOrderId),
    index("job_cards_operation_id_idx").on(t.operationId),
    index("job_cards_work_center_id_idx").on(t.workCenterId),
    index("job_cards_status_idx").on(t.status),
    uniqueIndex("job_cards_number_company_idx").on(t.jobCardNumber, t.companyId),
  ]
);

export const routings = pgTable(
  "routings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    routingName: varchar("routing_name", { length: 255 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("routings_tenant_id_idx").on(t.tenantId),
    index("routings_company_id_idx").on(t.companyId),
  ]
);

export const routingOperations = pgTable(
  "routing_operations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    routingId: uuid("routing_id")
      .notNull()
      .references(() => routings.id, { onDelete: "cascade" }),
    operationId: uuid("operation_id")
      .notNull()
      .references(() => operations.id),
    sequence: integer("sequence").notNull(),
    workCenterId: uuid("work_center_id").references(() => workCenters.id),
    setupTime: decimal("setup_time", { precision: 10, scale: 2 }),
    runTime: decimal("run_time", { precision: 10, scale: 2 }),
    queueTime: decimal("queue_time", { precision: 10, scale: 2 }),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("routing_operations_tenant_id_idx").on(t.tenantId),
    index("routing_operations_routing_id_idx").on(t.routingId),
    index("routing_operations_operation_id_idx").on(t.operationId),
  ]
);
