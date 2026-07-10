import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, sql, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(companies.id, companyId));
    if (search) conditions.push(ilike(companies.name, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "name" ? companies.name : companies.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.companies.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(companies).where(where),
    ]);

    const total = totalResult[0]?.value || 0;

    return success({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/companies error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, name, legalName, taxId, email, phone, website, country, baseCurrency, timezone } = body;

    if (!tenantId || !name) {
      return badRequest("tenantId and name are required");
    }

    const [newCompany] = await db
      .insert(companies)
      .values({
        tenantId,
        name,
        legalName,
        taxId,
        email,
        phone,
        website,
        country,
        baseCurrency: baseCurrency || "USD",
        timezone: timezone || "UTC",
      })
      .returning();

    return success(newCompany, 201);
  } catch (error) {
    console.error("POST /api/companies error:", error);
    return serverError();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return badRequest("id is required");
    }

    const [updated] = await db
      .update(companies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();

    if (!updated) {
      return badRequest("Company not found");
    }

    return success(updated);
  } catch (error) {
    console.error("PUT /api/companies error:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return badRequest("id is required");
    }

    const [deleted] = await db
      .delete(companies)
      .where(eq(companies.id, id))
      .returning();

    if (!deleted) {
      return badRequest("Company not found");
    }

    return success({ message: "Company deleted" });
  } catch (error) {
    console.error("DELETE /api/companies error:", error);
    return serverError();
  }
}
