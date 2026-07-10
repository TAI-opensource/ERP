import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { supplierScorecards } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const supplierId = request.nextUrl.searchParams.get("supplierId") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(supplierScorecards.companyId, companyId));
    if (search) conditions.push(ilike(supplierScorecards.scoringPeriod, `%${search}%`));
    if (status) conditions.push(eq(supplierScorecards.status, status));
    if (supplierId) conditions.push(eq(supplierScorecards.supplierId, supplierId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "scoringPeriod" ? supplierScorecards.scoringPeriod : supplierScorecards.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.supplierScorecards.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(supplierScorecards).where(where),
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
    console.error("GET /api/supplier-scorecards error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, companyId, supplierId, scoringPeriod, overallScore } = body;

    if (!tenantId || !companyId || !supplierId) {
      return badRequest("tenantId, companyId, and supplierId are required");
    }

    const [newScorecard] = await (db as any)
      .insert(supplierScorecards)
      .values({
        tenantId,
        companyId,
        supplierId,
        scoringPeriod,
        overallScore: overallScore || "0",
      })
      .returning();

    return success(newScorecard, 201);
  } catch (error) {
    console.error("POST /api/supplier-scorecards error:", error);
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
      .update(supplierScorecards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supplierScorecards.id, id))
      .returning();

    if (!updated) return badRequest("Supplier Scorecard not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/supplier-scorecards error:", error);
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
      .delete(supplierScorecards)
      .where(eq(supplierScorecards.id, id))
      .returning();

    if (!deleted) return badRequest("Supplier Scorecard not found");

    return success({ message: "Supplier Scorecard deleted" });
  } catch (error) {
    console.error("DELETE /api/supplier-scorecards error:", error);
    return serverError();
  }
}
