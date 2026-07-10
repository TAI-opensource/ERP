import { pgTable, uuid, varchar, decimal, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  billingInterval: varchar("billing_interval", { length: 50 }).notNull(),
  billingFrequency: integer("billing_frequency").default(1),
  price: decimal("price", { precision: 20, scale: 4 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  isActive: boolean("is_active").default(true),
  companyId: uuid("company_id"),
  tenantId: uuid("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").notNull(),
  planId: uuid("plan_id").references(() => subscriptionPlans.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: varchar("status", { length: 50 }).default("active"),
  nextBillingDate: timestamp("next_billing_date"),
  companyId: uuid("company_id"),
  tenantId: uuid("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptionInvoices = pgTable("subscription_invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "cascade" }).notNull(),
  invoiceDate: timestamp("invoice_date").notNull(),
  amount: decimal("amount", { precision: 20, scale: 4 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
