import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(subscriptions.companyId, companyId));
    if (search) conditions.push(eq(subscriptions.customerId, search));
    if (status) conditions.push(eq(subscriptions.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "startDate" ? subscriptions.startDate : subscriptions.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.subscriptions.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(subscriptions).where(where),
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
    console.error("GET /api/subscriptions error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, companyId, customerId, planId, startDate, endDate, nextBillingDate } = body;

    if (!tenantId || !companyId || !customerId || !startDate) {
      return badRequest("tenantId, companyId, customerId, and startDate are required");
    }

    const [newSubscription] = await (db as any)
      .insert(subscriptions)
      .values({
        tenantId,
        companyId,
        customerId,
        planId,
        startDate,
        endDate,
        nextBillingDate,
      })
      .returning();

    return success(newSubscription, 201);
  } catch (error) {
    console.error("POST /api/subscriptions error:", error);
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
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();

    if (!updated) return badRequest("Subscription not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/subscriptions error:", error);
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
      .delete(subscriptions)
      .where(eq(subscriptions.id, id))
      .returning();

    if (!deleted) return badRequest("Subscription not found");

    return success({ message: "Subscription deleted" });
  } catch (error) {
    console.error("DELETE /api/subscriptions error:", error);
    return serverError();
  }
}
