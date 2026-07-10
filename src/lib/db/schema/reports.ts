import { pgTable, uuid, varchar, boolean, timestamp, jsonb, text } from "drizzle-orm/pg-core";

export const reportConfigs = pgTable("report_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  filters: jsonb("filters"),
  columns: jsonb("columns"),
  userId: uuid("user_id"),
  companyId: uuid("company_id"),
  tenantId: uuid("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reportSchedules = pgTable("report_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportConfigId: uuid("report_config_id").references(() => reportConfigs.id, { onDelete: "cascade" }),
  frequency: varchar("frequency", { length: 50 }).notNull(),
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  emailRecipients: text("email_recipients").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
