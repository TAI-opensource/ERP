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
    if (entry.status !== "draft") return badRequest("Only draft entries can be submitted");

    const [updated] = await (db as any)
      .update(journalEntries)
      .set({
        status: "posted",
        submittedBy: session.user!.id as string,
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(journalEntries.id, id))
      .returning();

    return success(updated);
  } catch (error) {
    console.error("POST /api/journal-entries/[id]/submit error:", error);
    return serverError();
  }
}
