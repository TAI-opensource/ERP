import { pgTable, uuid, varchar, boolean, integer, timestamp, text } from "drizzle-orm/pg-core";

export const workflows = pgTable("workflows", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  documentType: varchar("document_type", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  companyId: uuid("company_id"),
  tenantId: uuid("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workflowStates = pgTable("workflow_states", {
  id: uuid("id").primaryKey().defaultRandom(),
  workflowId: uuid("workflow_id").references(() => workflows.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  sortOrder: integer("sort_order").default(0),
  allowEdit: boolean("allow_edit").default(true),
  allowCancel: boolean("allow_cancel").default(false),
  isStart: boolean("is_start").default(false),
  isEnd: boolean("is_end").default(false),
  nextStates: text("next_states").array(),
});

export const workflowTransitions = pgTable("workflow_transitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workflowId: uuid("workflow_id").references(() => workflows.id, { onDelete: "cascade" }).notNull(),
  fromStateId: uuid("from_state_id").references(() => workflowStates.id).notNull(),
  toStateId: uuid("to_state_id").references(() => workflowStates.id).notNull(),
  allowedRoles: text("allowed_roles").array(),
  label: varchar("label", { length: 255 }),
});

export const workflowLogs = pgTable("workflow_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentType: varchar("document_type", { length: 100 }).notNull(),
  documentId: uuid("document_id").notNull(),
  fromState: varchar("from_state", { length: 100 }),
  toState: varchar("to_state", { length: 100 }).notNull(),
  userId: uuid("user_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  comments: text("comments"),
  action: varchar("action", { length: 50 }).notNull(),
});
