import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const leadSource = request.nextUrl.searchParams.get("leadSource") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(leads.companyId, companyId));
    if (search) conditions.push(ilike(leads.leadName, `%${search}%`));
    if (status) conditions.push(eq(leads.status, status));
    if (leadSource) conditions.push(eq(leads.leadSource, leadSource));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "leadName" ? leads.leadName : leads.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.leads.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(leads).where(where),
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
    console.error("GET /api/leads error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, leadName, leadSource, leadOwner, leadOwnerId,
      status, priority, contactName, email, phone, mobileNo, company,
      designation, addressLine1, addressLine2, city, state, postalCode,
      country, website, industry, annualRevenue, noOfEmployees,
      territory, notes,
    } = body;

    if (!tenantId || !companyId || !leadName) {
      return badRequest("tenantId, companyId, and leadName are required");
    }

    const [newLead] = await (db as any)
      .insert(leads)
      .values({
        tenantId,
        companyId,
        leadName,
        leadSource,
        leadOwner,
        leadOwnerId,
        status: status || "new",
        priority: priority || "medium",
        contactName,
        email,
        phone,
        mobileNo,
        company,
        designation,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        website,
        industry,
        annualRevenue,
        noOfEmployees,
        territory,
        notes,
      })
      .returning();

    return success(newLead, 201);
  } catch (error) {
    console.error("POST /api/leads error:", error);
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
      .update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();

    if (!updated) return badRequest("Lead not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/leads error:", error);
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
      .delete(leads)
      .where(eq(leads.id, id))
      .returning();

    if (!deleted) return badRequest("Lead not found");

    return success({ message: "Lead deleted" });
  } catch (error) {
    console.error("DELETE /api/leads error:", error);
    return serverError();
  }
}
