import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { budgets } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(budgets.companyId, companyId));
    if (search) conditions.push(ilike(budgets.budgetName, `%${search}%`));
    if (status) conditions.push(eq(budgets.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "budgetName" ? budgets.budgetName : budgets.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.budgets.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(budgets).where(where),
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
    console.error("GET /api/budgets error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, budgetName, budgetType, fiscalYearId,
      costCenterId, departmentId, accountId, currency, totalBudget,
      monthlyDistribution,
    } = body;

    if (!tenantId || !companyId || !budgetName || !fiscalYearId || !totalBudget) {
      return badRequest("tenantId, companyId, budgetName, fiscalYearId, and totalBudget are required");
    }

    const [newBudget] = await (db as any)
      .insert(budgets)
      .values({
        tenantId,
        companyId,
        budgetName,
        budgetType: budgetType || "cost_center",
        fiscalYearId,
        costCenterId,
        departmentId,
        accountId,
        currency: currency || "USD",
        totalBudget,
        monthlyDistribution: monthlyDistribution || {},
        createdBy: session.user!.id as string,
      })
      .returning();

    return success(newBudget, 201);
  } catch (error) {
    console.error("POST /api/budgets error:", error);
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
      .update(budgets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(budgets.id, id))
      .returning();

    if (!updated) return badRequest("Budget not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/budgets error:", error);
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
      .delete(budgets)
      .where(eq(budgets.id, id))
      .returning();

    if (!deleted) return badRequest("Budget not found");

    return success({ message: "Budget deleted" });
  } catch (error) {
    console.error("DELETE /api/budgets error:", error);
    return serverError();
  }
}
