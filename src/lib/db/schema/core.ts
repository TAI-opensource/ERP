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
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    legalName: varchar("legal_name", { length: 255 }),
    taxId: varchar("tax_id", { length: 50 }),
    registrationNumber: varchar("registration_number", { length: 100 }),
    domain: varchar("domain", { length: 255 }),
    logo: varchar("logo", { length: 512 }),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    website: varchar("website", { length: 255 }),
    addressLine1: varchar("address_line1", { length: 255 }),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }),
    fiscalYearStartMonth: integer("fiscal_year_start_month").default(1).notNull(),
    fiscalYearStartDay: integer("fiscal_year_start_day").default(1).notNull(),
    baseCurrency: varchar("base_currency", { length: 3 }).default("USD").notNull(),
    timezone: varchar("timezone", { length: 50 }).default("UTC").notNull(),
    settings: jsonb("settings").default({}),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("companies_tenant_id_idx").on(t.tenantId),
    index("companies_domain_idx").on(t.domain),
  ]
);

export const fiscalYears = pgTable(
  "fiscal_years",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    yearStartDate: date("year_start_date").notNull(),
    yearEndDate: date("year_end_date").notNull(),
    isClosed: boolean("is_closed").default(false).notNull(),
    closedAt: timestamp("closed_at"),
    closedBy: uuid("closed_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("fiscal_years_tenant_id_idx").on(t.tenantId),
    index("fiscal_years_company_id_idx").on(t.companyId),
  ]
);

export const currencies = pgTable(
  "currencies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 3 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    symbol: varchar("symbol", { length: 10 }).notNull(),
    decimalPlaces: integer("decimal_places").default(2).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("currencies_code_idx").on(t.code)]
);

export const exchangeRates = pgTable(
  "exchange_rates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    fromCurrency: varchar("from_currency", { length: 3 }).notNull(),
    toCurrency: varchar("to_currency", { length: 3 }).notNull(),
    rate: decimal("rate", { precision: 20, scale: 10 }).notNull(),
    effectiveDate: date("effective_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("exchange_rates_tenant_id_idx").on(t.tenantId),
    index("exchange_rates_pair_date_idx").on(t.fromCurrency, t.toCurrency, t.effectiveDate),
  ]
);

export const branches = pgTable(
  "branches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 50 }),
    addressLine1: varchar("address_line1", { length: 255 }),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("branches_tenant_id_idx").on(t.tenantId),
    index("branches_company_id_idx").on(t.companyId),
  ]
);

export const costCenters = pgTable(
  "cost_centers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 50 }),
    description: text("description"),
    parentId: uuid("parent_id"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("cost_centers_tenant_id_idx").on(t.tenantId),
    index("cost_centers_company_id_idx").on(t.companyId),
  ]
);
