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
import { customers } from "./selling";

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    leadName: varchar("lead_name", { length: 255 }).notNull(),
    leadSource: varchar("lead_source", { length: 100 }),
    leadOwner: varchar("lead_owner", { length: 255 }),
    leadOwnerId: uuid("lead_owner_id").references(() => users.id),
    status: varchar("status", { length: 50 }).default("new").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    contactName: varchar("contact_name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    mobileNo: varchar("mobile_no", { length: 50 }),
    company: varchar("company", { length: 255 }),
    designation: varchar("designation", { length: 100 }),
    addressLine1: varchar("address_line1", { length: 255 }),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }),
    website: varchar("website", { length: 255 }),
    industry: varchar("industry", { length: 100 }),
    annualRevenue: decimal("annual_revenue", { precision: 20, scale: 4 }),
    noOfEmployees: integer("no_of_employees"),
    territory: varchar("territory", { length: 100 }),
    campaignId: uuid("campaign_id"),
    convertedToOpportunity: boolean("converted_to_opportunity").default(false).notNull(),
    opportunityId: uuid("opportunity_id"),
    convertedToCustomer: boolean("converted_to_customer").default(false).notNull(),
    customerId: uuid("customer_id").references(() => customers.id),
    convertedAt: timestamp("converted_at"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("leads_tenant_id_idx").on(t.tenantId),
    index("leads_company_id_idx").on(t.companyId),
    index("leads_owner_id_idx").on(t.leadOwnerId),
    index("leads_status_idx").on(t.status),
    index("leads_source_idx").on(t.leadSource),
    index("leads_email_idx").on(t.email),
    index("leads_campaign_id_idx").on(t.campaignId),
  ]
);

export const opportunities = pgTable(
  "opportunities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    opportunityName: varchar("opportunity_name", { length: 255 }).notNull(),
    customerId: uuid("customer_id").references(() => customers.id),
    leadId: uuid("lead_id").references(() => leads.id),
    opportunityType: varchar("opportunity_type", { length: 50 }).default("sales").notNull(),
    status: varchar("status", { length: 50 }).default("open").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    dealStage: varchar("deal_stage", { length: 100 }),
    probability: integer("probability"),
    expectedCloseDate: date("expected_close_date"),
    actualCloseDate: date("actual_close_date"),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    dealValue: decimal("deal_value", { precision: 20, scale: 4 }),
    annualRevenue: decimal("annual_revenue", { precision: 20, scale: 4 }),
    owner: varchar("owner", { length: 255 }),
    ownerId: uuid("owner_id").references(() => users.id),
    campaignId: uuid("campaign_id"),
    contactPerson: varchar("contact_person", { length: 255 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    nextStep: varchar("next_step", { length: 255 }),
    notes: text("notes"),
    convertedToQuotation: boolean("converted_to_quotation").default(false).notNull(),
    convertedToSalesOrder: boolean("converted_to_sales_order").default(false).notNull(),
    convertedAt: timestamp("converted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("opportunities_tenant_id_idx").on(t.tenantId),
    index("opportunities_company_id_idx").on(t.companyId),
    index("opportunities_customer_id_idx").on(t.customerId),
    index("opportunities_lead_id_idx").on(t.leadId),
    index("opportunities_owner_id_idx").on(t.ownerId),
    index("opportunities_status_idx").on(t.status),
    index("opportunities_stage_idx").on(t.dealStage),
    index("opportunities_close_date_idx").on(t.expectedCloseDate),
  ]
);

export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    campaignName: varchar("campaign_name", { length: 255 }).notNull(),
    campaignType: varchar("campaign_type", { length: 50 }),
    status: varchar("status", { length: 50 }).default("planned").notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    budget: decimal("budget", { precision: 20, scale: 4 }),
    spentAmount: decimal("spent_amount", { precision: 20, scale: 4 }).default("0"),
    expectedResponse: integer("expected_response"),
    numberOfLeads: integer("number_of_leads").default(0),
    numberOfOpportunities: integer("number_of_opportunities").default(0),
    expectedRevenue: decimal("expected_revenue", { precision: 20, scale: 4 }),
    actualRevenue: decimal("actual_revenue", { precision: 20, scale: 4 }).default("0"),
    costPerLead: decimal("cost_per_lead", { precision: 20, scale: 4 }),
    description: text("description"),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("campaigns_tenant_id_idx").on(t.tenantId),
    index("campaigns_company_id_idx").on(t.companyId),
    index("campaigns_status_idx").on(t.status),
    index("campaigns_type_idx").on(t.campaignType),
    index("campaigns_date_idx").on(t.startDate, t.endDate),
  ]
);

export const contracts = pgTable(
  "contracts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    contractName: varchar("contract_name", { length: 255 }).notNull(),
    contractType: varchar("contract_type", { length: 50 }).notNull(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    opportunityId: uuid("opportunity_id").references(() => opportunities.id),
    contractDate: date("contract_date").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    renewalDate: date("renewal_date"),
    isAutoRenew: boolean("is_auto_renew").default(false).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    contractValue: decimal("contract_value", { precision: 20, scale: 4 }).notNull(),
    billingFrequency: varchar("billing_frequency", { length: 50 }),
    paymentTerms: varchar("payment_terms", { length: 100 }),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    terms: text("terms"),
    notes: text("notes"),
    signedBy: varchar("signed_by", { length: 255 }),
    signedAt: timestamp("signed_at"),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    cancelledBy: uuid("cancelled_by").references(() => users.id),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("contracts_tenant_id_idx").on(t.tenantId),
    index("contracts_company_id_idx").on(t.companyId),
    index("contracts_customer_id_idx").on(t.customerId),
    index("contracts_opportunity_id_idx").on(t.opportunityId),
    index("contracts_status_idx").on(t.status),
    index("contracts_type_idx").on(t.contractType),
    index("contracts_start_date_idx").on(t.startDate),
    index("contracts_end_date_idx").on(t.endDate),
  ]
);
