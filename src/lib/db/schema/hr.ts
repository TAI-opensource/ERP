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
    branchId: uuid("branch_id"),
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
