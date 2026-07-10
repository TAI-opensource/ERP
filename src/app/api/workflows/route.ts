import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const documentType = request.nextUrl.searchParams.get("documentType") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(workflows.companyId, companyId));
    if (search) conditions.push(ilike(workflows.name, `%${search}%`));
    if (documentType) conditions.push(eq(workflows.documentType, documentType));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "name" ? workflows.name : workflows.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.workflows.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(workflows).where(where),
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
    console.error("GET /api/workflows error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, companyId, name, documentType } = body;

    if (!tenantId || !companyId || !name || !documentType) {
      return badRequest("tenantId, companyId, name, and documentType are required");
    }

    const [newWorkflow] = await (db as any)
      .insert(workflows)
      .values({
        tenantId,
        companyId,
        name,
        documentType,
      })
      .returning();

    return success(newWorkflow, 201);
  } catch (error) {
    console.error("POST /api/workflows error:", error);
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
      .update(workflows)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workflows.id, id))
      .returning();

    if (!updated) return badRequest("Workflow not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/workflows error:", error);
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
      .delete(workflows)
      .where(eq(workflows.id, id))
      .returning();

    if (!deleted) return badRequest("Workflow not found");

    return success({ message: "Workflow deleted" });
  } catch (error) {
    console.error("DELETE /api/workflows error:", error);
    return serverError();
  }
}
