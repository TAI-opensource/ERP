import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { shipments } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );

    const conditions = [];
    if (companyId) conditions.push(eq(shipments.companyId, companyId));
    if (search) conditions.push(ilike(shipments.trackingNo, `%${search}%`));
    if (status) conditions.push(eq(shipments.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "trackingNo" ? shipments.trackingNo : shipments.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.shipments.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(shipments).where(where),
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
    console.error("GET /api/shipments error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, companyId, deliveryNoteId, shipmentDate, trackingNo, carrier } = body;

    if (!tenantId || !companyId || !shipmentDate) {
      return badRequest("tenantId, companyId, and shipmentDate are required");
    }

    const [newShipment] = await (db as any)
      .insert(shipments)
      .values({
        tenantId,
        companyId,
        deliveryNoteId,
        shipmentDate,
        trackingNo,
        carrier,
      })
      .returning();

    return success(newShipment, 201);
  } catch (error) {
    console.error("POST /api/shipments error:", error);
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
      .update(shipments)
      .set({ ...updates })
      .where(eq(shipments.id, id))
      .returning();

    if (!updated) return badRequest("Shipment not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/shipments error:", error);
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
      .delete(shipments)
      .where(eq(shipments.id, id))
      .returning();

    if (!deleted) return badRequest("Shipment not found");

    return success({ message: "Shipment deleted" });
  } catch (error) {
    console.error("DELETE /api/shipments error:", error);
    return serverError();
  }
}
