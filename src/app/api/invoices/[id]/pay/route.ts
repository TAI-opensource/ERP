import { NextRequest } from "next/server";
import { eq, sql } from "drizzle-orm";
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
    if (invoice.status === "cancelled") return badRequest("Cannot pay a cancelled invoice");

    const body = await request.json();
    const { amount, paymentDate, paymentMethod, referenceNumber } = body;

    if (!amount || amount <= 0) return badRequest("A valid payment amount is required");

    const currentPaid = parseFloat(invoice.paidAmount || "0");
    const totalAmount = parseFloat(invoice.totalAmount || "0");
    const newPaid = currentPaid + parseFloat(amount);

    if (newPaid > totalAmount) return badRequest("Payment amount exceeds outstanding balance");

    const outstandingAmount = totalAmount - newPaid;
    const newStatus = outstandingAmount <= 0 ? "paid" : "partially_paid";

    const [updated] = await (db as any)
      .update(invoices)
      .set({
        paidAmount: newPaid.toString(),
        outstandingAmount: outstandingAmount.toString(),
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, id))
      .returning();

    return success({
      invoice: updated,
      payment: {
        amount: parseFloat(amount),
        paymentDate,
        paymentMethod,
        referenceNumber,
        previousPaid: currentPaid,
        newPaid,
        outstandingAmount,
      },
    });
  } catch (error) {
    console.error("POST /api/invoices/[id]/pay error:", error);
    return serverError();
  }
}
