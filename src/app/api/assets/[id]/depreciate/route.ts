import { NextRequest } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { assets, depreciationEntries } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, notFound, success, serverError } from "@/lib/api-utils";

export async function POST(
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
    if (asset.assetStatus !== "active") return badRequest("Only active assets can be depreciated");

    const body = await request.json();
    const { depreciationDate, fiscalYearId } = body;

    if (!depreciationDate) return badRequest("depreciationDate is required");

    const purchaseAmount = parseFloat(asset.purchaseAmount || "0");
    const accumulatedDepreciation = parseFloat(asset.accumulatedDepreciation || "0");
    const depreciationRate = parseFloat(asset.depreciationRate || "0");
    const numberOfMonths = asset.numberOfMonths || 12;

    const monthlyDepreciation = (purchaseAmount * depreciationRate / 100) / numberOfMonths;
    const depreciationAmount = Math.min(monthlyDepreciation, purchaseAmount - accumulatedDepreciation);

    if (depreciationAmount <= 0) {
      return badRequest("Asset is fully depreciated");
    }

    const newAccumulatedDepreciation = accumulatedDepreciation + depreciationAmount;
    const newCurrentValue = purchaseAmount - newAccumulatedDepreciation;

    const result = await db.transaction(async (tx) => {
      const [depreciationEntry] = await (tx as any)
        .insert(depreciationEntries)
        .values({
          tenantId: asset.tenantId,
          companyId: asset.companyId,
          assetId: id,
          depreciationDate,
          depreciationAmount: depreciationAmount.toString(),
          accumulatedDepreciation: newAccumulatedDepreciation.toString(),
          fiscalYearId,
          status: "pending",
          createdBy: session.user!.id as string,
        })
        .returning();

      await (tx as any)
        .update(assets)
        .set({
          accumulatedDepreciation: newAccumulatedDepreciation.toString(),
          currentValue: newCurrentValue.toString(),
          updatedAt: new Date(),
        })
        .where(eq(assets.id, id));

      return depreciationEntry;
    });

    return success({
      depreciationEntry: result,
      asset: {
        previousAccumulatedDepreciation: accumulatedDepreciation,
        newAccumulatedDepreciation,
        previousCurrentValue: purchaseAmount - accumulatedDepreciation,
        newCurrentValue,
        depreciationAmount,
      },
    }, 201);
  } catch (error) {
    console.error("POST /api/assets/[id]/depreciate error:", error);
    return serverError();
  }
}
