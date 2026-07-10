import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { taxWithholdingCategories } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(taxWithholdingCategories.companyId, companyId));
    if (search) conditions.push(ilike(taxWithholdingCategories.categoryName, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "categoryName" ? taxWithholdingCategories.categoryName : taxWithholdingCategories.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.taxWithholdingCategories.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(taxWithholdingCategories).where(where),
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
    console.error("GET /api/tax-withholding error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, companyId, categoryName, taxRate, minAmount, maxAmount, accountId, description } = body;

    if (!tenantId || !companyId || !categoryName || !taxRate) {
      return badRequest("tenantId, companyId, categoryName, and taxRate are required");
    }

    const [newCategory] = await (db as any)
      .insert(taxWithholdingCategories)
      .values({
        tenantId,
        companyId,
        categoryName,
        taxRate,
        minAmount,
        maxAmount,
        accountId,
        description,
      })
      .returning();

    return success(newCategory, 201);
  } catch (error) {
    console.error("POST /api/tax-withholding error:", error);
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
      .update(taxWithholdingCategories)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(taxWithholdingCategories.id, id))
      .returning();

    if (!updated) return badRequest("Tax withholding category not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/tax-withholding error:", error);
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
      .delete(taxWithholdingCategories)
      .where(eq(taxWithholdingCategories.id, id))
      .returning();

    if (!deleted) return badRequest("Tax withholding category not found");

    return success({ message: "Tax withholding category deleted" });
  } catch (error) {
    console.error("DELETE /api/tax-withholding error:", error);
    return serverError();
  }
}
