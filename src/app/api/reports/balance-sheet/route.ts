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
          sql`${journalEntries.postingDate} <= ${asOfDate}`
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

    const assets = { accounts: [] as any[], totalDebit: 0, totalCredit: 0, netBalance: 0 };
    const liabilities = { accounts: [] as any[], totalDebit: 0, totalCredit: 0, netBalance: 0 };
    const equity = { accounts: [] as any[], totalDebit: 0, totalCredit: 0, netBalance: 0 };

    for (const account of accounts) {
      const bal = balancesMap.get(account.id) || { debit: 0, credit: 0 };
      const balance = bal.debit - bal.credit;
      const entry = {
        id: account.id,
        accountCode: account.accountCode,
        accountName: account.accountName,
        accountType: account.accountType,
        rootType: account.rootType,
        balance: Math.abs(balance),
        balanceType: balance >= 0 ? "debit" : "credit",
      };

      if (account.rootType === "asset") {
        assets.accounts.push(entry);
        assets.totalDebit += bal.debit;
        assets.totalCredit += bal.credit;
        assets.netBalance += balance;
      } else if (account.rootType === "liability") {
        liabilities.accounts.push(entry);
        liabilities.totalDebit += bal.debit;
        liabilities.totalCredit += bal.credit;
        liabilities.netBalance += Math.abs(balance);
      } else if (account.rootType === "equity") {
        equity.accounts.push(entry);
        equity.totalDebit += bal.debit;
        equity.totalCredit += bal.credit;
        equity.netBalance += Math.abs(balance);
      }
    }

    return success({
      asOfDate,
      balanceSheet: {
        assets: {
          ...assets,
          netBalance: Math.abs(assets.netBalance),
        },
        liabilities: {
          ...liabilities,
          netBalance: Math.abs(liabilities.netBalance),
        },
        equity: {
          ...equity,
          netBalance: Math.abs(equity.netBalance),
        },
        totalLiabilitiesAndEquity:
          Math.abs(liabilities.netBalance) + Math.abs(equity.netBalance),
      },
    });
  } catch (error) {
    console.error("GET /api/reports/balance-sheet error:", error);
    return serverError();
  }
}
