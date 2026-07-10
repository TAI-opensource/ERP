import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { assets } from "@/lib/db/schema";
import { getAuthSession, unauthorized, notFound, success, serverError } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const asset = await db.query.assets.findFirst({
      where: eq(assets.id, id),
    });

    if (!asset) return notFound("Asset not found");

    return success(asset);
  } catch (error) {
    console.error("GET /api/assets/[id] error:", error);
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
      .update(assets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(assets.id, id))
      .returning();

    if (!updated) return notFound("Asset not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/assets/[id] error:", error);
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
      .delete(assets)
      .where(eq(assets.id, id))
      .returning();

    if (!deleted) return notFound("Asset not found");

    return success({ message: "Asset deleted" });
  } catch (error) {
    console.error("DELETE /api/assets/[id] error:", error);
    return serverError();
  }
}
