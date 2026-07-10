import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const customerGroup = request.nextUrl.searchParams.get("customerGroup") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(customers.companyId, companyId));
    if (search) conditions.push(ilike(customers.customerName, `%${search}%`));
    if (customerGroup) conditions.push(eq(customers.customerGroup, customerGroup));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "customerName" ? customers.customerName : customers.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.customers.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(customers).where(where),
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
    console.error("GET /api/customers error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, customerName, customerType, taxId,
      email, phone, mobileNo, website, addressLine1, addressLine2,
      city, state, postalCode, country, currency, defaultPaymentTerms,
      creditLimit, customerGroup, territory, salesPerson, notes,
    } = body;

    if (!tenantId || !companyId || !customerName) {
      return badRequest("tenantId, companyId, and customerName are required");
    }

    const [newCustomer] = await db
      .insert(customers)
      .values({
        tenantId,
        companyId,
        customerName,
        customerType: customerType || "individual",
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
        creditLimit,
        customerGroup,
        territory,
        salesPerson,
        notes,
      })
      .returning();

    return success(newCustomer, 201);
  } catch (error) {
    console.error("POST /api/customers error:", error);
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
      .update(customers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();

    if (!updated) return badRequest("Customer not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/customers error:", error);
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
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();

    if (!deleted) return badRequest("Customer not found");

    return success({ message: "Customer deleted" });
  } catch (error) {
    console.error("DELETE /api/customers error:", error);
    return serverError();
  }
}
