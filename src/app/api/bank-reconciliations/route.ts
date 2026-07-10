import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { bankReconciliations } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(bankReconciliations.companyId, companyId));
    if (status) conditions.push(eq(bankReconciliations.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "reconciliationDate" ? bankReconciliations.reconciliationDate : bankReconciliations.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.bankReconciliations.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(bankReconciliations).where(where),
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
    console.error("GET /api/bank-reconciliations error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, bankAccountId, reconciliationDate,
      bankStatementDate, openingBalance, closingBalance, remarks,
    } = body;

    if (!tenantId || !companyId || !bankAccountId || !reconciliationDate) {
      return badRequest("tenantId, companyId, bankAccountId, and reconciliationDate are required");
    }

    const [newReconciliation] = await (db as any)
      .insert(bankReconciliations)
      .values({
        tenantId,
        companyId,
        bankAccountId,
        reconciliationDate,
        bankStatementDate,
        openingBalance: openingBalance || "0",
        closingBalance: closingBalance || "0",
        difference: (parseFloat(closingBalance || "0") - parseFloat(openingBalance || "0")).toString(),
        remarks,
        createdBy: session.user!.id as string,
      })
      .returning();

    return success(newReconciliation, 201);
  } catch (error) {
    console.error("POST /api/bank-reconciliations error:", error);
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
      .update(bankReconciliations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bankReconciliations.id, id))
      .returning();

    if (!updated) return badRequest("Reconciliation not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/bank-reconciliations error:", error);
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
      .delete(bankReconciliations)
      .where(eq(bankReconciliations.id, id))
      .returning();

    if (!deleted) return badRequest("Reconciliation not found");

    return success({ message: "Reconciliation deleted" });
  } catch (error) {
    console.error("DELETE /api/bank-reconciliations error:", error);
    return serverError();
  }
}
