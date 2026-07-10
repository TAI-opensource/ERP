import { NextRequest } from "next/server";
import { eq, and, sql, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { chartOfAccounts, journalEntries, journalEntryLines } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset } = parseSearchParams(request.nextUrl.searchParams);
    const companyId = request.nextUrl.searchParams.get("companyId");
    const fromDate = request.nextUrl.searchParams.get("fromDate");
    const toDate = request.nextUrl.searchParams.get("toDate");
    const accountId = request.nextUrl.searchParams.get("accountId");

    if (!companyId) return badRequest("companyId is required");
    if (!fromDate || !toDate) return badRequest("fromDate and toDate are required");

    const conditions: any[] = [
      eq(journalEntryLines.companyId, companyId),
      eq(journalEntries.status, "posted"),
      sql`${journalEntries.postingDate} >= ${fromDate}`,
      sql`${journalEntries.postingDate} <= ${toDate}`,
    ];

    if (accountId) conditions.push(eq(journalEntryLines.accountId, accountId));

    const accountFilter = and(...conditions);

    const [data, totalResult] = await Promise.all([
      db
        .select({
          id: journalEntryLines.id,
          postingDate: journalEntries.postingDate,
          entryNumber: journalEntries.entryNumber,
          voucherType: journalEntries.voucherType,
          voucherNumber: journalEntries.voucherNumber,
          accountId: journalEntryLines.accountId,
          accountCode: chartOfAccounts.accountCode,
          accountName: chartOfAccounts.accountName,
          debit: journalEntryLines.debit,
          credit: journalEntryLines.credit,
          description: journalEntryLines.description,
          costCenterId: journalEntryLines.costCenterId,
        })
        .from(journalEntryLines)
        .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
        .innerJoin(chartOfAccounts, eq(journalEntryLines.accountId, chartOfAccounts.id))
        .where(accountFilter)
        .orderBy(asc(journalEntries.postingDate), asc(journalEntries.entryNumber))
        .limit(limit)
        .offset(offset),
      db
        .select({ value: sql<number>`count(*)::int` })
        .from(journalEntryLines)
        .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
        .where(accountFilter),
    ]);

    let runningDebit = 0;
    let runningCredit = 0;

    const entries = data.map((entry) => {
      runningDebit += parseFloat(entry.debit as string);
      runningCredit += parseFloat(entry.credit as string);

      return {
        ...entry,
        runningDebit: runningDebit.toFixed(4),
        runningCredit: runningCredit.toFixed(4),
        balance: (runningDebit - runningCredit).toFixed(4),
      };
    });

    return success({
      data: entries,
      pagination: {
        page,
        limit,
        total: totalResult[0]?.value || 0,
        totalPages: Math.ceil((totalResult[0]?.value || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/reports/general-ledger error:", error);
    return serverError();
  }
}
