import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { suppliers } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const supplierGroup = request.nextUrl.searchParams.get("supplierGroup") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(suppliers.companyId, companyId));
    if (search) conditions.push(ilike(suppliers.supplierName, `%${search}%`));
    if (supplierGroup) conditions.push(eq(suppliers.supplierGroup, supplierGroup));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "supplierName" ? suppliers.supplierName : suppliers.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.suppliers.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(suppliers).where(where),
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
    console.error("GET /api/suppliers error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, supplierName, supplierType, taxId,
      email, phone, mobileNo, website, addressLine1, addressLine2,
      city, state, postalCode, country, currency, defaultPaymentTerms,
      supplierGroup, territory, notes,
    } = body;

    if (!tenantId || !companyId || !supplierName) {
      return badRequest("tenantId, companyId, and supplierName are required");
    }

    const [newSupplier] = await (db as any)
      .insert(suppliers)
      .values({
        tenantId,
        companyId,
        supplierName,
        supplierType: supplierType || "company",
        taxId,
        email,
        phone,
        mobileNo,
        website,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        currency: currency || "USD",
        defaultPaymentTerms,
        supplierGroup,
        territory,
        notes,
      })
      .returning();

    return success(newSupplier, 201);
  } catch (error) {
    console.error("POST /api/suppliers error:", error);
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
      .update(suppliers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(suppliers.id, id))
      .returning();

    if (!updated) return badRequest("Supplier not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/suppliers error:", error);
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
      .delete(suppliers)
      .where(eq(suppliers.id, id))
      .returning();

    if (!deleted) return badRequest("Supplier not found");

    return success({ message: "Supplier deleted" });
  } catch (error) {
    console.error("DELETE /api/suppliers error:", error);
    return serverError();
  }
}
