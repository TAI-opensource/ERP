import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { itemTaxTemplates } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(itemTaxTemplates.companyId, companyId));
    if (search) conditions.push(ilike(itemTaxTemplates.templateName, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "templateName" ? itemTaxTemplates.templateName : itemTaxTemplates.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.itemTaxTemplates.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(itemTaxTemplates).where(where),
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
    console.error("GET /api/tax-templates error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, companyId, templateName, taxType, taxRate, accountId, isInclusive, description } = body;

    if (!tenantId || !companyId || !templateName || !taxType || !taxRate) {
      return badRequest("tenantId, companyId, templateName, taxType, and taxRate are required");
    }

    const [newTemplate] = await (db as any)
      .insert(itemTaxTemplates)
      .values({
        tenantId,
        companyId,
        templateName,
        taxType,
        taxRate,
        accountId,
        isInclusive: isInclusive || false,
        description,
      })
      .returning();

    return success(newTemplate, 201);
  } catch (error) {
    console.error("POST /api/tax-templates error:", error);
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
      .update(itemTaxTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(itemTaxTemplates.id, id))
      .returning();

    if (!updated) return badRequest("Tax template not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/tax-templates error:", error);
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
      .delete(itemTaxTemplates)
      .where(eq(itemTaxTemplates.id, id))
      .returning();

    if (!deleted) return badRequest("Tax template not found");

    return success({ message: "Tax template deleted" });
  } catch (error) {
    console.error("DELETE /api/tax-templates error:", error);
    return serverError();
  }
}
