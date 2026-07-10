import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentEntries } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, notFound, success, serverError } from "@/lib/api-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const entry = await db.query.paymentEntries.findFirst({
      where: eq(paymentEntries.id, id),
    });

    if (!entry) return notFound("Payment entry not found");
    if (entry.status !== "submitted") return badRequest("Only submitted payments can be cleared");

    const body = await request.json().catch(() => ({}));
    const { bankAccount, clearingDate } = body;

    const [updated] = await (db as any)
      .update(paymentEntries)
      .set({
        status: "cleared",
        bankAccount: bankAccount || entry.bankAccount,
        updatedAt: new Date(),
      })
      .where(eq(paymentEntries.id, id))
      .returning();

    return success(updated);
  } catch (error) {
    console.error("POST /api/payment-entries/[id]/clear error:", error);
    return serverError();
  }
}
