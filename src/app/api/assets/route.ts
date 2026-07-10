import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { assets } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(assets.companyId, companyId));
    if (search) conditions.push(ilike(assets.assetName, `%${search}%`));
    if (status) conditions.push(eq(assets.assetStatus, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "assetName" ? assets.assetName : assets.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.assets.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(assets).where(where),
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
    console.error("GET /api/assets error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, assetName, assetCode, assetCategory, assetCategoryId,
      purchaseDate, purchaseAmount, depreciationMethod, depreciationRate,
      depreciationStartDate, numberOfMonths, costCenter, location, custodian, description,
    } = body;

    if (!tenantId || !companyId || !assetName) {
      return badRequest("tenantId, companyId, and assetName are required");
    }

    const currentValue = purchaseAmount || "0";
    const accumulatedDepreciation = "0";

    const [newAsset] = await (db as any)
      .insert(assets)
      .values({
        tenantId,
        companyId,
        assetName,
        assetCode,
        assetCategory,
        assetCategoryId,
        purchaseDate,
        purchaseAmount: purchaseAmount || "0",
        currentValue,
        depreciationMethod,
        depreciationRate,
        depreciationStartDate,
        numberOfMonths,
        totalDepreciableAmount: purchaseAmount || "0",
        accumulatedDepreciation,
        costCenter,
        location,
        custodian,
        description,
      })
      .returning();

    return success(newAsset, 201);
  } catch (error) {
    console.error("POST /api/assets error:", error);
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
      .update(assets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(assets.id, id))
      .returning();

    if (!updated) return badRequest("Asset not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/assets error:", error);
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
      .delete(assets)
      .where(eq(assets.id, id))
      .returning();

    if (!deleted) return badRequest("Asset not found");

    return success({ message: "Asset deleted" });
  } catch (error) {
    console.error("DELETE /api/assets error:", error);
    return serverError();
  }
}
