import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { chartOfAccounts } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const accountType = request.nextUrl.searchParams.get("accountType") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(chartOfAccounts.companyId, companyId));
    if (search) conditions.push(ilike(chartOfAccounts.accountName, `%${search}%`));
    if (accountType) conditions.push(eq(chartOfAccounts.accountType, accountType));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "accountCode" ? chartOfAccounts.accountCode : chartOfAccounts.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.chartOfAccounts.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(chartOfAccounts).where(where),
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
    console.error("GET /api/accounts error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, companyId, accountCode, accountName, accountType, rootType, parentId, currency, description } = body;

    if (!tenantId || !companyId || !accountCode || !accountName || !accountType || !rootType) {
      return badRequest("tenantId, companyId, accountCode, accountName, accountType, and rootType are required");
    }

    const [newAccount] = await (db as any)
      .insert(chartOfAccounts)
      .values({
        tenantId,
        companyId,
        accountCode,
        accountName,
        accountType,
        rootType,
        parentId,
        currency: currency || "USD",
        description,
      })
      .returning();

    return success(newAccount, 201);
  } catch (error) {
    console.error("POST /api/accounts error:", error);
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
      .update(chartOfAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(chartOfAccounts.id, id))
      .returning();

    if (!updated) return badRequest("Account not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/accounts error:", error);
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
      .delete(chartOfAccounts)
      .where(eq(chartOfAccounts.id, id))
      .returning();

    if (!deleted) return badRequest("Account not found");

    return success({ message: "Account deleted" });
  } catch (error) {
    console.error("DELETE /api/accounts error:", error);
    return serverError();
  }
}
