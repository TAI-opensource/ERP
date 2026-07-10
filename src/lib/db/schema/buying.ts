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
import { chartOfAccounts } from "./accounting";

export const suppliers = pgTable(
  "suppliers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    supplierName: varchar("supplier_name", { length: 255 }).notNull(),
    supplierType: varchar("supplier_type", { length: 50 }).default("company").notNull(),
    taxId: varchar("tax_id", { length: 50 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    mobileNo: varchar("mobile_no", { length: 50 }),
    website: varchar("website", { length: 255 }),
    addressLine1: varchar("address_line1", { length: 255 }),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    defaultPaymentTerms: varchar("default_payment_terms", { length: 100 }),
    outstandingAmount: decimal("outstanding_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    supplierGroup: varchar("supplier_group", { length: 100 }),
    territory: varchar("territory", { length: 100 }),
    defaultWarehouse: varchar("default_warehouse", { length: 255 }),
    defaultPriceList: varchar("default_price_list", { length: 100 }),
    defaultAccount: uuid("default_account").references(() => chartOfAccounts.id),
    notes: text("notes"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("suppliers_tenant_id_idx").on(t.tenantId),
    index("suppliers_company_id_idx").on(t.companyId),
    index("suppliers_group_idx").on(t.supplierGroup),
    index("suppliers_email_idx").on(t.email),
  ]
);

export const purchaseOrders = pgTable(
  "purchase_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    purchaseOrderNumber: varchar("purchase_order_number", { length: 50 }).notNull(),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id),
    orderDate: date("order_date").notNull(),
    deliveryDate: date("delivery_date"),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    exchangeRate: decimal("exchange_rate", { precision: 20, scale: 10 }).default("1"),
    subtotal: decimal("subtotal", { precision: 20, scale: 4 }).default("0").notNull(),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    totalAmount: decimal("total_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    receivedAmount: decimal("received_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    billedAmount: decimal("billed_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    perBilled: decimal("per_billed", { precision: 5, scale: 2 }).default("0"),
    perReceived: decimal("per_received", { precision: 5, scale: 2 }).default("0"),
    terms: text("terms"),
    remarks: text("remarks"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    requestForQuotationId: uuid("request_for_quotation_id"),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    cancelledBy: uuid("cancelled_by").references(() => users.id),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("purchase_orders_tenant_id_idx").on(t.tenantId),
    index("purchase_orders_company_id_idx").on(t.companyId),
    index("purchase_orders_supplier_id_idx").on(t.supplierId),
    index("purchase_orders_date_idx").on(t.orderDate),
    index("purchase_orders_status_idx").on(t.status),
    uniqueIndex("purchase_orders_number_company_idx").on(t.purchaseOrderNumber, t.companyId),
  ]
);

export const purchaseOrderLines = pgTable(
  "purchase_order_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    purchaseOrderId: uuid("purchase_order_id")
      .notNull()
      .references(() => purchaseOrders.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    description: varchar("description", { length: 500 }),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    receivedQty: decimal("received_qty", { precision: 20, scale: 4 }).default("0").notNull(),
    billedQty: decimal("billed_qty", { precision: 20, scale: 4 }).default("0").notNull(),
    unitPrice: decimal("unit_price", { precision: 20, scale: 4 }).notNull(),
    discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0"),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0"),
    netAmount: decimal("net_amount", { precision: 20, scale: 4 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 4 }).notNull(),
    warehouseId: uuid("warehouse_id"),
    requiredDate: date("required_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("purchase_order_lines_tenant_id_idx").on(t.tenantId),
    index("purchase_order_lines_order_id_idx").on(t.purchaseOrderId),
    index("purchase_order_lines_item_id_idx").on(t.itemId),
  ]
);

export const purchaseReceipts = pgTable(
  "purchase_receipts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    receiptNumber: varchar("receipt_number", { length: 50 }).notNull(),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id),
    purchaseOrderId: uuid("purchase_order_id").references(() => purchaseOrders.id),
    postingDate: date("posting_date").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    totalAmount: decimal("total_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("purchase_receipts_tenant_id_idx").on(t.tenantId),
    index("purchase_receipts_company_id_idx").on(t.companyId),
    index("purchase_receipts_supplier_id_idx").on(t.supplierId),
    uniqueIndex("purchase_receipts_number_company_idx").on(t.receiptNumber, t.companyId),
  ]
);

export const requestForQuotations = pgTable(
  "request_for_quotations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    rfqNumber: varchar("rfq_number", { length: 50 }).notNull(),
    requestDate: date("request_date").notNull(),
    closingDate: date("closing_date"),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    totalEstimatedAmount: decimal("total_estimated_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    terms: text("terms"),
    remarks: text("remarks"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("request_for_quotations_tenant_id_idx").on(t.tenantId),
    index("request_for_quotations_company_id_idx").on(t.companyId),
    index("request_for_quotations_date_idx").on(t.requestDate),
    index("request_for_quotations_status_idx").on(t.status),
    uniqueIndex("request_for_quotations_number_company_idx").on(t.rfqNumber, t.companyId),
  ]
);

export const rfqLines = pgTable(
  "rfq_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    rfqId: uuid("rfq_id")
      .notNull()
      .references(() => requestForQuotations.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    description: varchar("description", { length: 500 }),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    requiredDate: date("required_date"),
    estimatedRate: decimal("estimated_rate", { precision: 20, scale: 4 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("rfq_lines_tenant_id_idx").on(t.tenantId),
    index("rfq_lines_rfq_id_idx").on(t.rfqId),
    index("rfq_lines_item_id_idx").on(t.itemId),
  ]
);

export const supplierQuotations = pgTable(
  "supplier_quotations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    rfqId: uuid("rfq_id")
      .references(() => requestForQuotations.id),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id),
    quotationDate: date("quotation_date").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    totalAmount: decimal("total_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    isSelected: boolean("is_selected").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("supplier_quotations_tenant_id_idx").on(t.tenantId),
    index("supplier_quotations_company_id_idx").on(t.companyId),
    index("supplier_quotations_supplier_id_idx").on(t.supplierId),
    index("supplier_quotations_rfq_id_idx").on(t.rfqId),
  ]
);
