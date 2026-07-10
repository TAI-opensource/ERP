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
import { chartOfAccounts } from "./accounting";

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
    valuationMethod: varchar("valuation_method", { length: 50 }).default("fifo"), // fifo, weighted_average
    hasVariants: boolean("has_variants").default(false).notNull(),
    variantOf: uuid("variant_of"),
    manufacturer: varchar("manufacturer", { length: 255 }),
    manufacturerPartNo: varchar("manufacturer_part_no", { length: 255 }),
    customerItemCode: varchar("customer_item_code", { length: 100 }),
    customerItemName: varchar("customer_item_name", { length: 255 }),
    supplierPartNo: varchar("supplier_part_no", { length: 100 }),
    countryOfOrigin: varchar("country_of_origin", { length: 100 }),
    customsCode: varchar("customs_code", { length: 50 }),
    inspectionTemplate: varchar("inspection_template", { length: 255 }),
    defaultBom: uuid("default_bom"),
    defaultItemTaxTemplate: uuid("default_item_tax_template").references(() => itemTaxTemplates.id),
    enableDeferredRevenue: boolean("enable_deferred_revenue").default(false).notNull(),
    deferredRevenueAccount: uuid("deferred_revenue_account").references(() => chartOfAccounts.id),
    enableDeferredCost: boolean("enable_deferred_cost").default(false).notNull(),
    deferredCostAccount: uuid("deferred_cost_account").references(() => chartOfAccounts.id),
    qualityInspectionTemplate: varchar("quality_inspection_template", { length: 255 }),
    shelfLifeInDays: integer("shelf_life_in_days"),
    serialNoTemplate: varchar("serial_no_template", { length: 255 }),
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
    parentId: uuid("parent_id"),
    isGroup: boolean("is_group").default(false).notNull(),
    company: varchar("company", { length: 255 }),
    addressId: uuid("address_id"),
    account: uuid("account").references(() => chartOfAccounts.id),
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

// ========== ERPNEXT-MISSING TABLES ==========

// Price Lists
export const priceLists = pgTable(
  "price_lists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    priceListName: varchar("price_list_name", { length: 255 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    selling: boolean("selling").default(false).notNull(),
    buying: boolean("buying").default(false).notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("price_lists_tenant_idx").on(t.tenantId),
    index("price_lists_company_idx").on(t.companyId),
  ]
);

// Item Prices (per price list)
export const itemPrices = pgTable(
  "item_prices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    itemId: uuid("item_id").notNull().references(() => items.id),
    priceListId: uuid("price_list_id").notNull().references(() => priceLists.id),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    priceListRate: decimal("price_list_rate", { precision: 20, scale: 4 }).notNull(),
    validFrom: date("valid_from"),
    validUpto: date("valid_upto"),
    minimumQty: decimal("minimum_qty", { precision: 20, scale: 4 }).default("1"),
    batchNo: varchar("batch_no", { length: 100 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("item_prices_tenant_idx").on(t.tenantId),
    index("item_prices_item_idx").on(t.itemId),
    index("item_prices_pricelist_idx").on(t.priceListId),
  ]
);

// UOM (Units of Measure)
export const uom = pgTable(
  "uom",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    uomName: varchar("uom_name", { length: 50 }).notNull(),
    description: varchar("description", { length: 255 }),
    isEnabled: boolean("is_enabled").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("uom_tenant_idx").on(t.tenantId),
    index("uom_company_idx").on(t.companyId),
  ]
);

// UOM Conversion Factor
export const uomConversions = pgTable(
  "uom_conversions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    itemId: uuid("item_id").notNull().references(() => items.id),
    fromUom: varchar("from_uom", { length: 50 }).notNull(),
    toUom: varchar("to_uom", { length: 50 }).notNull(),
    conversionFactor: decimal("conversion_factor", { precision: 20, scale: 10 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("uom_conversions_tenant_idx").on(t.tenantId),
    index("uom_conversions_item_idx").on(t.itemId),
  ]
);

// Item Tax Template
export const itemTaxTemplates = pgTable(
  "item_tax_templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    templateName: varchar("template_name", { length: 255 }).notNull(),
    taxType: varchar("tax_type", { length: 50 }).notNull(),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull(),
    accountId: uuid("account_id").references(() => chartOfAccounts.id),
    isInclusive: boolean("is_inclusive").default(false).notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("item_tax_templates_tenant_idx").on(t.tenantId),
    index("item_tax_templates_company_idx").on(t.companyId),
  ]
);

// Item Reorder Level
export const itemReorderLevels = pgTable(
  "item_reorder_levels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    itemId: uuid("item_id").notNull().references(() => items.id),
    warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
    reorderLevel: decimal("reorder_level", { precision: 20, scale: 4 }).notNull(),
    reorderQty: decimal("reorder_qty", { precision: 20, scale: 4 }).notNull(),
    materialRequestType: varchar("material_request_type", { length: 50 }).default("purchase"),
    minimumOrderQty: decimal("minimum_order_qty", { precision: 20, scale: 4 }),
    maximumOrderQty: decimal("maximum_order_qty", { precision: 20, scale: 4 }),
    leadTimeDays: integer("lead_time_days"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("item_reorder_tenant_idx").on(t.tenantId),
    index("item_reorder_item_idx").on(t.itemId),
    index("item_reorder_warehouse_idx").on(t.warehouseId),
  ]
);

// Stock Ledger Entry Detail (for landed cost)
export const stockLedgerEntryDetails = pgTable(
  "stock_ledger_entry_details",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    stockLedgerEntryId: uuid("stock_ledger_entry_id").notNull().references(() => stockLedgers.id, { onDelete: "cascade" }),
    voucherType: varchar("voucher_type", { length: 50 }),
    voucherNo: varchar("voucher_no", { length: 50 }),
    accountId: uuid("account_id").references(() => chartOfAccounts.id),
    amount: decimal("amount", { precision: 20, scale: 4 }).default("0"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("sle_details_tenant_idx").on(t.tenantId),
    index("sle_details_sle_idx").on(t.stockLedgerEntryId),
  ]
);

// Landed Cost Voucher
export const landedCostVouchers = pgTable(
  "landed_cost_vouchers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    voucherNumber: varchar("voucher_number", { length: 50 }).notNull(),
    postingDate: date("posting_date").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    totalCost: decimal("total_cost", { precision: 20, scale: 4 }).default("0"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    remarks: text("remarks"),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("landed_cost_tenant_idx").on(t.tenantId),
    index("landed_cost_company_idx").on(t.companyId),
  ]
);

// Pricing Rules
export const pricingRules = pgTable(
  "pricing_rules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    ruleName: varchar("rule_name", { length: 255 }).notNull(),
    selling: boolean("selling").default(false).notNull(),
    buying: boolean("buying").default(false).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    minimumQty: decimal("minimum_qty", { precision: 20, scale: 4 }),
    maximumQty: decimal("maximum_qty", { precision: 20, scale: 4 }),
    minimumAmount: decimal("minimum_amount", { precision: 20, scale: 4 }),
    maximumAmount: decimal("maximum_amount", { precision: 20, scale: 4 }),
    discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }),
    rate: decimal("rate", { precision: 20, scale: 4 }),
    priceList: varchar("price_list", { length: 100 }),
    validFrom: date("valid_from"),
    validUpto: date("valid_upto"),
    priority: integer("priority").default(0),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("pricing_rules_tenant_idx").on(t.tenantId),
    index("pricing_rules_company_idx").on(t.companyId),
  ]
);
