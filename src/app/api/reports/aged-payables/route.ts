import { NextRequest } from "next/server";
import { eq, and, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices, suppliers } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const companyId = request.nextUrl.searchParams.get("companyId");
    const asOfDate = request.nextUrl.searchParams.get("asOfDate") || new Date().toISOString().split("T")[0];

    if (!companyId) return badRequest("companyId is required");

    const outstandingInvoices = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        partyId: invoices.partyId,
        partyName: suppliers.supplierName,
        invoiceDate: invoices.invoiceDate,
        dueDate: invoices.dueDate,
        totalAmount: invoices.totalAmount,
        outstandingAmount: invoices.outstandingAmount,
        currency: invoices.currency,
      })
      .from(invoices)
      .leftJoin(suppliers, eq(invoices.partyId, suppliers.id))
      .where(
        and(
          eq(invoices.companyId, companyId),
          eq(invoices.invoiceType, "purchase"),
          sql`CAST(${invoices.outstandingAmount} AS DECIMAL(20,4)) > 0`
        )
      )
      .orderBy(desc(invoices.dueDate));

    const today = new Date(asOfDate);

    const agedData = outstandingInvoices.map((inv) => {
      const dueDate = new Date(inv.dueDate || inv.invoiceDate);
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      const outstanding = parseFloat(inv.outstandingAmount || "0");

      let current = 0;
      let days30 = 0;
      let days60 = 0;
      let days90 = 0;
      let over90 = 0;

      if (daysOverdue <= 0) {
        current = outstanding;
      } else if (daysOverdue <= 30) {
        days30 = outstanding;
      } else if (daysOverdue <= 60) {
        days60 = outstanding;
      } else if (daysOverdue <= 90) {
        days90 = outstanding;
      } else {
        over90 = outstanding;
      }

      return {
        ...inv,
        daysOverdue,
        current,
        days30,
        days60,
        days90,
        over90,
      };
    });

    const summary = {
      current: agedData.reduce((sum, d) => sum + d.current, 0),
      days30: agedData.reduce((sum, d) => sum + d.days30, 0),
      days60: agedData.reduce((sum, d) => sum + d.days60, 0),
      days90: agedData.reduce((sum, d) => sum + d.days90, 0),
      over90: agedData.reduce((sum, d) => sum + d.over90, 0),
      total: agedData.reduce((sum, d) => sum + parseFloat(d.outstandingAmount || "0"), 0),
    };

    return success({ asOfDate, data: agedData, summary });
  } catch (error) {
    console.error("GET /api/reports/aged-payables error:", error);
    return serverError();
  }
}
