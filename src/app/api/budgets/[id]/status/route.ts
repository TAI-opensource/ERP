import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { budgets } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, notFound, success, serverError } from "@/lib/api-utils";

export async function POST(
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

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["active", "inactive", "archived", "submitted", "approved", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return badRequest(`Status must be one of: ${validStatuses.join(", ")}`);
    }

    const [updated] = await (db as any)
      .update(budgets)
      .set({ status, isActive: status === "active", updatedAt: new Date() })
      .where(eq(budgets.id, id))
      .returning();

    return success(updated);
  } catch (error) {
    console.error("POST /api/budgets/[id]/status error:", error);
    return serverError();
  }
}
