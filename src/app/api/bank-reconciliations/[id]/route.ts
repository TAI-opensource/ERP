import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bankReconciliations } from "@/lib/db/schema";
import { getAuthSession, unauthorized, notFound, success, serverError } from "@/lib/api-utils";

export async function GET(
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

    return success(reconciliation);
  } catch (error) {
    console.error("GET /api/bank-reconciliations/[id] error:", error);
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
    const { ...updates } = body;

    const [updated] = await (db as any)
      .update(bankReconciliations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bankReconciliations.id, id))
      .returning();

    if (!updated) return notFound("Reconciliation not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/bank-reconciliations/[id] error:", error);
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

    const [deleted] = await (db as any)
      .delete(bankReconciliations)
      .where(eq(bankReconciliations.id, id))
      .returning();

    if (!deleted) return notFound("Reconciliation not found");

    return success({ message: "Reconciliation deleted" });
  } catch (error) {
    console.error("DELETE /api/bank-reconciliations/[id] error:", error);
    return serverError();
  }
}
