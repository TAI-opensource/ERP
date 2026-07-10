import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalEntries, journalEntryLines } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const voucherType = request.nextUrl.searchParams.get("voucherType") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(journalEntries.companyId, companyId));
    if (search) conditions.push(ilike(journalEntries.entryNumber, `%${search}%`));
    if (status) conditions.push(eq(journalEntries.status, status));
    if (voucherType) conditions.push(eq(journalEntries.voucherType, voucherType));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "entryDate" ? journalEntries.entryDate : journalEntries.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.journalEntries.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
        with: {
          // lines: true, // uncomment if you want lines included
        },
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
    console.error("GET /api/journal-entries error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, companyId, fiscalYearId, entryNumber, entryDate, postingDate, voucherType, narration, lines } = body;

    if (!tenantId || !companyId || !fiscalYearId || !entryNumber || !entryDate || !postingDate || !voucherType) {
      return badRequest("tenantId, companyId, fiscalYearId, entryNumber, entryDate, postingDate, and voucherType are required");
    }

    const result = await db.transaction(async (tx) => {
      let totalDebit = 0;
      let totalCredit = 0;

      if (lines && Array.isArray(lines)) {
        for (const line of lines) {
          totalDebit += parseFloat(line.debit || "0");
          totalCredit += parseFloat(line.credit || "0");
        }
      }

      const [entry] = await tx
        .insert(journalEntries)
        .values({
          tenantId,
          companyId,
          fiscalYearId,
          entryNumber,
          entryDate,
          postingDate,
          voucherType,
          narration,
          totalDebit: totalDebit.toString(),
          totalCredit: totalCredit.toString(),
          totalAmount: Math.max(totalDebit, totalCredit).toString(),
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
          costCenterId: line.costCenterId as string | undefined,
        }));

        await tx.insert(journalEntryLines).values(lineValues);
      }

      return entry;
    });

    return success(result, 201);
  } catch (error) {
    console.error("POST /api/journal-entries error:", error);
    return serverError();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return badRequest("id is required");

    const [updated] = await db
      .update(journalEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(journalEntries.id, id))
      .returning();

    if (!updated) return badRequest("Journal entry not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/journal-entries error:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return badRequest("id is required");

    const [deleted] = await db
      .delete(journalEntries)
      .where(eq(journalEntries.id, id))
      .returning();

    if (!deleted) return badRequest("Journal entry not found");

    return success({ message: "Journal entry deleted" });
  } catch (error) {
    console.error("DELETE /api/journal-entries error:", error);
    return serverError();
  }
}
