import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentEntries } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const paymentType = request.nextUrl.searchParams.get("paymentType") || "";
    const partyType = request.nextUrl.searchParams.get("partyType") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(paymentEntries.companyId, companyId));
    if (search) conditions.push(ilike(paymentEntries.referenceNumber, `%${search}%`));
    if (status) conditions.push(eq(paymentEntries.status, status));
    if (paymentType) conditions.push(eq(paymentEntries.paymentType, paymentType));
    if (partyType) conditions.push(eq(paymentEntries.partyType, partyType));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "paymentDate" ? paymentEntries.paymentDate : paymentEntries.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.paymentEntries.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(paymentEntries).where(where),
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
    console.error("GET /api/payment-entries error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, partyType, partyId, paymentType, paymentDate,
      postingDate, modeOfPayment, amount, currency, referenceNumber, remarks,
    } = body;

    if (!tenantId || !companyId || !partyType || !partyId || !paymentType || !paymentDate || !postingDate || !amount) {
      return badRequest("tenantId, companyId, partyType, partyId, paymentType, paymentDate, postingDate, and amount are required");
    }

    const [newEntry] = await (db as any)
      .insert(paymentEntries)
      .values({
        tenantId,
        companyId,
        partyType,
        partyId,
        paymentType,
        paymentDate,
        postingDate,
        modeOfPayment,
        amount,
        currency: currency || "USD",
        referenceNumber,
        remarks,
        createdBy: session.user!.id as string,
      })
      .returning();

    return success(newEntry, 201);
  } catch (error) {
    console.error("POST /api/payment-entries error:", error);
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
      .update(paymentEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(paymentEntries.id, id))
      .returning();

    if (!updated) return badRequest("Payment entry not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/payment-entries error:", error);
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
      .delete(paymentEntries)
      .where(eq(paymentEntries.id, id))
      .returning();

    if (!deleted) return badRequest("Payment entry not found");

    return success({ message: "Payment entry deleted" });
  } catch (error) {
    console.error("DELETE /api/payment-entries error:", error);
    return serverError();
  }
}
