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
    leadOwnerId: uuid("lead_owner_id").references(() => users.id),
    contactLeadSource: varchar("contact_lead_source", { length: 100 }),
    leadStatus: varchar("lead_status", { length: 50 }),
    qualificationStatus: varchar("qualification_status", { length: 50 }),
    qualifiedBy: uuid("qualified_by").references(() => users.id),
    qualifiedAt: timestamp("qualified_at"),
    expectedDealValue: decimal("expected_deal_value", { precision: 20, scale: 4 }),
    nextContactDate: date("next_contact_date"),
    lastContactDate: date("last_contact_date"),
    communicationCount: integer("communication_count").default(0),
    lastCommunicationType: varchar("last_communication_type", { length: 50 }),
    lastCommunicationDate: timestamp("last_communication_date"),
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

// ========== ERPNEXT-MISSING CRM TABLES ==========

// CRM Settings (singleton)
export const crmSettings = pgTable(
  "crm_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    defaultLeadSource: varchar("default_lead_source", { length: 100 }),
    defaultTerritory: varchar("default_territory", { length: 100 }),
    leadAutoAssignment: boolean("lead_auto_assignment").default(false).notNull(),
    opportunityAutoCreateQuotation: boolean("opportunity_auto_create_quotation").default(false).notNull(),
    emailNotification: boolean("email_notification").default(true).notNull(),
    campaignEmailLimit: integer("campaign_email_limit").default(500),
    communicationType: varchar("communication_type", { length: 50 }).default("email"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("crm_settings_tenant_idx").on(t.tenantId),
    index("crm_settings_company_idx").on(t.companyId),
  ]
);

// Email Campaign
export const emailCampaigns = pgTable(
  "email_campaigns",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    campaignName: varchar("campaign_name", { length: 255 }).notNull(),
    emailSubject: varchar("email_subject", { length: 500 }).notNull(),
    emailBody: text("email_body"),
    senderName: varchar("sender_name", { length: 255 }),
    senderEmail: varchar("sender_email", { length: 255 }),
    recipientsType: varchar("recipients_type", { length: 50 }), // lead, customer, list
    recipients: jsonb("recipients").default([]),
    startDate: date("start_date"),
    scheduledDate: date("scheduled_date"),
    campaignStatus: varchar("campaign_status", { length: 50 }).default("draft").notNull(),
    totalRecipients: integer("total_recipients").default(0),
    emailsSent: integer("emails_sent").default(0),
    emailsOpened: integer("emails_opened").default(0),
    emailsReplied: integer("emails_replied").default(0),
    emailsBounced: integer("emails_bounced").default(0),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("email_campaigns_tenant_idx").on(t.tenantId),
    index("email_campaigns_company_idx").on(t.companyId),
    index("email_campaigns_status_idx").on(t.campaignStatus),
  ]
);

// Social Media Profiles
export const socialMediaProfiles = pgTable(
  "social_media_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    platform: varchar("platform", { length: 50 }).notNull(),
    profileUrl: varchar("profile_url", { length: 500 }).notNull(),
    profileName: varchar("profile_name", { length: 255 }),
    followers: integer("followers").default(0),
    engagement: decimal("engagement", { precision: 5, scale: 2 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("social_media_profiles_tenant_idx").on(t.tenantId),
    index("social_media_profiles_company_idx").on(t.companyId),
    index("social_media_profiles_platform_idx").on(t.platform),
  ]
);

// Deal Stage
export const dealStages = pgTable(
  "deal_stages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    stageName: varchar("stage_name", { length: 255 }).notNull(),
    stageOrder: integer("stage_order").notNull(),
    probability: integer("probability").default(0),
    isActive: boolean("is_active").default(true).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("deal_stages_tenant_idx").on(t.tenantId),
    index("deal_stages_company_idx").on(t.companyId),
  ]
);

// Lead Source
export const leadSources = pgTable(
  "lead_sources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    sourceName: varchar("source_name", { length: 255 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("lead_sources_tenant_idx").on(t.tenantId),
    index("lead_sources_company_idx").on(t.companyId),
  ]
);

// Lead Status
export const leadStatuses = pgTable(
  "lead_statuses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    statusName: varchar("status_name", { length: 255 }).notNull(),
    statusOrder: integer("status_order").notNull(),
    color: varchar("color", { length: 20 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("lead_statuses_tenant_idx").on(t.tenantId),
    index("lead_statuses_company_idx").on(t.companyId),
  ]
);

// Communication (unified log for leads/opportunities/contracts)
export const communications = pgTable(
  "communications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    communicationType: varchar("communication_type", { length: 50 }).notNull(), // email, phone, meeting, note
    referenceDoctype: varchar("reference_doctype", { length: 50 }).notNull(), // lead, opportunity, contract
    referenceName: uuid("reference_name").notNull(),
    sender: varchar("sender", { length: 255 }),
    senderId: uuid("sender_id").references(() => users.id),
    recipients: jsonb("recipients").default([]),
    subject: varchar("subject", { length: 500 }),
    content: text("content"),
    communicationDate: timestamp("communication_date").notNull(),
    status: varchar("status", { length: 20 }).default("sent"),
    attachments: jsonb("attachments").default([]),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("communications_tenant_idx").on(t.tenantId),
    index("communications_company_idx").on(t.companyId),
    index("communications_type_idx").on(t.communicationType),
    index("communications_reference_idx").on(t.referenceDoctype, t.referenceName),
    index("communications_date_idx").on(t.communicationDate),
  ]
);
