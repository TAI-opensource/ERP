import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { purchaseOrders, purchaseOrderLines } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(purchaseOrders.companyId, companyId));
    if (search) conditions.push(ilike(purchaseOrders.purchaseOrderNumber, `%${search}%`));
    if (status) conditions.push(eq(purchaseOrders.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "orderDate" ? purchaseOrders.orderDate : purchaseOrders.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.purchaseOrders.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(purchaseOrders).where(where),
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
    console.error("GET /api/purchase-orders error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, purchaseOrderNumber, supplierId, orderDate,
      deliveryDate, currency, terms, remarks, lines,
    } = body;

    if (!tenantId || !companyId || !purchaseOrderNumber || !supplierId || !orderDate) {
      return badRequest("tenantId, companyId, purchaseOrderNumber, supplierId, and orderDate are required");
    }

    const result = await db.transaction(async (tx) => {
      let subtotal = 0;
      let taxAmount = 0;
      let discountAmount = 0;

      if (lines && Array.isArray(lines)) {
        for (const line of lines) {
          const netAmount = parseFloat(line.netAmount || line.quantity * line.unitPrice || "0");
          subtotal += netAmount;
          taxAmount += parseFloat(line.taxAmount || "0");
          discountAmount += parseFloat(line.discountAmount || "0");
        }
      }

      const totalAmount = subtotal + taxAmount - discountAmount;

      const [order] = await tx
        .insert(purchaseOrders)
        .values({
          tenantId,
          companyId,
          purchaseOrderNumber,
          supplierId,
          orderDate,
          deliveryDate,
          currency: currency || "USD",
          subtotal: subtotal.toString(),
          taxAmount: taxAmount.toString(),
          discountAmount: discountAmount.toString(),
          totalAmount: totalAmount.toString(),
          terms,
          remarks,
          createdBy: session.user!.id as string,
        })
        .returning();

      if (lines && Array.isArray(lines) && lines.length > 0) {
        const lineValues = lines.map((line: Record<string, unknown>) => ({
          tenantId,
          purchaseOrderId: order.id,
          itemId: line.itemId as string,
          description: line.description as string | undefined,
          quantity: String(line.quantity || "0"),
          unitPrice: String(line.unitPrice || "0"),
          discountPercentage: String(line.discountPercentage || "0"),
          discountAmount: String(line.discountAmount || "0"),
          taxRate: String(line.taxRate || "0"),
          taxAmount: String(line.taxAmount || "0"),
          netAmount: String(line.netAmount || "0"),
          amount: String(line.amount || line.netAmount || "0"),
          warehouseId: line.warehouseId as string | undefined,
          requiredDate: line.requiredDate as string | undefined,
        }));

        await tx.insert(purchaseOrderLines).values(lineValues);
      }

      return order;
    });

    return success(result, 201);
  } catch (error) {
    console.error("POST /api/purchase-orders error:", error);
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
      .update(purchaseOrders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(purchaseOrders.id, id))
      .returning();

    if (!updated) return badRequest("Purchase order not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/purchase-orders error:", error);
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
      .delete(purchaseOrders)
      .where(eq(purchaseOrders.id, id))
      .returning();

    if (!deleted) return badRequest("Purchase order not found");

    return success({ message: "Purchase order deleted" });
  } catch (error) {
    console.error("DELETE /api/purchase-orders error:", error);
    return serverError();
  }
}
