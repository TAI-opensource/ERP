import { NextRequest } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { budgets, journalEntries, journalEntryLines, chartOfAccounts } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const companyId = request.nextUrl.searchParams.get("companyId");
    const fiscalYearId = request.nextUrl.searchParams.get("fiscalYearId");

    if (!companyId) return badRequest("companyId is required");

    const conditions = [eq(budgets.companyId, companyId)];
    if (fiscalYearId) conditions.push(eq(budgets.fiscalYearId, fiscalYearId));

    const budgetData = await db.query.budgets.findMany({
      where: and(...conditions),
    });

    const results = await Promise.all(
      budgetData.map(async (budget) => {
        let consumedAmount = 0;

        if (budget.accountId) {
          const accountLines = await db
            .select({
              totalDebit: sql<string>`COALESCE(SUM(CAST(${journalEntryLines.debit} AS DECIMAL(20,4))), 0)`.as("totalDebit"),
              totalCredit: sql<string>`COALESCE(SUM(CAST(${journalEntryLines.credit} AS DECIMAL(20,4))), 0)`.as("totalCredit"),
            })
            .from(journalEntryLines)
            .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
            .where(
              and(
                eq(journalEntries.companyId, companyId),
                eq(journalEntries.status, "posted"),
                eq(journalEntryLines.accountId, budget.accountId)
              )
            );

          if (accountLines.length > 0) {
            consumedAmount = parseFloat(accountLines[0].totalDebit) - parseFloat(accountLines[0].totalCredit);
          }
        }

        const totalBudget = parseFloat(budget.totalBudget || "0");
        const variance = totalBudget - consumedAmount;
        const variancePercent = totalBudget > 0 ? (variance / totalBudget) * 100 : 0;

        return {
          id: budget.id,
          budgetName: budget.budgetName,
          budgetType: budget.budgetType,
          totalBudget,
          consumedAmount,
          availableAmount: variance,
          variancePercent: variancePercent.toFixed(2),
          status: budget.status,
        };
      })
    );

    return success({ data: results });
  } catch (error) {
    console.error("GET /api/reports/budget-variance error:", error);
    return serverError();
  }
}
