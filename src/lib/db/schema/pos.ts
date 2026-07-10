import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { companies } from "./core";
import { users } from "./auth";

export const posProfiles = pgTable(
  "pos_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    profileName: varchar("profile_name", { length: 255 }).notNull(),
    warehouse: varchar("warehouse", { length: 255 }),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    paymentMethods: jsonb("payment_methods").default([]),
    allowRateChange: boolean("allow_rate_change").default(false).notNull(),
    allowDiscountChange: boolean("allow_discount_change").default(false).notNull(),
    updateStock: boolean("update_stock").default(false).notNull(),
    remarks: text("remarks"),
    isActive: boolean("is_active").default(true).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("pos_profiles_tenant_idx").on(t.tenantId),
    index("pos_profiles_company_idx").on(t.companyId),
  ]
);

export const posInvoices = pgTable(
  "pos_invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    posProfileId: uuid("pos_profile_id").references(() => posProfiles.id),
    invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
    customerId: uuid("customer_id"),
    customerName: varchar("customer_name", { length: 255 }),
    postingDate: timestamp("posting_date").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    totalAmount: decimal("total_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    paidAmount: decimal("paid_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }),
    remarks: text("remarks"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("pos_invoices_tenant_idx").on(t.tenantId),
    index("pos_invoices_company_idx").on(t.companyId),
  ]
);
