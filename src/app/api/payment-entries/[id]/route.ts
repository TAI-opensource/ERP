import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentEntries } from "@/lib/db/schema";
import { getAuthSession, unauthorized, notFound, success, serverError } from "@/lib/api-utils";

export async function GET(
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

    return success(entry);
  } catch (error) {
    console.error("GET /api/payment-entries/[id] error:", error);
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
      .update(paymentEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(paymentEntries.id, id))
      .returning();

    if (!updated) return notFound("Payment entry not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/payment-entries/[id] error:", error);
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
      .delete(paymentEntries)
      .where(eq(paymentEntries.id, id))
      .returning();

    if (!deleted) return notFound("Payment entry not found");

    return success({ message: "Payment entry deleted" });
  } catch (error) {
    console.error("DELETE /api/payment-entries/[id] error:", error);
    return serverError();
  }
}
