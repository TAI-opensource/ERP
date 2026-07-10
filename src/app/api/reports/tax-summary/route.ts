import { NextRequest } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const companyId = request.nextUrl.searchParams.get("companyId");
    const fromDate = request.nextUrl.searchParams.get("fromDate");
    const toDate = request.nextUrl.searchParams.get("toDate");

    if (!companyId) return badRequest("companyId is required");
    if (!fromDate || !toDate) return badRequest("fromDate and toDate are required");

    const taxData = await db
      .select({
        invoiceType: invoices.invoiceType,
        taxAmount: sql<string>`COALESCE(SUM(CAST(${invoices.taxAmount} AS DECIMAL(20,4))), 0)`.as("totalTax"),
        totalAmount: sql<string>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL(20,4))), 0)`.as("totalAmount"),
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(invoices)
      .where(
        and(
          eq(invoices.companyId, companyId),
          eq(invoices.status, "submitted"),
          sql`${invoices.invoiceDate} >= ${fromDate}`,
          sql`${invoices.invoiceDate} <= ${toDate}`
        )
      )
      .groupBy(invoices.invoiceType);

    let totalTaxCollected = 0;
    let totalTaxPaid = 0;

    const summary = taxData.map((row) => {
      const taxAmount = parseFloat(row.taxAmount);
      if (row.invoiceType === "sales") {
        totalTaxCollected += taxAmount;
      } else {
        totalTaxPaid += taxAmount;
      }
      return {
        type: row.invoiceType,
        totalTax: taxAmount,
        totalAmount: parseFloat(row.totalAmount),
        invoiceCount: row.count,
      };
    });

    return success({
      period: { fromDate, toDate },
      summary,
      totals: {
        totalTaxCollected,
        totalTaxPaid,
        netTaxPosition: totalTaxCollected - totalTaxPaid,
      },
    });
  } catch (error) {
    console.error("GET /api/reports/tax-summary error:", error);
    return serverError();
  }
}
