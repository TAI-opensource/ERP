import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { posInvoices } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(posInvoices.companyId, companyId));
    if (search) conditions.push(ilike(posInvoices.invoiceNumber, `%${search}%`));
    if (status) conditions.push(eq(posInvoices.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "invoiceNumber" ? posInvoices.invoiceNumber : posInvoices.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.posInvoices.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(posInvoices).where(where),
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
    console.error("GET /api/pos/invoices error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, posProfileId, invoiceNumber, customerId,
      customerName, postingDate, currency, totalAmount, paymentMethod, remarks,
    } = body;

    if (!tenantId || !companyId || !invoiceNumber || !postingDate) {
      return badRequest("tenantId, companyId, invoiceNumber, and postingDate are required");
    }

    const [newInvoice] = await (db as any)
      .insert(posInvoices)
      .values({
        tenantId,
        companyId,
        posProfileId,
        invoiceNumber,
        customerId,
        customerName,
        postingDate,
        currency: currency || "USD",
        totalAmount: totalAmount || "0",
        paymentMethod,
        remarks,
      })
      .returning();

    return success(newInvoice, 201);
  } catch (error) {
    console.error("POST /api/pos/invoices error:", error);
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
      .update(posInvoices)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posInvoices.id, id))
      .returning();

    if (!updated) return badRequest("POS Invoice not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/pos/invoices error:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return badRequest("id is required");

    const [deleted] = await (db as any)
      .delete(posInvoices)
      .where(eq(posInvoices.id, id))
      .returning();

    if (!deleted) return badRequest("POS Invoice not found");

    return success({ message: "POS Invoice deleted" });
  } catch (error) {
    console.error("DELETE /api/pos/invoices error:", error);
    return serverError();
  }
}
