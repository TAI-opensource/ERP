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
    supplierGroupId: uuid("supplier_group_id").references(() => supplierGroups.id),
    frozen: boolean("frozen").default(false).notNull(),
    frozenAt: timestamp("frozen_at"),
    onHold: boolean("on_hold").default(false).notNull(),
    isTransporter: boolean("is_transporter").default(false).notNull(),
    taxWithholdingCategory: varchar("tax_withholding_category", { length: 100 }),
    addressId: uuid("address_id"),
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
    paymentTermsTemplateId: uuid("payment_terms_template_id"),
    shippingAddressName: varchar("shipping_address_name", { length: 255 }),
    billingAddressName: varchar("billing_address_name", { length: 255 }),
    costCenterId: uuid("cost_center_id"),
    projectCode: varchar("project_code", { length: 100 }),
    interCompanyReference: varchar("inter_company_reference", { length: 255 }),
    isSubcontracted: boolean("is_subcontracted").default(false).notNull(),
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

// ========== ERPNEXT-MISSING BUYING TABLES ==========

// Supplier Groups (tree)
export const supplierGroups = pgTable(
  "supplier_groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    groupName: varchar("group_name", { length: 255 }).notNull(),
    parentId: uuid("parent_id"),
    isGroup: boolean("is_group").default(false).notNull(),
    lft: integer("lft"),
    rgt: integer("rgt"),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("supplier_groups_tenant_idx").on(t.tenantId),
    index("supplier_groups_company_idx").on(t.companyId),
    index("supplier_groups_parent_idx").on(t.parentId),
  ]
);

// Purchase Invoice
export const purchaseInvoices = pgTable(
  "purchase_invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
    supplierId: uuid("supplier_id").notNull().references(() => suppliers.id),
    purchaseOrderId: uuid("purchase_order_id"),
    purchaseReceiptId: uuid("purchase_receipt_id"),
    postingDate: date("posting_date").notNull(),
    dueDate: date("due_date"),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    exchangeRate: decimal("exchange_rate", { precision: 20, scale: 10 }).default("1"),
    subtotal: decimal("subtotal", { precision: 20, scale: 4 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0"),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0"),
    totalAmount: decimal("total_amount", { precision: 20, scale: 4 }).default("0"),
    paidAmount: decimal("paid_amount", { precision: 20, scale: 4 }).default("0"),
    outstandingAmount: decimal("outstanding_amount", { precision: 20, scale: 4 }).default("0"),
    costCenterId: uuid("cost_center_id"),
    paymentTermsTemplate: varchar("payment_terms_template", { length: 100 }),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    cancelledBy: uuid("cancelled_by").references(() => users.id),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("purchase_invoices_tenant_idx").on(t.tenantId),
    index("purchase_invoices_company_idx").on(t.companyId),
    index("purchase_invoices_supplier_idx").on(t.supplierId),
    index("purchase_invoices_date_idx").on(t.postingDate),
    index("purchase_invoices_status_idx").on(t.status),
    uniqueIndex("purchase_invoices_number_company_idx").on(t.invoiceNumber, t.companyId),
  ]
);

// Purchase Invoice Lines
export const purchaseInvoiceLines = pgTable(
  "purchase_invoice_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    purchaseInvoiceId: uuid("purchase_invoice_id").notNull().references(() => purchaseInvoices.id, { onDelete: "cascade" }),
    itemId: uuid("item_id").notNull().references(() => items.id),
    description: varchar("description", { length: 500 }),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    unitPrice: decimal("unit_price", { precision: 20, scale: 4 }).notNull(),
    discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0"),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0"),
    netAmount: decimal("net_amount", { precision: 20, scale: 4 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 4 }).notNull(),
    expenseAccount: uuid("expense_account").references(() => chartOfAccounts.id),
    warehouseId: uuid("warehouse_id"),
    costCenterId: uuid("cost_center_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("purchase_invoice_lines_tenant_idx").on(t.tenantId),
    index("purchase_invoice_lines_invoice_idx").on(t.purchaseInvoiceId),
    index("purchase_invoice_lines_item_idx").on(t.itemId),
  ]
);

// Purchase Receipt Lines (add child table for existing purchaseReceipts)
export const purchaseReceiptLines = pgTable(
  "purchase_receipt_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    purchaseReceiptId: uuid("purchase_receipt_id").notNull().references(() => purchaseReceipts.id, { onDelete: "cascade" }),
    itemId: uuid("item_id").notNull().references(() => items.id),
    description: varchar("description", { length: 500 }),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    receivedQty: decimal("received_qty", { precision: 20, scale: 4 }).default("0"),
    rejectedQty: decimal("rejected_qty", { precision: 20, scale: 4 }).default("0"),
    unitPrice: decimal("unit_price", { precision: 20, scale: 4 }).notNull(),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0"),
    netAmount: decimal("net_amount", { precision: 20, scale: 4 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 4 }).notNull(),
    warehouseId: uuid("warehouse_id"),
    batchNo: varchar("batch_no", { length: 100 }),
    serialNo: text("serial_no"),
    purchaseOrderId: uuid("purchase_order_id").references(() => purchaseOrders.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("purchase_receipt_lines_tenant_idx").on(t.tenantId),
    index("purchase_receipt_lines_receipt_idx").on(t.purchaseReceiptId),
    index("purchase_receipt_lines_item_idx").on(t.itemId),
  ]
);

// Supplier Quotation Lines
export const supplierQuotationLines = pgTable(
  "supplier_quotation_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    supplierQuotationId: uuid("supplier_quotation_id").notNull().references(() => supplierQuotations.id, { onDelete: "cascade" }),
    itemId: uuid("item_id").notNull().references(() => items.id),
    description: varchar("description", { length: 500 }),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    unitPrice: decimal("unit_price", { precision: 20, scale: 4 }).notNull(),
    discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0"),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0"),
    netAmount: decimal("net_amount", { precision: 20, scale: 4 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 4 }).notNull(),
    deliveryDays: integer("delivery_days"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("supplier_quotation_lines_tenant_idx").on(t.tenantId),
    index("supplier_quotation_lines_quotation_idx").on(t.supplierQuotationId),
    index("supplier_quotation_lines_item_idx").on(t.itemId),
  ]
);

// Buying Settings (singleton)
export const buyingSettings = pgTable(
  "buying_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    defaultPaymentTerms: varchar("default_payment_terms", { length: 100 }),
    defaultCurrency: varchar("default_currency", { length: 3 }).default("USD"),
    poRequired: boolean("po_required").default(false).notNull(),
    prRequired: boolean("pr_required").default(false).notNull(),
    blanketOrderAllow: boolean("blanket_order_allow").default(true).notNull(),
    defaultAutoRepeat: varchar("default_auto_repeat", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("buying_settings_tenant_idx").on(t.tenantId),
    index("buying_settings_company_idx").on(t.companyId),
  ]
);
