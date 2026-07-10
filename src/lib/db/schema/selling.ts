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
