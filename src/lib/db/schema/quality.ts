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

export const qualityProcedures = pgTable(
  "quality_procedures",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    procedureName: varchar("procedure_name", { length: 255 }).notNull(),
    procedureId: varchar("procedure_id", { length: 50 }),
    description: text("description"),
    procedureType: varchar("procedure_type", { length: 100 }),
    departmentId: uuid("department_id"),
    responsiblePerson: varchar("responsible_person", { length: 255 }),
    revisionNumber: integer("revision_number").default(1).notNull(),
    effectiveDate: date("effective_date"),
    reviewDate: date("review_date"),
    status: varchar("status", { length: 50 }).default("draft").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    approvedBy: uuid("approved_by").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("quality_procedures_tenant_id_idx").on(t.tenantId),
    index("quality_procedures_company_id_idx").on(t.companyId),
    index("quality_procedures_status_idx").on(t.status),
    index("quality_procedures_type_idx").on(t.procedureType),
  ]
);

export const qualityGoals = pgTable(
  "quality_goals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    goalName: varchar("goal_name", { length: 255 }).notNull(),
    description: text("description"),
    goalType: varchar("goal_type", { length: 100 }),
    departmentId: uuid("department_id"),
    responsiblePerson: varchar("responsible_person", { length: 255 }),
    targetValue: decimal("target_value", { precision: 20, scale: 4 }),
    currentValue: decimal("current_value", { precision: 20, scale: 4 }).default("0"),
    unit: varchar("unit", { length: 50 }),
    startDate: date("start_date"),
    endDate: date("end_date"),
    status: varchar("status", { length: 50 }).default("active").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    progress: integer("progress").default(0),
    notes: text("notes"),
    isActive: boolean("is_active").default(true).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("quality_goals_tenant_id_idx").on(t.tenantId),
    index("quality_goals_company_id_idx").on(t.companyId),
    index("quality_goals_status_idx").on(t.status),
    index("quality_goals_type_idx").on(t.goalType),
    index("quality_goals_date_idx").on(t.startDate, t.endDate),
  ]
);

export const qualityReviews = pgTable(
  "quality_reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    reviewName: varchar("review_name", { length: 255 }).notNull(),
    description: text("description"),
    reviewType: varchar("review_type", { length: 100 }).notNull(),
    departmentId: uuid("department_id"),
    reviewDate: date("review_date").notNull(),
    nextReviewDate: date("next_review_date"),
    reviewer: varchar("reviewer", { length: 255 }),
    reviewerId: uuid("reviewer_id").references(() => users.id),
    status: varchar("status", { length: 50 }).default("scheduled").notNull(),
    outcome: text("outcome"),
    recommendations: text("recommendations"),
    rating: integer("rating"),
    findings: text("findings"),
    correctiveActions: jsonb("corrective_actions").default([]),
    attachments: jsonb("attachments").default([]),
    createdBy: uuid("created_by").references(() => users.id),
    approvedBy: uuid("approved_by").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("quality_reviews_tenant_id_idx").on(t.tenantId),
    index("quality_reviews_company_id_idx").on(t.companyId),
    index("quality_reviews_status_idx").on(t.status),
    index("quality_reviews_type_idx").on(t.reviewType),
    index("quality_reviews_date_idx").on(t.reviewDate),
  ]
);

export const qualityIncidents = pgTable(
  "quality_incidents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    incidentNumber: varchar("incident_number", { length: 50 }).notNull(),
    incidentTitle: varchar("incident_title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    incidentType: varchar("incident_type", { length: 100 }).notNull(),
    severity: varchar("severity", { length: 20 }).default("medium").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    departmentId: uuid("department_id"),
    reportedBy: uuid("reported_by").references(() => users.id),
    reportedDate: date("reported_date").notNull(),
    occurredDate: date("occurred_date"),
    rootCause: text("rootCause"),
    correctiveAction: text("corrective_action"),
    preventiveAction: text("preventive_action"),
    status: varchar("status", { length: 50 }).default("open").notNull(),
    resolvedBy: varchar("resolved_by", { length: 255 }),
    resolvedAt: timestamp("resolved_at"),
    verifiedBy: varchar("verified_by", { length: 255 }),
    verifiedAt: timestamp("verified_at"),
    attachments: jsonb("attachments").default([]),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("quality_incidents_tenant_id_idx").on(t.tenantId),
    index("quality_incidents_company_id_idx").on(t.companyId),
    index("quality_incidents_status_idx").on(t.status),
    index("quality_incidents_type_idx").on(t.incidentType),
    index("quality_incidents_severity_idx").on(t.severity),
    index("quality_incidents_date_idx").on(t.reportedDate),
    uniqueIndex("quality_incidents_number_company_idx").on(t.incidentNumber, t.companyId),
  ]
);

export const qualityInspections = pgTable(
  "quality_inspections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    inspectionNumber: varchar("inspection_number", { length: 50 }).notNull(),
    inspectionType: varchar("inspection_type", { length: 100 }).notNull(),
    referenceType: varchar("reference_type", { length: 50 }),
    referenceName: varchar("reference_name", { length: 255 }),
    itemId: uuid("item_id"),
    batchNo: varchar("batch_no", { length: 100 }),
    serialNo: varchar("serial_no", { length: 100 }),
    warehouseId: uuid("warehouse_id"),
    inspectionDate: date("inspection_date").notNull(),
    inspector: varchar("inspector", { length: 255 }),
    inspectorId: uuid("inspector_id").references(() => users.id),
    sampleSize: integer("sample_size"),
    result: varchar("result", { length: 50 }),
    status: varchar("status", { length: 50 }).default("pending").notNull(),
    remarks: text("remarks"),
    attachments: jsonb("attachments").default([]),
    createdBy: uuid("created_by").references(() => users.id),
    approvedBy: uuid("approved_by").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("quality_inspections_tenant_id_idx").on(t.tenantId),
    index("quality_inspections_company_id_idx").on(t.companyId),
    index("quality_inspections_status_idx").on(t.status),
    index("quality_inspections_type_idx").on(t.inspectionType),
    index("quality_inspections_date_idx").on(t.inspectionDate),
    uniqueIndex("quality_inspections_number_company_idx").on(t.inspectionNumber, t.companyId),
  ]
);
