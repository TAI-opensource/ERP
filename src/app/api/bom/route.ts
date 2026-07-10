import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { bom, bomItems } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const bomType = request.nextUrl.searchParams.get("bomType") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(bom.companyId, companyId));
    if (search) conditions.push(ilike(bom.itemName, `%${search}%`));
    if (bomType) conditions.push(eq(bom.bomType, bomType));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "itemName" ? bom.itemName : bom.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.bom.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(bom).where(where),
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
    console.error("GET /api/bom error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, itemCode, itemName, itemId, quantity,
      uom, bomType, isDefault, description, totalCost, items,
    } = body;

    if (!tenantId || !companyId || !itemCode || !itemId) {
      return badRequest("tenantId, companyId, itemCode, and itemId are required");
    }

    const result = await db.transaction(async (tx) => {
      const calculatedTotalCost = items && Array.isArray(items)
        ? items.reduce((sum: number, item: Record<string, unknown>) => {
            const rate = parseFloat((item.rate as string) || "0");
            const qty = parseFloat((item.quantity as string) || "0");
            return sum + rate * qty;
          }, 0)
        : parseFloat(totalCost || "0");

      const [newBom] = await tx
        .insert(bom)
        .values({
          tenantId,
          companyId,
          itemCode,
          itemName,
          itemId,
          quantity: (quantity || "1").toString(),
          uom: uom || "Nos",
          bomType: bomType || "manufacture",
          isDefault: isDefault || false,
          description,
          totalCost: calculatedTotalCost.toString(),
          createdBy: session.user!.id as string,
        })
        .returning();

      if (items && Array.isArray(items) && items.length > 0) {
        const itemValues = items.map((item: Record<string, unknown>) => ({
          tenantId,
          bomId: newBom.id,
          itemId: item.itemId as string,
          itemName: item.itemName as string,
          quantity: String(item.quantity || "0"),
          uom: (item.uom as string) || "Nos",
          rate: String(item.rate || "0"),
          amount: String(item.amount || "0"),
          warehouseId: item.warehouseId as string | undefined,
          costCenter: item.costCenter as string | undefined,
          description: item.description as string | undefined,
        }));

        await tx.insert(bomItems).values(itemValues);
      }

      return newBom;
    });

    return success(result, 201);
  } catch (error) {
    console.error("POST /api/bom error:", error);
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

    const [updated] = await db
      .update(bom)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bom.id, id))
      .returning();

    if (!updated) return badRequest("BOM not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/bom error:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return badRequest("id is required");

    const [deleted] = await db
      .delete(bom)
      .where(eq(bom.id, id))
      .returning();

    if (!deleted) return badRequest("BOM not found");

    return success({ message: "BOM deleted" });
  } catch (error) {
    console.error("DELETE /api/bom error:", error);
    return serverError();
  }
}
