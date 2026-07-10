import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, notFound, success, serverError } from "@/lib/api-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { id } = await params;

    const invoice = await db.query.invoices.findFirst({
      where: eq(invoices.id, id),
    });

    if (!invoice) return notFound("Invoice not found");
    if (invoice.status !== "draft") return badRequest("Only draft invoices can be submitted");

    const [updated] = await (db as any)
      .update(invoices)
      .set({
        status: "submitted",
        submittedBy: session.user!.id as string,
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, id))
      .returning();

    return success(updated);
  } catch (error) {
    console.error("POST /api/invoices/[id]/submit error:", error);
    return serverError();
  }
}
