import { NextRequest } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalEntries, journalEntryLines, chartOfAccounts } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const companyId = request.nextUrl.searchParams.get("companyId");
    const fromDate = request.nextUrl.searchParams.get("fromDate");
    const toDate = request.nextUrl.searchParams.get("toDate");

    if (!companyId) return badRequest("companyId is required");
    if (!fromDate || !toDate) return badRequest("fromDate and toDate are required");

    const accounts = await db.query.chartOfAccounts.findMany({
      where: and(
        eq(chartOfAccounts.companyId, companyId),
        eq(chartOfAccounts.isActive, true)
      ),
    });

    const entryLines = await db
      .select({
        accountId: journalEntryLines.accountId,
        debit: sql<string>`COALESCE(SUM(CAST(${journalEntryLines.debit} AS DECIMAL(20,4))), 0)`.as("totalDebit"),
        credit: sql<string>`COALESCE(SUM(CAST(${journalEntryLines.credit} AS DECIMAL(20,4))), 0)`.as("totalCredit"),
      })
      .from(journalEntryLines)
      .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
      .where(
        and(
          eq(journalEntries.companyId, companyId),
          eq(journalEntries.status, "posted"),
          sql`${journalEntries.postingDate} >= ${fromDate}`,
          sql`${journalEntries.postingDate} <= ${toDate}`
        )
      )
      .groupBy(journalEntryLines.accountId);

    const balancesMap = new Map<string, { debit: number; credit: number }>();
    for (const line of entryLines) {
      balancesMap.set(line.accountId, {
        debit: parseFloat(line.debit),
        credit: parseFloat(line.credit),
      });
    }

    const operatingActivities = { items: [] as any[], total: 0 };
    const investingActivities = { items: [] as any[], total: 0 };
    const financingActivities = { items: [] as any[], total: 0 };

    for (const account of accounts) {
      const bal = balancesMap.get(account.id) || { debit: 0, credit: 0 };
      const balance = bal.debit - bal.credit;

      if (account.rootType === "income" || account.rootType === "expense") {
        operatingActivities.items.push({
          accountCode: account.accountCode,
          accountName: account.accountName,
          amount: Math.abs(balance),
        });
        operatingActivities.total += balance;
      } else if (account.accountType === "fixed_asset" || account.accountType === "investment") {
        investingActivities.items.push({
          accountCode: account.accountCode,
          accountName: account.accountName,
          amount: Math.abs(balance),
        });
        investingActivities.total += balance;
      } else if (account.rootType === "equity" || account.accountType === "loan") {
        financingActivities.items.push({
          accountCode: account.accountCode,
          accountName: account.accountName,
          amount: Math.abs(balance),
        });
        financingActivities.total += balance;
      }
    }

    const netCashFlow = operatingActivities.total + investingActivities.total + financingActivities.total;

    return success({
      period: { fromDate, toDate },
      cashFlow: {
        operatingActivities,
        investingActivities,
        financingActivities,
        netCashFlow,
      },
    });
  } catch (error) {
    console.error("GET /api/reports/cash-flow error:", error);
    return serverError();
  }
}
