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

export const itemGroups = pgTable(
  "item_groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    parentId: uuid("parent_id"),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("item_groups_tenant_id_idx").on(t.tenantId),
    index("item_groups_company_id_idx").on(t.companyId),
  ]
);

export const items = pgTable(
  "items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    itemCode: varchar("item_code", { length: 100 }).notNull(),
    itemName: varchar("item_name", { length: 255 }).notNull(),
    itemGroup: varchar("item_group", { length: 255 }),
    itemGroupId: uuid("item_group_id").references(() => itemGroups.id),
    itemType: varchar("item_type", { length: 50 }).default("stock").notNull(),
    description: text("description"),
    barcode: varchar("barcode", { length: 255 }),
    unit: varchar("unit", { length: 50 }).default("Nos").notNull(),
    salesUnit: varchar("sales_unit", { length: 50 }),
    purchaseUnit: varchar("purchase_unit", { length: 50 }),
    minOrderQty: decimal("min_order_qty", { precision: 20, scale: 4 }),
    maxDiscountPercent: decimal("max_discount_percent", { precision: 5, scale: 2 }),
    standardSellingRate: decimal("standard_selling_rate", { precision: 20, scale: 4 }),
    standardPurchaseRate: decimal("standard_purchase_rate", { precision: 20, scale: 4 }),
    valuationRate: decimal("valuation_rate", { precision: 20, scale: 4 }),
    weightPerUnit: decimal("weight_per_unit", { precision: 10, scale: 4 }),
    weightUnit: varchar("weight_unit", { length: 10 }),
    hasSerialNo: boolean("has_serial_no").default(false).notNull(),
    hasBatchNo: boolean("has_batch_no").default(false).notNull(),
    isStockItem: boolean("is_stock_item").default(true).notNull(),
    isSalesItem: boolean("is_sales_item").default(false).notNull(),
    isPurchaseItem: boolean("is_purchase_item").default(false).notNull(),
    isManufacturedItem: boolean("is_manufactured_item").default(false).notNull(),
    isSubContractedItem: boolean("is_sub_contracted_item").default(false).notNull(),
    shelfLifeDays: integer("shelf_life_days"),
    warrantyDays: integer("warranty_days"),
    stock_uom: varchar("stock_uom", { length: 50 }).default("Nos"),
    defaultWarehouse: varchar("default_warehouse", { length: 255 }),
    leadTimeDays: integer("lead_time_days"),
    image: varchar("image", { length: 512 }),
    attributes: jsonb("attributes").default({}),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("items_tenant_id_idx").on(t.tenantId),
    index("items_company_id_idx").on(t.companyId),
    index("items_group_id_idx").on(t.itemGroupId),
    index("items_barcode_idx").on(t.barcode),
    uniqueIndex("items_code_company_idx").on(t.itemCode, t.companyId),
  ]
);

export const warehouses = pgTable(
  "warehouses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    warehouseName: varchar("warehouse_name", { length: 255 }).notNull(),
    warehouseCode: varchar("warehouse_code", { length: 50 }).notNull(),
    addressLine1: varchar("address_line1", { length: 255 }),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    isDefault: boolean("is_default").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("warehouses_tenant_id_idx").on(t.tenantId),
    index("warehouses_company_id_idx").on(t.companyId),
    uniqueIndex("warehouses_code_company_idx").on(t.warehouseCode, t.companyId),
  ]
);

export const stockEntries = pgTable(
  "stock_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    stockEntryType: varchar("stock_entry_type", { length: 50 }).notNull(),
    entryNumber: varchar("entry_number", { length: 50 }).notNull(),
    postingDate: date("posting_date").notNull(),
    fromWarehouse: varchar("from_warehouse", { length: 255 }),
    fromWarehouseId: uuid("from_warehouse_id").references(() => warehouses.id),
    toWarehouse: varchar("to_warehouse", { length: 255 }),
    toWarehouseId: uuid("to_warehouse_id").references(() => warehouses.id),
    totalAmount: decimal("total_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    remarks: text("remarks"),
    referenceType: varchar("reference_type", { length: 50 }),
    referenceName: varchar("reference_name", { length: 255 }),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("stock_entries_tenant_id_idx").on(t.tenantId),
    index("stock_entries_company_id_idx").on(t.companyId),
    index("stock_entries_type_idx").on(t.stockEntryType),
    index("stock_entries_date_idx").on(t.postingDate),
    index("stock_entries_status_idx").on(t.status),
    uniqueIndex("stock_entries_number_company_idx").on(t.entryNumber, t.companyId),
  ]
);

export const stockEntryLines = pgTable(
  "stock_entry_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    stockEntryId: uuid("stock_entry_id")
      .notNull()
      .references(() => stockEntries.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    itemName: varchar("item_name", { length: 255 }),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    rate: decimal("rate", { precision: 20, scale: 4 }).default("0"),
    amount: decimal("amount", { precision: 20, scale: 4 }).default("0"),
    batchNo: varchar("batch_no", { length: 100 }),
    serialNo: text("serial_no"),
    fromWarehouse: varchar("from_warehouse", { length: 255 }),
    fromWarehouseId: uuid("from_warehouse_id").references(() => warehouses.id),
    toWarehouse: varchar("to_warehouse", { length: 255 }),
    toWarehouseId: uuid("to_warehouse_id").references(() => warehouses.id),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("stock_entry_lines_tenant_id_idx").on(t.tenantId),
    index("stock_entry_lines_entry_id_idx").on(t.stockEntryId),
    index("stock_entry_lines_item_id_idx").on(t.itemId),
  ]
);

export const batches = pgTable(
  "batches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    batchNumber: varchar("batch_number", { length: 100 }).notNull(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    manufacturingDate: date("manufacturing_date"),
    expiryDate: date("expiry_date"),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).default("0").notNull(),
    reservedQty: decimal("reserved_qty", { precision: 20, scale: 4 }).default("0").notNull(),
    availableQty: decimal("available_qty", { precision: 20, scale: 4 }).default("0").notNull(),
    warehouseId: uuid("warehouse_id").references(() => warehouses.id),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("batches_tenant_id_idx").on(t.tenantId),
    index("batches_company_id_idx").on(t.companyId),
    index("batches_item_id_idx").on(t.itemId),
    index("batches_warehouse_id_idx").on(t.warehouseId),
    index("batches_expiry_idx").on(t.expiryDate),
    uniqueIndex("batches_number_company_idx").on(t.batchNumber, t.companyId),
  ]
);

export const serialNumbers = pgTable(
  "serial_numbers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    serialNumber: varchar("serial_number", { length: 100 }).notNull(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    warehouseId: uuid("warehouse_id").references(() => warehouses.id),
    batchNo: varchar("batch_no", { length: 100 }),
    purchaseDate: date("purchase_date"),
    purchaseRate: decimal("purchase_rate", { precision: 20, scale: 4 }),
    warrantyExpiryDate: date("warranty_expiry_date"),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("serial_numbers_tenant_id_idx").on(t.tenantId),
    index("serial_numbers_company_id_idx").on(t.companyId),
    index("serial_numbers_item_id_idx").on(t.itemId),
    index("serial_numbers_warehouse_id_idx").on(t.warehouseId),
    uniqueIndex("serial_numbers_number_company_idx").on(t.serialNumber, t.companyId),
  ]
);

export const stockLedgers = pgTable(
  "stock_ledgers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    postingDate: date("posting_date").notNull(),
    postingTime: varchar("posting_time", { length: 10 }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id),
    batchNo: varchar("batch_no", { length: 100 }),
    serialNo: varchar("serial_no", { length: 100 }),
    voucherType: varchar("voucher_type", { length: 50 }).notNull(),
    voucherNo: varchar("voucher_no", { length: 50 }),
    actualQty: decimal("actual_qty", { precision: 20, scale: 4 }).notNull(),
    incomingQty: decimal("incoming_qty", { precision: 20, scale: 4 }).default("0"),
    outgoingQty: decimal("outgoing_qty", { precision: 20, scale: 4 }).default("0"),
    balanceQty: decimal("balance_qty", { precision: 20, scale: 4 }).notNull(),
    rate: decimal("rate", { precision: 20, scale: 4 }).default("0"),
    valuationRate: decimal("valuation_rate", { precision: 20, scale: 4 }).default("0"),
    amount: decimal("amount", { precision: 20, scale: 4 }).default("0"),
    balanceValue: decimal("balance_value", { precision: 20, scale: 4 }).default("0"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("stock_ledgers_tenant_id_idx").on(t.tenantId),
    index("stock_ledgers_company_id_idx").on(t.companyId),
    index("stock_ledgers_item_id_idx").on(t.itemId),
    index("stock_ledgers_warehouse_id_idx").on(t.warehouseId),
    index("stock_ledgers_date_idx").on(t.postingDate),
    index("stock_ledgers_voucher_idx").on(t.voucherType, t.voucherNo),
  ]
);
