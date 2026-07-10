import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { itemTaxTemplates } from "@/lib/db/schema";
import { getAuthSession, unauthorized, notFound, success, serverError } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const template = await db.query.itemTaxTemplates.findFirst({
      where: eq(itemTaxTemplates.id, id),
    });

    if (!template) return notFound("Tax template not found");

    return success(template);
  } catch (error) {
    console.error("GET /api/tax-templates/[id] error:", error);
    return serverError();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { ...updates } = body;

    const [updated] = await (db as any)
      .update(itemTaxTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(itemTaxTemplates.id, id))
      .returning();

    if (!updated) return notFound("Tax template not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/tax-templates/[id] error:", error);
    return serverError();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const [deleted] = await (db as any)
      .delete(itemTaxTemplates)
      .where(eq(itemTaxTemplates.id, id))
      .returning();

    if (!deleted) return notFound("Tax template not found");

    return success({ message: "Tax template deleted" });
  } catch (error) {
    console.error("DELETE /api/tax-templates/[id] error:", error);
    return serverError();
  }
}
