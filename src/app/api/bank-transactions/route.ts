import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalEntries, journalEntryLines, chartOfAccounts } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const bankAccountId = request.nextUrl.searchParams.get("bankAccountId") || "";
    const fromDate = request.nextUrl.searchParams.get("fromDate") || "";
    const toDate = request.nextUrl.searchParams.get("toDate") || "";

    const conditions = [
      eq(journalEntries.voucherType, "bank_transaction"),
    ];
    if (companyId) conditions.push(eq(journalEntries.companyId, companyId));
    if (fromDate) conditions.push(eq(journalEntries.postingDate, fromDate));

    const where = and(...conditions);

    const sortColumn = sort === "postingDate" ? journalEntries.postingDate : journalEntries.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.journalEntries.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
        with: { lines: true },
      }),
      db.select({ value: count() }).from(journalEntries).where(where),
    ]);

    return success({
      data,
      pagination: {
        page,
        limit,
        total: totalResult[0]?.value || 0,
        totalPages: Math.ceil((totalResult[0]?.value || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/bank-transactions error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, bankAccountId, transactionDate, postingDate,
      transactionType, amount, currency, narration, lines,
    } = body;

    if (!tenantId || !companyId || !bankAccountId || !transactionDate || !postingDate || !transactionType || !amount) {
      return badRequest("tenantId, companyId, bankAccountId, transactionDate, postingDate, transactionType, and amount are required");
    }

    const result = await db.transaction(async (tx) => {
      const [entry] = await tx
        .insert(journalEntries)
        .values({
          tenantId,
          companyId,
          fiscalYearId: body.fiscalYearId,
          entryNumber: body.entryNumber || `BANK-${Date.now()}`,
          entryDate: transactionDate,
          postingDate,
          voucherType: "bank_transaction",
          voucherNumber: body.voucherNumber,
          narration,
          totalAmount: amount,
          status: "draft",
          createdBy: session.user!.id as string,
        })
        .returning();

      if (lines && Array.isArray(lines)) {
        const lineValues = lines.map((line: Record<string, unknown>) => ({
          tenantId,
          journalEntryId: entry.id,
          accountId: line.accountId as string,
          debit: String(line.debit || "0"),
          credit: String(line.credit || "0"),
          description: line.description as string | undefined,
        }));
        await tx.insert(journalEntryLines).values(lineValues);
      }

      return entry;
    });

    return success(result, 201);
  } catch (error) {
    console.error("POST /api/bank-transactions error:", error);
    return serverError();
  }
}
