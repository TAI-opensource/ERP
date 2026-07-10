import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { warehouses } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(warehouses.companyId, companyId));
    if (search) conditions.push(ilike(warehouses.warehouseName, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "warehouseName" ? warehouses.warehouseName : warehouses.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.warehouses.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(warehouses).where(where),
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
    console.error("GET /api/warehouses error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, warehouseName, warehouseCode,
      addressLine1, addressLine2, city, state, postalCode,
      country, phone, email, isDefault,
    } = body;

    if (!tenantId || !companyId || !warehouseName || !warehouseCode) {
      return badRequest("tenantId, companyId, warehouseName, and warehouseCode are required");
    }

    const [newWarehouse] = await (db as any)
      .insert(warehouses)
      .values({
        tenantId,
        companyId,
        warehouseName,
        warehouseCode,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phone,
        email,
        isDefault: isDefault || false,
      })
      .returning();

    return success(newWarehouse, 201);
  } catch (error) {
    console.error("POST /api/warehouses error:", error);
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
      .update(warehouses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(warehouses.id, id))
      .returning();

    if (!updated) return badRequest("Warehouse not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/warehouses error:", error);
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
      .delete(warehouses)
      .where(eq(warehouses.id, id))
      .returning();

    if (!deleted) return badRequest("Warehouse not found");

    return success({ message: "Warehouse deleted" });
  } catch (error) {
    console.error("DELETE /api/warehouses error:", error);
    return serverError();
  }
}
