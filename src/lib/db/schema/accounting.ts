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
    projectName: varchar("project_name", { length: 255 }),
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
    bankAccount: uuid("bank_account").references(() => chartOfAccounts.id),
    partyAccount: uuid("party_account").references(() => chartOfAccounts.id),
    isInternalTransfer: boolean("is_internal_transfer").default(false).notNull(),
    taxAmount: decimal("tax_amount", { precision: 20, scale: 4 }).default("0"),
    baseAmount: decimal("base_amount", { precision: 20, scale: 4 }),
    baseReceivedAmount: decimal("base_received_amount", { precision: 20, scale: 4 }),
    unallocatedAmount: decimal("unallocated_amount", { precision: 20, scale: 4 }).default("0"),
    costCenterId: uuid("cost_center_id"),
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
    taxTemplate: varchar("tax_template", { length: 255 }),
    shippingAddress: text("shipping_address"),
    billingAddress: text("billing_address"),
    advancePaid: decimal("advance_paid", { precision: 20, scale: 4 }).default("0"),
    writeOffAmount: decimal("write_off_amount", { precision: 20, scale: 4 }).default("0"),
    roundingAdjustment: decimal("rounding_adjustment", { precision: 20, scale: 4 }).default("0"),
    baseTotal: decimal("base_total", { precision: 20, scale: 4 }).default("0"),
    baseTaxAmount: decimal("base_tax_amount", { precision: 20, scale: 4 }).default("0"),
    baseTotalAmount: decimal("base_total_amount", { precision: 20, scale: 4 }).default("0"),
    placeOfSupply: varchar("place_of_supply", { length: 100 }),
    isReverseCharge: boolean("is_reverse_charge").default(false).notNull(),
    costCenterId: uuid("cost_center_id"),
    projectCode: varchar("project_code", { length: 100 }),
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
    quantityInStock: decimal("quantity_in_stock", { precision: 20, scale: 4 }),
    unitOfMeasure: varchar("unit_of_measure", { length: 50 }),
    stockLedgerEntryId: uuid("stock_ledger_entry_id"),
    projectName: varchar("project_name", { length: 255 }),
    incomeAccount: uuid("income_account").references(() => chartOfAccounts.id),
    expenseAccount: uuid("expense_account").references(() => chartOfAccounts.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("invoice_lines_tenant_id_idx").on(t.tenantId),
    index("invoice_lines_invoice_id_idx").on(t.invoiceId),
    index("invoice_lines_item_id_idx").on(t.itemId),
  ]
);

// ========== MISSING TABLES FROM ERPNEXT ==========

// Accounts Receivable Aging (Snapshot)
export const receivableAgingSnapshots = pgTable(
  "receivable_aging_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    snapshotDate: date("snapshot_date").notNull(),
    partyType: varchar("party_type", { length: 50 }).notNull(),
    partyId: uuid("party_id").notNull(),
    partyName: varchar("party_name", { length: 255 }),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    totalOutstanding: decimal("total_outstanding", { precision: 20, scale: 4 }).default("0"),
    current: decimal("current", { precision: 20, scale: 4 }).default("0"),
    days30: decimal("days_30", { precision: 20, scale: 4 }).default("0"),
    days60: decimal("days_60", { precision: 20, scale: 4 }).default("0"),
    days90: decimal("days_90", { precision: 20, scale: 4 }).default("0"),
    over90: decimal("over_90", { precision: 20, scale: 4 }).default("0"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("receivable_aging_tenant_idx").on(t.tenantId),
    index("receivable_aging_company_idx").on(t.companyId),
    index("receivable_aging_date_idx").on(t.snapshotDate),
    index("receivable_aging_party_idx").on(t.partyType, t.partyId),
  ]
);

// Accounts Payable Aging (Snapshot)
export const payableAgingSnapshots = pgTable(
  "payable_aging_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    snapshotDate: date("snapshot_date").notNull(),
    partyType: varchar("party_type", { length: 50 }).notNull(),
    partyId: uuid("party_id").notNull(),
    partyName: varchar("party_name", { length: 255 }),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    totalOutstanding: decimal("total_outstanding", { precision: 20, scale: 4 }).default("0"),
    current: decimal("current", { precision: 20, scale: 4 }).default("0"),
    days30: decimal("days_30", { precision: 20, scale: 4 }).default("0"),
    days60: decimal("days_60", { precision: 20, scale: 4 }).default("0"),
    days90: decimal("days_90", { precision: 20, scale: 4 }).default("0"),
    over90: decimal("over_90", { precision: 20, scale: 4 }).default("0"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("payable_aging_tenant_idx").on(t.tenantId),
    index("payable_aging_company_idx").on(t.companyId),
    index("payable_aging_date_idx").on(t.snapshotDate),
    index("payable_aging_party_idx").on(t.partyType, t.partyId),
  ]
);

// Budget (with distribution)
export const budgets = pgTable(
  "budgets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    budgetName: varchar("budget_name", { length: 255 }).notNull(),
    budgetType: varchar("budget_type", { length: 50 }).default("cost_center").notNull(),
    fiscalYearId: uuid("fiscal_year_id").notNull().references(() => fiscalYears.id),
    costCenterId: uuid("cost_center_id"),
    departmentId: uuid("department_id"),
    accountId: uuid("account_id").references(() => chartOfAccounts.id),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    totalBudget: decimal("total_budget", { precision: 20, scale: 4 }).notNull(),
    consumedAmount: decimal("consumed_amount", { precision: 20, scale: 4 }).default("0"),
    availableAmount: decimal("available_amount", { precision: 20, scale: 4 }).default("0"),
    monthlyDistribution: jsonb("monthly_distribution").default({}),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("budgets_tenant_id_idx").on(t.tenantId),
    index("budgets_company_id_idx").on(t.companyId),
    index("budgets_fiscal_year_idx").on(t.fiscalYearId),
    index("budgets_cost_center_idx").on(t.costCenterId),
    index("budgets_account_idx").on(t.accountId),
  ]
);

// Financial Statements (Report Builder)
export const financialStatementReports = pgTable(
  "financial_statement_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    reportName: varchar("report_name", { length: 255 }).notNull(),
    reportType: varchar("report_type", { length: 50 }).notNull(), // balance_sheet, income_statement, cash_flow, trial_balance
    filterData: jsonb("filter_data").default({}),
    generatedBy: uuid("generated_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("financial_reports_tenant_idx").on(t.tenantId),
    index("financial_reports_company_idx").on(t.companyId),
    index("financial_reports_type_idx").on(t.reportType),
  ]
);

// Bank Reconciliation
export const bankReconciliations = pgTable(
  "bank_reconciliations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    bankAccountId: uuid("bank_account_id").notNull().references(() => chartOfAccounts.id),
    reconciliationDate: date("reconciliation_date").notNull(),
    bankStatementDate: date("bank_statement_date"),
    openingBalance: decimal("opening_balance", { precision: 20, scale: 4 }).default("0"),
    closingBalance: decimal("closing_balance", { precision: 20, scale: 4 }).default("0"),
    difference: decimal("difference", { precision: 20, scale: 4 }).default("0"),
    isComplete: boolean("is_complete").default(false).notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    remarks: text("remarks"),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("bank_recon_tenant_idx").on(t.tenantId),
    index("bank_recon_company_idx").on(t.companyId),
    index("bank_recon_bank_account_idx").on(t.bankAccountId),
  ]
);

// Tax Withholding (for regions like Brazil, India, etc.)
export const taxWithholdingCategories = pgTable(
  "tax_withholding_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    categoryName: varchar("category_name", { length: 255 }).notNull(),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull(),
    minAmount: decimal("min_amount", { precision: 20, scale: 4 }),
    maxAmount: decimal("max_amount", { precision: 20, scale: 4 }),
    accountId: uuid("account_id").references(() => chartOfAccounts.id),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("tax_withholding_tenant_idx").on(t.tenantId),
    index("tax_withholding_company_idx").on(t.companyId),
  ]
);
