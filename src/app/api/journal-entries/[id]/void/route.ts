import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalEntries } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, notFound, success, serverError } from "@/lib/api-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const entry = await db.query.journalEntries.findFirst({
      where: eq(journalEntries.id, id),
    });

    if (!entry) return notFound("Journal entry not found");
    if (entry.status !== "posted") return badRequest("Only posted entries can be voided");

    const [updated] = await (db as any)
      .update(journalEntries)
      .set({
        status: "voided",
        cancelledBy: session.user!.id as string,
        cancelledAt: new Date(),
        isAmended: true,
        amendedFrom: id,
        updatedAt: new Date(),
      })
      .where(eq(journalEntries.id, id))
      .returning();

    return success(updated);
  } catch (error) {
    console.error("POST /api/journal-entries/[id]/void error:", error);
    return serverError();
  }
}
