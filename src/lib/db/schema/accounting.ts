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
import { companies, fiscalYears } from "./core";
import { users } from "./auth";

export const chartOfAccounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    accountCode: varchar("account_code", { length: 50 }).notNull(),
    accountName: varchar("account_name", { length: 255 }).notNull(),
    accountType: varchar("account_type", { length: 50 }).notNull(),
    rootType: varchar("root_type", { length: 50 }).notNull(),
    parentId: uuid("parent_id"),
    isGroup: boolean("is_group").default(false).notNull(),
    isFrozen: boolean("is_frozen").default(false).notNull(),
    isInternal: boolean("is_internal").default(false).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    balance: decimal("balance", { precision: 20, scale: 4 }).default("0").notNull(),
    debitBalance: decimal("debit_balance", { precision: 20, scale: 4 }).default("0").notNull(),
    creditBalance: decimal("credit_balance", { precision: 20, scale: 4 }).default("0").notNull(),
    description: text("description"),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("accounts_tenant_id_idx").on(t.tenantId),
    index("accounts_company_id_idx").on(t.companyId),
    index("accounts_type_idx").on(t.accountType),
    uniqueIndex("accounts_code_company_idx").on(t.accountCode, t.companyId),
  ]
);

export const journalEntries = pgTable(
  "journal_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    fiscalYearId: uuid("fiscal_year_id")
      .notNull()
      .references(() => fiscalYears.id),
    entryNumber: varchar("entry_number", { length: 50 }).notNull(),
    entryDate: date("entry_date").notNull(),
    postingDate: date("posting_date").notNull(),
    voucherType: varchar("voucher_type", { length: 50 }).notNull(),
    voucherNumber: varchar("voucher_number", { length: 50 }),
    narration: text("narration"),
    referenceType: varchar("reference_type", { length: 50 }),
    referenceName: varchar("reference_name", { length: 255 }),
    totalDebit: decimal("total_debit", { precision: 20, scale: 4 }).default("0").notNull(),
    totalCredit: decimal("total_credit", { precision: 20, scale: 4 }).default("0").notNull(),
    totalAmount: decimal("total_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    isAmended: boolean("is_amended").default(false).notNull(),
    amendedFrom: uuid("amended_from"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    costCenterId: uuid("cost_center_id"),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    cancelledBy: uuid("cancelled_by").references(() => users.id),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("journal_entries_tenant_id_idx").on(t.tenantId),
    index("journal_entries_company_id_idx").on(t.companyId),
    index("journal_entries_date_idx").on(t.entryDate),
    index("journal_entries_status_idx").on(t.status),
    index("journal_entries_voucher_type_idx").on(t.voucherType),
    uniqueIndex("journal_entries_number_company_idx").on(t.entryNumber, t.companyId),
  ]
);

export const journalEntryLines = pgTable(
  "journal_entry_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    journalEntryId: uuid("journal_entry_id")
      .notNull()
      .references(() => journalEntries.id, { onDelete: "cascade" }),
    accountId: uuid("account_id")
      .notNull()
      .references(() => chartOfAccounts.id),
    debit: decimal("debit", { precision: 20, scale: 4 }).default("0").notNull(),
    credit: decimal("credit", { precision: 20, scale: 4 }).default("0").notNull(),
    exchangeRate: decimal("exchange_rate", { precision: 20, scale: 10 }).default("1"),
    referenceType: varchar("reference_type", { length: 50 }),
    referenceName: varchar("reference_name", { length: 255 }),
    costCenterId: uuid("cost_center_id"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("journal_entry_lines_tenant_id_idx").on(t.tenantId),
    index("journal_entry_lines_entry_id_idx").on(t.journalEntryId),
    index("journal_entry_lines_account_id_idx").on(t.accountId),
  ]
);

export const paymentEntries = pgTable(
  "payment_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    partyType: varchar("party_type", { length: 50 }).notNull(),
    partyId: uuid("party_id").notNull(),
    paymentType: varchar("payment_type", { length: 20 }).notNull(),
    paymentDate: date("payment_date").notNull(),
    postingDate: date("posting_date").notNull(),
    modeOfPayment: varchar("mode_of_payment", { length: 100 }),
    amount: decimal("amount", { precision: 20, scale: 4 }).notNull(),
    receivedAmount: decimal("received_amount", { precision: 20, scale: 4 }),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    exchangeRate: decimal("exchange_rate", { precision: 20, scale: 10 }).default("1"),
    referenceNumber: varchar("reference_number", { length: 255 }),
    referenceDate: date("reference_date"),
    remarks: text("remarks"),
    journalEntryId: uuid("journal_entry_id").references(() => journalEntries.id),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("payment_entries_tenant_id_idx").on(t.tenantId),
    index("payment_entries_company_id_idx").on(t.companyId),
    index("payment_entries_party_idx").on(t.partyType, t.partyId),
    index("payment_entries_date_idx").on(t.paymentDate),
    index("payment_entries_status_idx").on(t.status),
  ]
);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    invoiceType: varchar("invoice_type", { length: 20 }).notNull(),
    invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
    partyType: varchar("party_type", { length: 50 }).notNull(),
    partyId: uuid("party_id").notNull(),
    invoiceDate: date("invoice_date").notNull(),
    postingDate: date("posting_date").notNull(),
    dueDate: date("due_date"),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    exchangeRate: decimal("exchange_rate", { precision: 20, scale: 10 }).default("1"),
    subtotal: decimal("subtotal", { precision: 20, scale: 4 }).default("0").notNull(),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    totalAmount: decimal("total_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    paidAmount: decimal("paid_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    outstandingAmount: decimal("outstanding_amount", { precision: 20, scale: 4 }).default("0").notNull(),
    paymentTerms: varchar("payment_terms", { length: 100 }),
    remarks: text("remarks"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    journalEntryId: uuid("journal_entry_id").references(() => journalEntries.id),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    cancelledBy: uuid("cancelled_by").references(() => users.id),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("invoices_tenant_id_idx").on(t.tenantId),
    index("invoices_company_id_idx").on(t.companyId),
    index("invoices_party_idx").on(t.partyType, t.partyId),
    index("invoices_date_idx").on(t.invoiceDate),
    index("invoices_status_idx").on(t.status),
    index("invoices_type_idx").on(t.invoiceType),
    uniqueIndex("invoices_number_company_idx").on(t.invoiceNumber, t.companyId),
  ]
);

export const invoiceLines = pgTable(
  "invoice_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    invoiceId: uuid("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    itemId: uuid("item_id"),
    description: varchar("description", { length: 500 }),
    quantity: decimal("quantity", { precision: 20, scale: 4 }).notNull(),
    unitPrice: decimal("unit_price", { precision: 20, scale: 4 }).notNull(),
    discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"),
    discountAmount: decimal("discount_amount", { precision: 20, scale: 4 }).default("0"),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0"),
    netAmount: decimal("net_amount", { precision: 20, scale: 4 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 4 }).notNull(),
    accountId: uuid("account_id").references(() => chartOfAccounts.id),
    costCenterId: uuid("cost_center_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("invoice_lines_tenant_id_idx").on(t.tenantId),
    index("invoice_lines_invoice_id_idx").on(t.invoiceId),
    index("invoice_lines_item_id_idx").on(t.itemId),
  ]
);
