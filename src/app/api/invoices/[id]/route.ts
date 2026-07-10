import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices, invoiceLines } from "@/lib/db/schema";
import { getAuthSession, unauthorized, notFound, success, serverError } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const invoice = await db.query.invoices.findFirst({
      where: eq(invoices.id, id),
      with: { lines: true },
    });

    if (!invoice) return notFound("Invoice not found");

    return success(invoice);
  } catch (error) {
    console.error("GET /api/invoices/[id] error:", error);
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
      if (lines && Array.isArray(lines)) {
        let subtotal = 0;
        let taxAmount = 0;
        let discountAmount = 0;

        for (const line of lines) {
          const lineAmount = parseFloat(line.quantity || "0") * parseFloat(line.unitPrice || "0");
          subtotal += lineAmount;
          taxAmount += parseFloat(line.taxAmount || "0");
          discountAmount += parseFloat(line.discountAmount || "0");
        }

        const totalAmount = subtotal + taxAmount - discountAmount;

        await tx.delete(invoiceLines).where(eq(invoiceLines.invoiceId, id));

        if (lines.length > 0) {
          const lineValues = lines.map((line: Record<string, unknown>) => ({
            tenantId: (updates as any).tenantId,
            invoiceId: id,
            itemId: line.itemId as string | undefined,
            description: line.description as string | undefined,
            quantity: String(line.quantity || "0"),
            unitPrice: String(line.unitPrice || "0"),
            discountPercentage: String(line.discountPercentage || "0"),
            discountAmount: String(line.discountAmount || "0"),
            taxRate: String(line.taxRate || "0"),
            taxAmount: String(line.taxAmount || "0"),
            netAmount: String(line.netAmount || "0"),
            amount: String(line.amount || "0"),
            accountId: line.accountId as string | undefined,
            costCenterId: line.costCenterId as string | undefined,
          }));
          await tx.insert(invoiceLines).values(lineValues);

          updates.subtotal = subtotal.toString();
          updates.taxAmount = taxAmount.toString();
          updates.discountAmount = discountAmount.toString();
          updates.totalAmount = totalAmount.toString();
          updates.outstandingAmount = totalAmount.toString();
        }
      }

      const [updated] = await (tx as any)
        .update(invoices)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(invoices.id, id))
        .returning();

      return updated;
    });

    if (!result) return notFound("Invoice not found");

    return success(result);
  } catch (error) {
    console.error("PUT /api/invoices/[id] error:", error);
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
      await tx.delete(invoiceLines).where(eq(invoiceLines.invoiceId, id));
      const [deleted] = await (tx as any)
        .delete(invoices)
        .where(eq(invoices.id, id))
        .returning();
      return deleted;
    });

    if (!result) return notFound("Invoice not found");

    return success({ message: "Invoice deleted" });
  } catch (error) {
    console.error("DELETE /api/invoices/[id] error:", error);
    return serverError();
  }
}
