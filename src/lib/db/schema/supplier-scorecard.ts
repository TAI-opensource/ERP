import { pgTable, uuid, varchar, decimal, timestamp, text, integer } from "drizzle-orm/pg-core";

export const supplierScorecards = pgTable("supplier_scorecards", {
  id: uuid("id").primaryKey().defaultRandom(),
  supplierId: uuid("supplier_id").notNull(),
  scoringPeriod: varchar("scoring_period", { length: 50 }),
  overallScore: decimal("overall_score", { precision: 5, scale: 2 }),
  status: varchar("status", { length: 50 }).default("draft"),
  companyId: uuid("company_id"),
  tenantId: uuid("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const supplierScorecardCriteria = pgTable("supplier_scorecard_criteria", {
  id: uuid("id").primaryKey().defaultRandom(),
  scorecardId: uuid("scorecard_id").references(() => supplierScorecards.id, { onDelete: "cascade" }).notNull(),
  criteriaName: varchar("criteria_name", { length: 255 }).notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }).default("1"),
  score: decimal("score", { precision: 5, scale: 2 }),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).default("100"),
});

export const supplierScorecardVariables = pgTable("supplier_scorecard_variables", {
  id: uuid("id").primaryKey().defaultRandom(),
  scorecardId: uuid("scorecard_id").references(() => supplierScorecards.id, { onDelete: "cascade" }).notNull(),
  variableName: varchar("variable_name", { length: 255 }).notNull(),
  value: decimal("value", { precision: 20, scale: 4 }),
  unit: varchar("unit", { length: 50 }),
});

export const supplierScorecardStandings = pgTable("supplier_scorecard_standings", {
  id: uuid("id").primaryKey().defaultRandom(),
  scorecardId: uuid("scorecard_id").references(() => supplierScorecards.id, { onDelete: "cascade" }).notNull(),
  standingName: varchar("standing_name", { length: 255 }).notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  remarks: text("remarks"),
});
