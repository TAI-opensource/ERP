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
    const asOfDate = request.nextUrl.searchParams.get("asOfDate") || new Date().toISOString().split("T")[0];

    if (!companyId) return badRequest("companyId is required");

    const bankAccounts = await db.query.chartOfAccounts.findMany({
      where: and(
        eq(chartOfAccounts.companyId, companyId),
        eq(chartOfAccounts.accountType, "bank"),
        eq(chartOfAccounts.isActive, true)
      ),
      orderBy: [chartOfAccounts.accountCode],
    });

    const accountBalances = await db
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
          sql`${journalEntries.postingDate} <= ${asOfDate}`
        )
      )
      .groupBy(journalEntryLines.accountId);

    const balancesMap = new Map<string, { debit: number; credit: number }>();
    for (const line of accountBalances) {
      balancesMap.set(line.accountId, {
        debit: parseFloat(line.debit),
        credit: parseFloat(line.credit),
      });
    }

    let totalBalance = 0;
    const accounts = bankAccounts.map((account) => {
      const bal = balancesMap.get(account.id) || { debit: 0, credit: 0 };
      const balance = bal.debit - bal.credit;
      totalBalance += balance;
      return {
        id: account.id,
        accountCode: account.accountCode,
        accountName: account.accountName,
        currency: account.currency,
        balance: balance.toFixed(4),
      };
    });

    return success({
      asOfDate,
      bankAccounts: accounts,
      totalBalance: totalBalance.toFixed(4),
    });
  } catch (error) {
    console.error("GET /api/reports/bank-summary error:", error);
    return serverError();
  }
}
