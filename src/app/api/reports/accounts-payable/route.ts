import { NextRequest } from "next/server";
import { eq, and, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices, suppliers } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset } = parseSearchParams(request.nextUrl.searchParams);
    const companyId = request.nextUrl.searchParams.get("companyId");
    const supplierId = request.nextUrl.searchParams.get("supplierId");

    if (!companyId) return badRequest("companyId is required");

    const conditions = [
      eq(invoices.companyId, companyId),
      eq(invoices.invoiceType, "purchase"),
      sql`CAST(${invoices.outstandingAmount} AS DECIMAL(20,4)) > 0`,
    ];
    if (supplierId) conditions.push(eq(invoices.partyId, supplierId));

    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      db
        .select({
          id: invoices.id,
          invoiceNumber: invoices.invoiceNumber,
          partyId: invoices.partyId,
          partyName: suppliers.supplierName,
          invoiceDate: invoices.invoiceDate,
          dueDate: invoices.dueDate,
          totalAmount: invoices.totalAmount,
          paidAmount: invoices.paidAmount,
          outstandingAmount: invoices.outstandingAmount,
          currency: invoices.currency,
          status: invoices.status,
        })
        .from(invoices)
        .leftJoin(suppliers, eq(invoices.partyId, suppliers.id))
        .where(where)
        .orderBy(desc(invoices.dueDate))
        .limit(limit)
        .offset(offset),
      db.select({ value: sql<number>`count(*)::int` }).from(invoices).where(where),
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
    console.error("GET /api/reports/accounts-payable error:", error);
    return serverError();
  }
}
