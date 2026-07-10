import { NextRequest } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { chartOfAccounts, journalEntries, journalEntryLines } from "@/lib/db/schema";
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
      orderBy: [chartOfAccounts.accountCode],
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

    const income = { accounts: [] as any[], total: 0 };
    const expenses = { accounts: [] as any[], total: 0 };

    for (const account of accounts) {
      const bal = balancesMap.get(account.id) || { debit: 0, credit: 0 };
      const balance = bal.debit - bal.credit;

      if (account.rootType === "income") {
        const amount = Math.abs(balance);
        income.accounts.push({
          id: account.id,
          accountCode: account.accountCode,
          accountName: account.accountName,
          amount,
        });
        income.total += amount;
      } else if (account.rootType === "expense") {
        const amount = Math.abs(balance);
        expenses.accounts.push({
          id: account.id,
          accountCode: account.accountCode,
          accountName: account.accountName,
          amount,
        });
        expenses.total += amount;
      }
    }

    const grossProfit = income.total - expenses.total;

    return success({
      period: { fromDate, toDate },
      profitAndLoss: {
        income: {
          accounts: income.accounts,
          total: income.total,
        },
        expenses: {
          accounts: expenses.accounts,
          total: expenses.total,
        },
        grossProfit,
        netProfit: grossProfit,
      },
    });
  } catch (error) {
    console.error("GET /api/reports/profit-loss error:", error);
    return serverError();
  }
}
