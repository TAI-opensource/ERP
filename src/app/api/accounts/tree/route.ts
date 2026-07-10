import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { chartOfAccounts } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const companyId = request.nextUrl.searchParams.get("companyId");
    if (!companyId) return badRequest("companyId is required");

    const accounts = await db.query.chartOfAccounts.findMany({
      where: and(
        eq(chartOfAccounts.companyId, companyId),
        eq(chartOfAccounts.isActive, true)
      ),
      orderBy: [chartOfAccounts.accountCode],
    });

    const buildTree = (parentId: string | null): any[] => {
      return accounts
        .filter((a: any) => a.parentId === parentId)
        .map((account: any) => ({
          ...account,
          children: buildTree(account.id),
        }));
    };

    const tree = buildTree(null);

    return success({ tree, total: accounts.length });
  } catch (error) {
    console.error("GET /api/accounts/tree error:", error);
    return serverError();
  }
}
