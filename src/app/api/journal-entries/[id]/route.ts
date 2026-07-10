import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalEntries, journalEntryLines } from "@/lib/db/schema";
import { getAuthSession, unauthorized, notFound, success, serverError } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const entry = await db.query.journalEntries.findFirst({
      where: eq(journalEntries.id, id),
      with: { lines: true },
    });

    if (!entry) return notFound("Journal entry not found");

    return success(entry);
  } catch (error) {
    console.error("GET /api/journal-entries/[id] error:", error);
    return serverError();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { lines, ...updates } = body;

    const result = await db.transaction(async (tx) => {
      let totalDebit = 0;
      let totalCredit = 0;

      if (lines && Array.isArray(lines)) {
        for (const line of lines) {
          totalDebit += parseFloat(line.debit || "0");
          totalCredit += parseFloat(line.credit || "0");
        }

        await tx.delete(journalEntryLines).where(eq(journalEntryLines.journalEntryId, id));

        if (lines.length > 0) {
          const lineValues = lines.map((line: Record<string, unknown>) => ({
            tenantId: (updates as any).tenantId,
            journalEntryId: id,
            accountId: line.accountId as string,
            debit: String(line.debit || "0"),
            credit: String(line.credit || "0"),
            description: line.description as string | undefined,
            costCenterId: line.costCenterId as string | undefined,
          }));
          await tx.insert(journalEntryLines).values(lineValues);
        }
      }

      const [updated] = await (tx as any)
        .update(journalEntries)
        .set({
          ...updates,
          totalDebit: totalDebit.toString(),
          totalCredit: totalCredit.toString(),
          totalAmount: Math.max(totalDebit, totalCredit).toString(),
          updatedAt: new Date(),
        })
        .where(eq(journalEntries.id, id))
        .returning();

      return updated;
    });

    if (!result) return notFound("Journal entry not found");

    return success(result);
  } catch (error) {
    console.error("PUT /api/journal-entries/[id] error:", error);
    return serverError();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const result = await db.transaction(async (tx) => {
      await tx.delete(journalEntryLines).where(eq(journalEntryLines.journalEntryId, id));
      const [deleted] = await (tx as any)
        .delete(journalEntries)
        .where(eq(journalEntries.id, id))
        .returning();
      return deleted;
    });

    if (!result) return notFound("Journal entry not found");

    return success({ message: "Journal entry deleted" });
  } catch (error) {
    console.error("DELETE /api/journal-entries/[id] error:", error);
    return serverError();
  }
}
