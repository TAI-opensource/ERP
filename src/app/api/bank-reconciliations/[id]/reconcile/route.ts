import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { bankReconciliations, journalEntries } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, notFound, success, serverError } from "@/lib/api-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const reconciliation = await db.query.bankReconciliations.findFirst({
      where: eq(bankReconciliations.id, id),
    });

    if (!reconciliation) return notFound("Reconciliation not found");
    if (reconciliation.status === "completed") return badRequest("Reconciliation already completed");

    const body = await request.json();
    const { matchedEntryIds, closingBalance } = body;

    const result = await db.transaction(async (tx) => {
      if (matchedEntryIds && Array.isArray(matchedEntryIds)) {
        for (const entryId of matchedEntryIds) {
          await (tx as any)
            .update(journalEntries)
            .set({ status: "reconciled", updatedAt: new Date() })
            .where(eq(journalEntries.id, entryId));
        }
      }

      const difference = parseFloat(closingBalance || reconciliation.closingBalance || "0") -
        parseFloat(reconciliation.openingBalance || "0");

      const [updated] = await (tx as any)
        .update(bankReconciliations)
        .set({
          closingBalance: closingBalance || reconciliation.closingBalance,
          difference: difference.toString(),
          isComplete: true,
          status: "completed",
          updatedAt: new Date(),
        })
        .where(eq(bankReconciliations.id, id))
        .returning();

      return updated;
    });

    return success(result);
  } catch (error) {
    console.error("POST /api/bank-reconciliations/[id]/reconcile error:", error);
    return serverError();
  }
}
