import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { materialRequests } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const requestType = request.nextUrl.searchParams.get("requestType") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(materialRequests.companyId, companyId));
    if (search) conditions.push(ilike(materialRequests.warehouse, `%${search}%`));
    if (status) conditions.push(eq(materialRequests.status, status));
    if (requestType) conditions.push(eq(materialRequests.requestType, requestType));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "scheduleDate" ? materialRequests.scheduleDate : materialRequests.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.materialRequests.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(materialRequests).where(where),
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
    console.error("GET /api/material-requests error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, companyId, requestType, scheduleDate, warehouse } = body;

    if (!tenantId || !companyId || !requestType) {
      return badRequest("tenantId, companyId, and requestType are required");
    }

    const [newRequest] = await (db as any)
      .insert(materialRequests)
      .values({
        tenantId,
        companyId,
        requestType,
        scheduleDate,
        warehouse,
      })
      .returning();

    return success(newRequest, 201);
  } catch (error) {
    console.error("POST /api/material-requests error:", error);
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
      .update(materialRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(materialRequests.id, id))
      .returning();

    if (!updated) return badRequest("Material Request not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/material-requests error:", error);
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
      .delete(materialRequests)
      .where(eq(materialRequests.id, id))
      .returning();

    if (!deleted) return badRequest("Material Request not found");

    return success({ message: "Material Request deleted" });
  } catch (error) {
    console.error("DELETE /api/material-requests error:", error);
    return serverError();
  }
}
