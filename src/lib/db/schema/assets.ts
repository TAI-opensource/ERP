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

export const assetCategories = pgTable(
  "asset_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    depreciationMethod: varchar("depreciation_method", { length: 50 }).default("straight_line").notNull(),
    depreciationRate: decimal("depreciation_rate", { precision: 5, scale: 2 }),
    numberOfMonths: integer("number_of_months"),
    defaultAccount: uuid("default_account"),
    expenseAccount: uuid("expense_account"),
    accumulatedDepreciationAccount: uuid("accumulated_depreciation_account"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("asset_categories_tenant_id_idx").on(t.tenantId),
    index("asset_categories_company_id_idx").on(t.companyId),
  ]
);

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    assetName: varchar("asset_name", { length: 255 }).notNull(),
    assetCode: varchar("asset_code", { length: 50 }),
    assetCategory: varchar("asset_category", { length: 255 }),
    assetCategoryId: uuid("asset_category_id").references(() => assetCategories.id),
    description: text("description"),
    assetStatus: varchar("asset_status", { length: 50 }).default("active").notNull(),
    purchaseDate: date("purchase_date"),
    purchaseAmount: decimal("purchase_amount", { precision: 20, scale: 4 }).default("0"),
    currentValue: decimal("current_value", { precision: 20, scale: 4 }).default("0"),
    depreciationMethod: varchar("depreciation_method", { length: 50 }),
    depreciationRate: decimal("depreciation_rate", { precision: 5, scale: 2 }),
    depreciationStartDate: date("depreciation_start_date"),
    depreciationEndDate: date("depreciation_end_date"),
    numberOfMonths: integer("number_of_months"),
    grossPurchaseAmount: decimal("gross_purchase_amount", { precision: 20, scale: 4 }),
    accumulatedDepreciation: decimal("accumulated_depreciation", { precision: 20, scale: 4 }).default("0"),
    assetLifeInMonths: integer("asset_life_in_months"),
    totalDepreciableAmount: decimal("total_depreciable_amount", { precision: 20, scale: 4 }),
    openingAccumulatedDepreciation: decimal("opening_accumulated_depreciation", { precision: 20, scale: 4 }).default("0"),
    openingNetBookValue: decimal("opening_net_book_value", { precision: 20, scale: 4 }),
    depreciationAccountId: uuid("depreciation_account_id"),
    expenditureAccountId: uuid("expenditure_account_id"),
    accumulatedDepreciationAccountId: uuid("accumulated_depreciation_account_id"),
    disposalAccountId: uuid("disposal_account_id"),
    costCenter: varchar("cost_center", { length: 100 }),
    location: varchar("location", { length: 255 }),
    custodian: varchar("custodian", { length: 255 }),
    departmentId: uuid("department_id"),
    branchId: uuid("branch_id"),
    supplier: varchar("supplier", { length: 255 }),
    serialNumber: varchar("serial_number", { length: 255 }),
    modelNumber: varchar("model_number", { length: 255 }),
    image: varchar("image", { length: 512 }),
    notes: text("notes"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("assets_tenant_id_idx").on(t.tenantId),
    index("assets_company_id_idx").on(t.companyId),
    index("assets_category_id_idx").on(t.assetCategoryId),
    index("assets_status_idx").on(t.assetStatus),
    index("assets_purchase_date_idx").on(t.purchaseDate),
    uniqueIndex("assets_code_company_idx").on(t.assetCode, t.companyId),
  ]
);

export const depreciationEntries = pgTable(
  "depreciation_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    depreciationDate: date("depreciation_date").notNull(),
    depreciationAmount: decimal("depreciation_amount", { precision: 20, scale: 4 }).notNull(),
    accumulatedDepreciation: decimal("accumulated_depreciation", { precision: 20, scale: 4 }).notNull(),
    journalEntryId: uuid("journal_entry_id"),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    fiscalYearId: uuid("fiscal_year_id"),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("depreciation_entries_tenant_id_idx").on(t.tenantId),
    index("depreciation_entries_company_id_idx").on(t.companyId),
    index("depreciation_entries_asset_id_idx").on(t.assetId),
    index("depreciation_entries_date_idx").on(t.depreciationDate),
    index("depreciation_entries_status_idx").on(t.status),
  ]
);

export const assetMaintenance = pgTable(
  "asset_maintenance",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    maintenanceType: varchar("maintenance_type", { length: 50 }).notNull(),
    maintenanceDate: date("maintenance_date").notNull(),
    nextMaintenanceDate: date("next_maintenance_date"),
    description: text("description"),
    cost: decimal("cost", { precision: 20, scale: 4 }).default("0"),
    vendor: varchar("vendor", { length: 255 }),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    completedBy: varchar("completed_by", { length: 255 }),
    completedAt: timestamp("completed_at"),
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("asset_maintenance_tenant_id_idx").on(t.tenantId),
    index("asset_maintenance_company_id_idx").on(t.companyId),
    index("asset_maintenance_asset_id_idx").on(t.assetId),
    index("asset_maintenance_date_idx").on(t.maintenanceDate),
    index("asset_maintenance_next_date_idx").on(t.nextMaintenanceDate),
    index("asset_maintenance_status_idx").on(t.status),
    index("asset_maintenance_type_idx").on(t.maintenanceType),
  ]
);

export const assetMovement = pgTable(
  "asset_movement",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    movementType: varchar("movement_type", { length: 50 }).notNull(),
    movementDate: date("movement_date").notNull(),
    fromLocation: varchar("from_location", { length: 255 }),
    toLocation: varchar("to_location", { length: 255 }),
    fromDepartment: varchar("from_department", { length: 255 }),
    toDepartment: varchar("to_department", { length: 255 }),
    fromCustodian: varchar("from_custodian", { length: 255 }),
    toCustodian: varchar("to_custodian", { length: 255 }),
    reason: text("reason"),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    approvedBy: uuid("approved_by").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("asset_movement_tenant_id_idx").on(t.tenantId),
    index("asset_movement_company_id_idx").on(t.companyId),
    index("asset_movement_asset_id_idx").on(t.assetId),
    index("asset_movement_date_idx").on(t.movementDate),
    index("asset_movement_type_idx").on(t.movementType),
  ]
);
