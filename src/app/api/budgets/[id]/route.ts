import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { budgets } from "@/lib/db/schema";
import { getAuthSession, unauthorized, notFound, success, serverError } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const budget = await db.query.budgets.findFirst({
      where: eq(budgets.id, id),
    });

    if (!budget) return notFound("Budget not found");

    return success(budget);
  } catch (error) {
    console.error("GET /api/budgets/[id] error:", error);
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
      .update(budgets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(budgets.id, id))
      .returning();

    if (!updated) return notFound("Budget not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/budgets/[id] error:", error);
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
      .delete(budgets)
      .where(eq(budgets.id, id))
      .returning();

    if (!deleted) return notFound("Budget not found");

    return success({ message: "Budget deleted" });
  } catch (error) {
    console.error("DELETE /api/budgets/[id] error:", error);
    return serverError();
  }
}
