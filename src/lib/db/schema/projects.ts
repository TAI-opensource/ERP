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

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    projectName: varchar("project_name", { length: 255 }).notNull(),
    projectCode: varchar("project_code", { length: 50 }),
    description: text("description"),
    projectType: varchar("project_type", { length: 50 }).default("internal").notNull(),
    status: varchar("status", { length: 50 }).default("planning").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    departmentId: uuid("department_id"),
    customerId: uuid("customer_id"),
    startDate: date("start_date"),
    expectedEndDate: date("expected_end_date"),
    actualEndDate: date("actual_end_date"),
    progress: integer("progress").default(0),
    estimatedCost: decimal("estimated_cost", { precision: 20, scale: 4 }),
    actualCost: decimal("actual_cost", { precision: 20, scale: 4 }).default("0"),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    projectManagerId: uuid("project_manager_id").references(() => users.id),
    notes: text("notes"),
    isTemplate: boolean("is_template").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("projects_tenant_id_idx").on(t.tenantId),
    index("projects_company_id_idx").on(t.companyId),
    index("projects_status_idx").on(t.status),
    index("projects_priority_idx").on(t.priority),
    index("projects_manager_id_idx").on(t.projectManagerId),
    index("projects_customer_id_idx").on(t.customerId),
    uniqueIndex("projects_code_company_idx").on(t.projectCode, t.companyId),
  ]
);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    parentTaskId: uuid("parent_task_id"),
    taskName: varchar("task_name", { length: 255 }).notNull(),
    description: text("description"),
    status: varchar("status", { length: 50 }).default("todo").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    assigneeId: uuid("assignee_id").references(() => users.id),
    startDate: date("start_date"),
    dueDate: date("due_date"),
    estimatedHours: decimal("estimated_hours", { precision: 10, scale: 2 }),
    actualHours: decimal("actual_hours", { precision: 10, scale: 2 }).default("0"),
    progress: integer("progress").default(0),
    completedAt: timestamp("completed_at"),
    completedBy: uuid("completed_by").references(() => users.id),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("tasks_tenant_id_idx").on(t.tenantId),
    index("tasks_company_id_idx").on(t.companyId),
    index("tasks_project_id_idx").on(t.projectId),
    index("tasks_parent_id_idx").on(t.parentTaskId),
    index("tasks_assignee_id_idx").on(t.assigneeId),
    index("tasks_status_idx").on(t.status),
    index("tasks_priority_idx").on(t.priority),
    index("tasks_due_date_idx").on(t.dueDate),
  ]
);

export const timesheets = pgTable(
  "timesheets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    taskId: uuid("task_id").references(() => tasks.id),
    date: date("date").notNull(),
    hours: decimal("hours", { precision: 5, scale: 2 }).notNull(),
    rate: decimal("rate", { precision: 20, scale: 4 }),
    amount: decimal("amount", { precision: 20, scale: 4 }),
    description: text("description"),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    approvedBy: uuid("approved_by").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("timesheets_tenant_id_idx").on(t.tenantId),
    index("timesheets_company_id_idx").on(t.companyId),
    index("timesheets_employee_id_idx").on(t.employeeId),
    index("timesheets_project_id_idx").on(t.projectId),
    index("timesheets_task_id_idx").on(t.taskId),
    index("timesheets_date_idx").on(t.date),
    index("timesheets_status_idx").on(t.status),
  ]
);

export const milestones = pgTable(
  "milestones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    milestoneName: varchar("milestone_name", { length: 255 }).notNull(),
    description: text("description"),
    dueDate: date("due_date"),
    status: varchar("status", { length: 50 }).default("pending").notNull(),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("milestones_tenant_id_idx").on(t.tenantId),
    index("milestones_company_id_idx").on(t.companyId),
    index("milestones_project_id_idx").on(t.projectId),
    index("milestones_due_date_idx").on(t.dueDate),
  ]
);

export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).default("member").notNull(),
    hourlyRate: decimal("hourly_rate", { precision: 20, scale: 4 }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("project_members_tenant_id_idx").on(t.tenantId),
    index("project_members_project_id_idx").on(t.projectId),
    index("project_members_user_id_idx").on(t.userId),
    uniqueIndex("project_members_project_user_idx").on(t.projectId, t.userId),
  ]
);
