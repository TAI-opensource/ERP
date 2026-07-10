import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, notFound, success, serverError } from "@/lib/api-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const invoice = await db.query.invoices.findFirst({
      where: eq(invoices.id, id),
    });

    if (!invoice) return notFound("Invoice not found");
    if (invoice.status === "cancelled") return badRequest("Invoice is already cancelled");
    if (invoice.status === "paid") return badRequest("Paid invoices cannot be cancelled");

    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    const [updated] = await (db as any)
      .update(invoices)
      .set({
        status: "cancelled",
        cancelledBy: session.user!.id as string,
        cancelledAt: new Date(),
        updatedAt: new Date(),
        remarks: reason ? `${invoice.remarks || ""}\nCancellation reason: ${reason}` : invoice.remarks,
      })
      .where(eq(invoices.id, id))
      .returning();

    return success(updated);
  } catch (error) {
    console.error("POST /api/invoices/[id]/cancel error:", error);
    return serverError();
  }
}
