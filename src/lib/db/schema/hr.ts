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
import { companies, branches } from "./core";
import { users } from "./auth";

export const departments = pgTable(
  "departments",
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
    head: varchar("head", { length: 255 }),
    headId: uuid("head_id"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("departments_tenant_id_idx").on(t.tenantId),
    index("departments_company_id_idx").on(t.companyId),
  ]
);

export const designations = pgTable(
  "designations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    departmentId: uuid("department_id").references(() => departments.id),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("designations_tenant_id_idx").on(t.tenantId),
    index("designations_company_id_idx").on(t.companyId),
    index("designations_department_id_idx").on(t.departmentId),
  ]
);

export const employees = pgTable(
  "employees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id),
    employeeId: varchar("employee_id", { length: 50 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    middleName: varchar("middle_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    employeeName: varchar("employee_name", { length: 255 }).notNull(),
    dateOfBirth: date("date_of_birth"),
    gender: varchar("gender", { length: 20 }),
    maritalStatus: varchar("marital_status", { length: 20 }),
    bloodGroup: varchar("blood_group", { length: 10 }),
    religion: varchar("religion", { length: 50 }),
    nationality: varchar("nationality", { length: 50 }),
    ethnicity: varchar("ethnicity", { length: 50 }),
    personalEmail: varchar("personal_email", { length: 255 }),
    personalPhone: varchar("personal_phone", { length: 50 }),
    companyEmail: varchar("company_email", { length: 255 }),
    companyPhone: varchar("company_phone", { length: 50 }),
    dateOfJoining: date("date_of_joining").notNull(),
    dateOfLeaving: date("date_of_leaving"),
    departmentId: uuid("department_id").references(() => departments.id),
    designationId: uuid("designation_id").references(() => designations.id),
    reportsTo: uuid("reports_to"),
    employeeType: varchar("employee_type", { length: 50 }).default("full_time").notNull(),
    employmentStatus: varchar("employment_status", { length: 50 }).default("active").notNull(),
    salaryCurrency: varchar("salary_currency", { length: 3 }).default("USD"),
    grossSalary: decimal("gross_salary", { precision: 20, scale: 4 }),
    bankName: varchar("bank_name", { length: 255 }),
    bankAccountNumber: varchar("bank_account_number", { length: 100 }),
    bankBranch: varchar("bank_branch", { length: 255 }),
    taxId: varchar("tax_id", { length: 50 }),
    socialSecurityNumber: varchar("social_security_number", { length: 50 }),
    addressLine1: varchar("address_line1", { length: 255 }),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }),
    emergencyContactName: varchar("emergency_contact_name", { length: 255 }),
    emergencyContactPhone: varchar("emergency_contact_phone", { length: 50 }),
    emergencyContactRelation: varchar("emergency_contact_relation", { length: 50 }),
    image: varchar("image", { length: 512 }),
    notes: text("notes"),
    employmentTypeId: uuid("employment_type_id").references(() => employmentTypes.id),
    branchId: uuid("branch_id").references(() => branches.id),
    holidayListId: uuid("holiday_list_id").references(() => holidayLists.id),
    shiftType: varchar("shift_type", { length: 100 }),
    grade: varchar("grade", { length: 100 }),
    modeOfPayment: varchar("mode_of_payment", { length: 100 }),
    numberOfDependents: integer("numberOfDependents"),
    passportNumber: varchar("passport_number", { length: 50 }),
    visaExpiryDate: date("visa_expiry_date"),
    contractEndDate: date("contract_end_date"),
    pensionFund: varchar("pension_fund", { length: 255 }),
    providentFund: varchar("provident_fund", { length: 255 }),
    college: varchar("college", { length: 255 }),
    university: varchar("university", { length: 255 }),
    highestQualification: varchar("highest_qualification", { length: 255 }),
    graduationYear: integer("graduation_year"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("employees_tenant_id_idx").on(t.tenantId),
    index("employees_company_id_idx").on(t.companyId),
    index("employees_department_id_idx").on(t.departmentId),
    index("employees_designation_id_idx").on(t.designationId),
    index("employees_reports_to_idx").on(t.reportsTo),
    index("employees_status_idx").on(t.employmentStatus),
    index("employees_email_idx").on(t.personalEmail),
    uniqueIndex("employees_number_company_idx").on(t.employeeId, t.companyId),
  ]
);

export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    attendanceDate: date("attendance_date").notNull(),
    status: varchar("status", { length: 20 }).notNull(),
    clockIn: timestamp("clock_in"),
    clockOut: timestamp("clock_out"),
    workHours: decimal("work_hours", { precision: 5, scale: 2 }),
    overtimeHours: decimal("overtime_hours", { precision: 5, scale: 2 }).default("0"),
    lateMinutes: integer("late_minutes").default(0),
    earlyLeaveMinutes: integer("early_leave_minutes").default(0),
    breakMinutes: integer("break_minutes").default(0),
    shift: varchar("shift", { length: 50 }),
    remarks: text("remarks"),
    approvedBy: uuid("approved_by").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("attendance_tenant_id_idx").on(t.tenantId),
    index("attendance_company_id_idx").on(t.companyId),
    index("attendance_employee_id_idx").on(t.employeeId),
    index("attendance_date_idx").on(t.attendanceDate),
    index("attendance_status_idx").on(t.status),
    uniqueIndex("attendance_employee_date_idx").on(t.employeeId, t.attendanceDate),
  ]
);

export const leaveTypes = pgTable(
  "leave_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    daysPerYear: integer("days_per_year").notNull(),
    isCarryForward: boolean("is_carry_forward").default(false).notNull(),
    maxCarryForwardDays: integer("max_carry_forward_days"),
    isEncashable: boolean("is_encashable").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("leave_types_tenant_id_idx").on(t.tenantId),
    index("leave_types_company_id_idx").on(t.companyId),
  ]
);

export const leaveApplications = pgTable(
  "leave_applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    leaveTypeId: uuid("leave_type_id")
      .notNull()
      .references(() => leaveTypes.id),
    fromDate: date("from_date").notNull(),
    toDate: date("to_date").notNull(),
    totalDays: integer("total_days").notNull(),
    reason: text("reason"),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    approvedBy: uuid("approved_by").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    rejectionReason: text("rejection_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("leave_applications_tenant_id_idx").on(t.tenantId),
    index("leave_applications_company_id_idx").on(t.companyId),
    index("leave_applications_employee_id_idx").on(t.employeeId),
    index("leave_applications_leave_type_id_idx").on(t.leaveTypeId),
    index("leave_applications_date_idx").on(t.fromDate, t.toDate),
    index("leave_applications_status_idx").on(t.status),
  ]
);

export const salaryStructures = pgTable(
  "salary_structures",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("salary_structures_tenant_id_idx").on(t.tenantId),
    index("salary_structures_company_id_idx").on(t.companyId),
  ]
);

export const salaryStructureComponents = pgTable(
  "salary_structure_components",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    salaryStructureId: uuid("salary_structure_id")
      .notNull()
      .references(() => salaryStructures.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 20 }).notNull(),
    amount: decimal("amount", { precision: 20, scale: 4 }),
    percentage: decimal("percentage", { precision: 5, scale: 2 }),
    formula: text("formula"),
    dependsOn: varchar("depends_on", { length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("salary_structure_components_tenant_id_idx").on(t.tenantId),
    index("salary_structure_components_structure_id_idx").on(t.salaryStructureId),
  ]
);

export const employeeSalary = pgTable(
  "employee_salary",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    salaryStructureId: uuid("salary_structure_id")
      .references(() => salaryStructures.id),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    grossSalary: decimal("gross_salary", { precision: 20, scale: 4 }).notNull(),
    netSalary: decimal("net_salary", { precision: 20, scale: 4 }).notNull(),
    effectiveDate: date("effective_date").notNull(),
    endDate: date("end_date"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("employee_salary_tenant_id_idx").on(t.tenantId),
    index("employee_salary_company_id_idx").on(t.companyId),
    index("employee_salary_employee_id_idx").on(t.employeeId),
    index("employee_salary_date_idx").on(t.effectiveDate),
  ]
);

export const payrollEntries = pgTable(
  "payroll_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id),
    payrollDate: date("payroll_date").notNull(),
    periodStartDate: date("period_start_date").notNull(),
    periodEndDate: date("period_end_date").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    grossSalary: decimal("gross_salary", { precision: 20, scale: 4 }).notNull(),
    totalDeductions: decimal("total_deductions", { precision: 20, scale: 4 }).default("0").notNull(),
    netPay: decimal("net_pay", { precision: 20, scale: 4 }).notNull(),
    paymentDate: date("payment_date"),
    paymentMethod: varchar("payment_method", { length: 50 }),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("payroll_entries_tenant_id_idx").on(t.tenantId),
    index("payroll_entries_company_id_idx").on(t.companyId),
    index("payroll_entries_employee_id_idx").on(t.employeeId),
    index("payroll_entries_date_idx").on(t.payrollDate),
    index("payroll_entries_status_idx").on(t.status),
  ]
);

// ========== ERPNEXT-MISSING HR TABLES ==========

// Employment Type
export const employmentTypes = pgTable(
  "employment_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    employmentType: varchar("employment_type", { length: 100 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("employment_types_tenant_idx").on(t.tenantId),
    index("employment_types_company_idx").on(t.companyId),
  ]
);

// Holiday List
export const holidayLists = pgTable(
  "holiday_lists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    holidayListName: varchar("holiday_list_name", { length: 255 }).notNull(),
    fromDate: date("from_date").notNull(),
    toDate: date("to_date").notNull(),
    weeklyOffDays: jsonb("weekly_off_days").default([]),
    totalHolidays: integer("total_holidays").default(0),
    isDefault: boolean("is_default").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("holiday_lists_tenant_idx").on(t.tenantId),
    index("holiday_lists_company_idx").on(t.companyId),
  ]
);

// Holidays (individual)
export const holidays = pgTable(
  "holidays",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    holidayListId: uuid("holiday_list_id").notNull().references(() => holidayLists.id, { onDelete: "cascade" }),
    holidayDate: date("holiday_date").notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    weeklyOff: boolean("weekly_off").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("holidays_tenant_idx").on(t.tenantId),
    index("holidays_list_idx").on(t.holidayListId),
    index("holidays_date_idx").on(t.holidayDate),
  ]
);

// Shift Type
export const shiftTypes = pgTable(
  "shift_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    shiftName: varchar("shift_name", { length: 100 }).notNull(),
    startTime: varchar("start_time", { length: 10 }).notNull(),
    endTime: varchar("end_time", { length: 10 }).notNull(),
    hoursPerDay: decimal("hours_per_day", { precision: 5, scale: 2 }).default("8"),
    gracePeriodMinutes: integer("grace_period_minutes").default(0),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("shift_types_tenant_idx").on(t.tenantId),
    index("shift_types_company_idx").on(t.companyId),
  ]
);

// Leave Allocation
export const leaveAllocations = pgTable(
  "leave_allocations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id").notNull().references(() => employees.id),
    leaveType: varchar("leave_type", { length: 100 }).notNull(),
    leaveTypeId: uuid("leave_type_id").references(() => leaveTypes.id),
    fromDate: date("from_date").notNull(),
    toDate: date("to_date").notNull(),
    totalAllocation: integer("total_allocation").notNull(),
    expired: integer("expired").default(0),
    utilized: integer("utilized").default(0),
    available: integer("available").default(0),
    carryForward: boolean("carry_forward").default(false).notNull(),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("leave_allocations_tenant_idx").on(t.tenantId),
    index("leave_allocations_company_idx").on(t.companyId),
    index("leave_allocations_employee_idx").on(t.employeeId),
    index("leave_allocations_date_idx").on(t.fromDate, t.toDate),
  ]
);

// Expense Claim
export const expenseClaims = pgTable(
  "expense_claims",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    claimNumber: varchar("claim_number", { length: 50 }).notNull(),
    employeeId: uuid("employee_id").notNull().references(() => employees.id),
    postingDate: date("posting_date").notNull(),
    totalClaimedAmount: decimal("total_claimed_amount", { precision: 20, scale: 4 }).default("0"),
    totalApprovedAmount: decimal("total_approved_amount", { precision: 20, scale: 4 }).default("0"),
    totalSanctionedAmount: decimal("total_sanctioned_amount", { precision: 20, scale: 4 }).default("0"),
    expensesBooked: boolean("expenses_booked").default(false).notNull(),
    costCenterId: uuid("cost_center_id"),
    remarks: text("remarks"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    approvedBy: uuid("approved_by").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("expense_claims_tenant_idx").on(t.tenantId),
    index("expense_claims_company_idx").on(t.companyId),
    index("expense_claims_employee_idx").on(t.employeeId),
    index("expense_claims_status_idx").on(t.status),
    uniqueIndex("expense_claims_number_company_idx").on(t.claimNumber, t.companyId),
  ]
);

// Expense Claim Detail
export const expenseClaimDetails = pgTable(
  "expense_claim_details",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    expenseClaimId: uuid("expense_claim_id").notNull().references(() => expenseClaims.id, { onDelete: "cascade" }),
    expenseType: varchar("expense_type", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }),
    amount: decimal("amount", { precision: 20, scale: 4 }).notNull(),
    sanctionAmount: decimal("sanction_amount", { precision: 20, scale: 4 }),
    date: date("date").notNull(),
    costCenterId: uuid("cost_center_id"),
    projectId: uuid("project_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("expense_claim_details_tenant_idx").on(t.tenantId),
    index("expense_claim_details_claim_idx").on(t.expenseClaimId),
  ]
);

// Employee Education
export const employeeEducation = pgTable(
  "employee_education",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
    schoolUniversity: varchar("school_university", { length: 255 }).notNull(),
    qualification: varchar("qualification", { length: 255 }).notNull(),
    fieldOfStudy: varchar("field_of_study", { length: 255 }),
    fromDate: date("from_date"),
    toDate: date("to_date"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("employee_education_tenant_idx").on(t.tenantId),
    index("employee_education_employee_idx").on(t.employeeId),
  ]
);

// Employee Work History
export const employeeWorkHistory = pgTable(
  "employee_work_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
    company: varchar("company", { length: 255 }).notNull(),
    designation: varchar("designation", { length: 255 }),
    department: varchar("department", { length: 255 }),
    startDate: date("start_date"),
    endDate: date("end_date"),
    description: text("description"),
    salary: decimal("salary", { precision: 20, scale: 4 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("employee_work_history_tenant_idx").on(t.tenantId),
    index("employee_work_history_employee_idx").on(t.employeeId),
  ]
);

// Payroll Entry (batch payroll processing)
export const payrollEntryBatches = pgTable(
  "payroll_entry_batches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    batchName: varchar("batch_name", { length: 255 }).notNull(),
    payrollFrequency: varchar("payroll_frequency", { length: 50 }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    paymentDate: date("payment_date"),
    departmentId: uuid("department_id").references(() => departments.id),
    totalEmployees: integer("total_employees").default(0),
    totalGrossPay: decimal("total_gross_pay", { precision: 20, scale: 4 }).default("0"),
    totalDeductions: decimal("total_deductions", { precision: 20, scale: 4 }).default("0"),
    totalNetPay: decimal("total_net_pay", { precision: 20, scale: 4 }).default("0"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("payroll_batches_tenant_idx").on(t.tenantId),
    index("payroll_batches_company_idx").on(t.companyId),
    index("payroll_batches_status_idx").on(t.status),
  ]
);

// Leave Policy
export const leavePolicies = pgTable(
  "leave_policies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    policyName: varchar("policy_name", { length: 255 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("leave_policies_tenant_idx").on(t.tenantId),
    index("leave_policies_company_idx").on(t.companyId),
  ]
);

// Leave Policy Assignment
export const leavePolicyAssignments = pgTable(
  "leave_policy_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    leavePolicyId: uuid("leave_policy_id").notNull().references(() => leavePolicies.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id").references(() => employees.id),
    departmentId: uuid("department_id").references(() => departments.id),
    designation: varchar("designation", { length: 255 }),
    grade: varchar("grade", { length: 100 }),
    fromDate: date("from_date").notNull(),
    toDate: date("to_date").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("leave_policy_assignments_tenant_idx").on(t.tenantId),
    index("leave_policy_assignments_policy_idx").on(t.leavePolicyId),
    index("leave_policy_assignments_employee_idx").on(t.employeeId),
  ]
);

// Auto Attendance
export const autoAttendances = pgTable(
  "auto_attendances",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id").notNull().references(() => employees.id),
    attendanceDate: date("attendance_date").notNull(),
    shiftType: varchar("shift_type", { length: 100 }),
    checkIn: varchar("check_in", { length: 10 }),
    checkOut: varchar("check_out", { length: 10 }),
    deviceId: varchar("device_id", { length: 100 }),
    logs: jsonb("logs").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("auto_attendances_tenant_idx").on(t.tenantId),
    index("auto_attendances_employee_idx").on(t.employeeId),
    index("auto_attendances_date_idx").on(t.attendanceDate),
  ]
);

// Employee Checkin
export const employeeCheckins = pgTable(
  "employee_checkins",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    employeeId: uuid("employee_id").notNull().references(() => employees.id),
    employeeName: varchar("employee_name", { length: 255 }),
    time: timestamp("time").notNull(),
    logType: varchar("log_type", { length: 50 }).notNull(), // IN, OUT
    deviceId: varchar("device_id", { length: 100 }),
    shiftType: varchar("shift_type", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("employee_checkins_tenant_idx").on(t.tenantId),
    index("employee_checkins_employee_idx").on(t.employeeId),
    index("employee_checkins_time_idx").on(t.time),
  ]
);
