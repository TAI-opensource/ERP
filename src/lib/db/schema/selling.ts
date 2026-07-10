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

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    customerType: varchar("customer_type", { length: 50 }).default("individual").notNull(),
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
    creditLimit: decimal("credit_limit", { precision: 20, scale: 4 }).default("0"),
    outstandingAmount: decimal("outstanding_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    customerGroup: varchar("customer_group", { length: 100 }),
    territory: varchar("territory", { length: 100 }),
    salesPerson: varchar("sales_person", { length: 255 }),
    defaultWarehouse: varchar("default_warehouse", { length: 255 }),
    defaultPriceList: varchar("default_price_list", { length: 100 }),
    defaultAccount: uuid("default_account").references(() => chartOfAccounts.id),
    customerGroupId: uuid("customer_group_id").references(() => customerGroups.id),
    territoryId: uuid("territory_id").references(() => territories.id),
    salesPartnerId: uuid("sales_partner_id").references(() => salesPartners.id),
    loyaltyProgramId: uuid("loyalty_program_id").references(() => loyaltyPrograms.id),
    loyaltyPoints: integer("loyalty_points").default(0),
    loyaltyTier: varchar("loyalty_tier", { length: 50 }),
    taxWithholdingCategory: varchar("tax_withholding_category", { length: 100 }),
    frozen: boolean("frozen").default(false).notNull(),
    frozenAt: timestamp("frozen_at"),
    onHold: boolean("on_hold").default(false).notNull(),
    holdTypes: jsonb("hold_types").default([]),
    addressId: uuid("address_id"),
    notes: text("notes"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("customers_tenant_id_idx").on(t.tenantId),
    index("customers_company_id_idx").on(t.companyId),
    index("customers_group_idx").on(t.customerGroup),
    index("customers_territory_idx").on(t.territory),
    index("customers_email_idx").on(t.email),
  ]
);

export const quotations = pgTable(
  "quotations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    quotationNumber: varchar("quotation_number", { length: 50 }).notNull(),
    quotationType: varchar("quotation_type", { length: 50 }).default("quotation").notNull(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    quotationDate: date("quotation_date").notNull(),
    validTill: date("valid_till"),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    exchangeRate: decimal("exchange_rate", { precision: 20, scale: 10 }).default("1"),
    subtotal: decimal("subtotal", { precision: 20, scale: 4 }).default("0").notNull(),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    totalAmount: decimal("total_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    terms: text("terms"),
    remarks: text("remarks"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    convertedToSalesOrder: boolean("converted_to_sales_order").default(false).notNull(),
    salesOrderId: uuid("sales_order_id"),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    cancelledBy: uuid("cancelled_by").references(() => users.id),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("quotations_tenant_id_idx").on(t.tenantId),
    index("quotations_company_id_idx").on(t.companyId),
    index("quotations_customer_id_idx").on(t.customerId),
    index("quotations_date_idx").on(t.quotationDate),
    index("quotations_status_idx").on(t.status),
    uniqueIndex("quotations_number_company_idx").on(t.quotationNumber, t.companyId),
  ]
);

export const quotationLines = pgTable(
  "quotation_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    quotationId: uuid("quotation_id")
      .notNull()
      .references(() => quotations.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    description: varchar("description", { length: 500 }),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    unitPrice: decimal("unit_price", { precision: 20, scale: 4 }).notNull(),
    discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0"),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0"),
    netAmount: decimal("net_amount", { precision: 20, scale: 4 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 4 }).notNull(),
    warehouseId: uuid("warehouse_id"),
    deliveryDate: date("delivery_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("quotation_lines_tenant_id_idx").on(t.tenantId),
    index("quotation_lines_quotation_id_idx").on(t.quotationId),
    index("quotation_lines_item_id_idx").on(t.itemId),
  ]
);

export const salesOrders = pgTable(
  "sales_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    salesOrderNumber: varchar("sales_order_number", { length: 50 }).notNull(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    orderDate: date("order_date").notNull(),
    deliveryDate: date("delivery_date"),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    exchangeRate: decimal("exchange_rate", { precision: 20, scale: 10 }).default("1"),
    subtotal: decimal("subtotal", { precision: 20, scale: 4 }).default("0").notNull(),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    totalAmount: decimal("total_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    deliveredAmount: decimal("delivered_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    billedAmount: decimal("billed_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    perBilled: decimal("per_billed", { precision: 5, scale: 2 }).default("0"),
    perDelivered: decimal("per_delivered", { precision: 5, scale: 2 }).default("0"),
    terms: text("terms"),
    remarks: text("remarks"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    quotationId: uuid("quotation_id").references(() => quotations.id),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    cancelledBy: uuid("cancelled_by").references(() => users.id),
    cancelledAt: timestamp("cancelled_at"),
    paymentTermsTemplateId: uuid("payment_terms_template_id").references(() => paymentTermsTemplates.id),
    shippingAddressName: varchar("shipping_address_name", { length: 255 }),
    billingAddressName: varchar("billing_address_name", { length: 255 }),
    costCenterId: uuid("cost_center_id"),
    projectCode: varchar("project_code", { length: 100 }),
    dispatchAddressName: varchar("dispatch_address_name", { length: 255 }),
    companyAddressName: varchar("company_address_name", { length: 255 }),
    incoterms: varchar("incoterms", { length: 50 }),
    namedPlace: varchar("named_place", { length: 255 }),
    isInternal: boolean("is_internal").default(false).notNull(),
    interCompanyReference: varchar("inter_company_reference", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("sales_orders_tenant_id_idx").on(t.tenantId),
    index("sales_orders_company_id_idx").on(t.companyId),
    index("sales_orders_customer_id_idx").on(t.customerId),
    index("sales_orders_date_idx").on(t.orderDate),
    index("sales_orders_status_idx").on(t.status),
    uniqueIndex("sales_orders_number_company_idx").on(t.salesOrderNumber, t.companyId),
  ]
);

export const salesOrderLines = pgTable(
  "sales_order_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    salesOrderId: uuid("sales_order_id")
      .notNull()
      .references(() => salesOrders.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id),
    description: varchar("description", { length: 500 }),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    deliveredQty: decimal("delivered_qty", { precision: 20, scale: 4 }).default("0").notNull(),
    billedQty: decimal("billed_qty", { precision: 20, scale: 4 }).default("0").notNull(),
    unitPrice: decimal("unit_price", { precision: 20, scale: 4 }).notNull(),
    discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0"),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0"),
    netAmount: decimal("net_amount", { precision: 20, scale: 4 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 4 }).notNull(),
    warehouseId: uuid("warehouse_id"),
    deliveryDate: date("delivery_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("sales_order_lines_tenant_id_idx").on(t.tenantId),
    index("sales_order_lines_order_id_idx").on(t.salesOrderId),
    index("sales_order_lines_item_id_idx").on(t.itemId),
  ]
);

export const deliveryNotes = pgTable(
  "delivery_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    deliveryNoteNumber: varchar("delivery_note_number", { length: 50 }).notNull(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    salesOrderId: uuid("sales_order_id").references(() => salesOrders.id),
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
    index("delivery_notes_tenant_id_idx").on(t.tenantId),
    index("delivery_notes_company_id_idx").on(t.companyId),
    index("delivery_notes_customer_id_idx").on(t.customerId),
    uniqueIndex("delivery_notes_number_company_idx").on(t.deliveryNoteNumber, t.companyId),
  ]
);

// ========== ERPNEXT-MISSING SELLING TABLES ==========

// Customer Groups (tree)
export const customerGroups = pgTable(
  "customer_groups",
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
    index("customer_groups_tenant_idx").on(t.tenantId),
    index("customer_groups_company_idx").on(t.companyId),
    index("customer_groups_parent_idx").on(t.parentId),
  ]
);

// Territories (tree)
export const territories = pgTable(
  "territories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    territoryName: varchar("territory_name", { length: 255 }).notNull(),
    parentId: uuid("parent_id"),
    isGroup: boolean("is_group").default(false).notNull(),
    lft: integer("lft"),
    rgt: integer("rgt"),
    territoryManager: varchar("territory_manager", { length: 255 }),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("territories_tenant_idx").on(t.tenantId),
    index("territories_company_idx").on(t.companyId),
    index("territories_parent_idx").on(t.parentId),
  ]
);

// Sales Partners
export const salesPartners = pgTable(
  "sales_partners",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    partnerName: varchar("partner_name", { length: 255 }).notNull(),
    partnerType: varchar("partner_type", { length: 50 }).default("individual"),
    commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    address: text("address"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("sales_partners_tenant_idx").on(t.tenantId),
    index("sales_partners_company_idx").on(t.companyId),
  ]
);

// Loyalty Programs
export const loyaltyPrograms = pgTable(
  "loyalty_programs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    programName: varchar("program_name", { length: 255 }).notNull(),
    loyaltyProgramType: varchar("loyalty_program_type", { length: 50 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    roundingFactor: decimal("rounding_factor", { precision: 5, scale: 2 }).default("1"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("loyalty_programs_tenant_idx").on(t.tenantId),
    index("loyalty_programs_company_idx").on(t.companyId),
  ]
);

// Loyalty Program Collection
export const loyaltyProgramCollections = pgTable(
  "loyalty_program_collections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    loyaltyProgramId: uuid("loyalty_program_id").notNull().references(() => loyaltyPrograms.id, { onDelete: "cascade" }),
    collectionTier: varchar("collection_tier", { length: 255 }).notNull(),
    minSpend: decimal("min_spend", { precision: 20, scale: 4 }).default("0"),
    maxSpend: decimal("max_spend", { precision: 20, scale: 4 }),
    collectionFactor: integer("collection_factor").default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("loyalty_collections_tenant_idx").on(t.tenantId),
    index("loyalty_collections_program_idx").on(t.loyaltyProgramId),
  ]
);

// Sales Invoice (for consolidated tracking beyond basic invoices)
export const salesInvoices = pgTable(
  "sales_invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
    customerId: uuid("customer_id").notNull().references(() => customers.id),
    salesOrderId: uuid("sales_order_id"),
    deliveryNoteId: uuid("delivery_note_id"),
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
    index("sales_invoices_tenant_idx").on(t.tenantId),
    index("sales_invoices_company_idx").on(t.companyId),
    index("sales_invoices_customer_idx").on(t.customerId),
    index("sales_invoices_date_idx").on(t.postingDate),
    index("sales_invoices_status_idx").on(t.status),
    uniqueIndex("sales_invoices_number_company_idx").on(t.invoiceNumber, t.companyId),
  ]
);

// Sales Invoice Lines
export const salesInvoiceLines = pgTable(
  "sales_invoice_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    salesInvoiceId: uuid("sales_invoice_id").notNull().references(() => salesInvoices.id, { onDelete: "cascade" }),
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
    incomeAccount: uuid("income_account").references(() => chartOfAccounts.id),
    warehouseId: uuid("warehouse_id"),
    costCenterId: uuid("cost_center_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("sales_invoice_lines_tenant_idx").on(t.tenantId),
    index("sales_invoice_lines_invoice_idx").on(t.salesInvoiceId),
    index("sales_invoice_lines_item_idx").on(t.itemId),
  ]
);

// Payment Terms Template
export const paymentTermsTemplates = pgTable(
  "payment_terms_templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    templateName: varchar("template_name", { length: 255 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("payment_terms_tenant_idx").on(t.tenantId),
    index("payment_terms_company_idx").on(t.companyId),
  ]
);

// Payment Terms Template Details
export const paymentTermsTemplateDetails = pgTable(
  "payment_terms_template_details",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    templateId: uuid("template_id").notNull().references(() => paymentTermsTemplates.id, { onDelete: "cascade" }),
    dueInDays: integer("due_in_days").notNull(),
    description: varchar("description", { length: 255 }),
    invoicePortion: decimal("invoice_portion", { precision: 5, scale: 2 }).default("100"),
    creditDays: integer("credit_days"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("payment_terms_details_tenant_idx").on(t.tenantId),
    index("payment_terms_details_template_idx").on(t.templateId),
  ]
);
