import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { deliveryNotes } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(deliveryNotes.companyId, companyId));
    if (search) conditions.push(ilike(deliveryNotes.deliveryNoteNumber, `%${search}%`));
    if (status) conditions.push(eq(deliveryNotes.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "deliveryNoteNumber" ? deliveryNotes.deliveryNoteNumber : deliveryNotes.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.deliveryNotes.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(deliveryNotes).where(where),
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
    console.error("GET /api/delivery-notes error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, deliveryNoteNumber, customerId, salesOrderId,
      postingDate, currency, totalAmount,
    } = body;

    if (!tenantId || !companyId || !deliveryNoteNumber || !customerId || !postingDate) {
      return badRequest("tenantId, companyId, deliveryNoteNumber, customerId, and postingDate are required");
    }

    const [newDN] = await (db as any)
      .insert(deliveryNotes)
      .values({
        tenantId,
        companyId,
        deliveryNoteNumber,
        customerId,
        salesOrderId,
        postingDate,
        currency: currency || "USD",
        totalAmount: totalAmount || "0",
      })
      .returning();

    return success(newDN, 201);
  } catch (error) {
    console.error("POST /api/delivery-notes error:", error);
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
      .update(deliveryNotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(deliveryNotes.id, id))
      .returning();

    if (!updated) return badRequest("Delivery Note not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/delivery-notes error:", error);
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
      .delete(deliveryNotes)
      .where(eq(deliveryNotes.id, id))
      .returning();

    if (!deleted) return badRequest("Delivery Note not found");

    return success({ message: "Delivery Note deleted" });
  } catch (error) {
    console.error("DELETE /api/delivery-notes error:", error);
    return serverError();
  }
}
