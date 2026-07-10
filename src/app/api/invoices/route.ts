import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices, invoiceLines } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const invoiceType = request.nextUrl.searchParams.get("invoiceType") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(invoices.companyId, companyId));
    if (search) conditions.push(ilike(invoices.invoiceNumber, `%${search}%`));
    if (status) conditions.push(eq(invoices.status, status));
    if (invoiceType) conditions.push(eq(invoices.invoiceType, invoiceType));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "invoiceDate" ? invoices.invoiceDate : invoices.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.invoices.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(invoices).where(where),
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
    console.error("GET /api/invoices error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, invoiceType, invoiceNumber, partyType, partyId,
      invoiceDate, postingDate, dueDate, currency, lines, ...rest
    } = body;

    if (!tenantId || !companyId || !invoiceType || !invoiceNumber || !partyType || !partyId || !invoiceDate || !postingDate) {
      return badRequest("tenantId, companyId, invoiceType, invoiceNumber, partyType, partyId, invoiceDate, and postingDate are required");
    }

    const result = await db.transaction(async (tx) => {
      let subtotal = 0;
      let taxAmount = 0;
      let discountAmount = 0;

      if (lines && Array.isArray(lines)) {
        for (const line of lines) {
          const lineAmount = parseFloat(line.quantity || "0") * parseFloat(line.unitPrice || "0");
          subtotal += lineAmount;
          taxAmount += parseFloat(line.taxAmount || "0");
          discountAmount += parseFloat(line.discountAmount || "0");
        }
      }

      const totalAmount = subtotal + taxAmount - discountAmount;

      const [invoice] = await tx
        .insert(invoices)
        .values({
          tenantId,
          companyId,
          invoiceType,
          invoiceNumber,
          partyType,
          partyId,
          invoiceDate,
          postingDate,
          dueDate,
          currency: currency || "USD",
          subtotal: subtotal.toString(),
          taxAmount: taxAmount.toString(),
          discountAmount: discountAmount.toString(),
          totalAmount: totalAmount.toString(),
          outstandingAmount: totalAmount.toString(),
          ...rest,
          createdBy: session.user!.id as string,
        })
        .returning();

      if (lines && Array.isArray(lines)) {
        const lineValues = lines.map((line: Record<string, unknown>) => ({
          tenantId,
          invoiceId: invoice.id,
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
      }

      return invoice;
    });

    return success(result, 201);
  } catch (error) {
    console.error("POST /api/invoices error:", error);
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

    const [updated] = await (db as any)
      .update(invoices)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();

    if (!updated) return badRequest("Invoice not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/invoices error:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return badRequest("id is required");

    const result = await db.transaction(async (tx) => {
      await tx.delete(invoiceLines).where(eq(invoiceLines.invoiceId, id));
      const [deleted] = await (tx as any)
        .delete(invoices)
        .where(eq(invoices.id, id))
        .returning();
      return deleted;
    });

    if (!result) return badRequest("Invoice not found");

    return success({ message: "Invoice deleted" });
  } catch (error) {
    console.error("DELETE /api/invoices error:", error);
    return serverError();
  }
}
