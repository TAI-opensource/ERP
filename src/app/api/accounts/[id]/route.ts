import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chartOfAccounts } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, notFound, success, serverError } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const account = await db.query.chartOfAccounts.findFirst({
      where: eq(chartOfAccounts.id, id),
    });

    if (!account) return notFound("Account not found");

    return success(account);
  } catch (error) {
    console.error("GET /api/accounts/[id] error:", error);
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
      .update(chartOfAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(chartOfAccounts.id, id))
      .returning();

    if (!updated) return notFound("Account not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/accounts/[id] error:", error);
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
      .delete(chartOfAccounts)
      .where(eq(chartOfAccounts.id, id))
      .returning();

    if (!deleted) return notFound("Account not found");

    return success({ message: "Account deleted" });
  } catch (error) {
    console.error("DELETE /api/accounts/[id] error:", error);
    return serverError();
  }
}
