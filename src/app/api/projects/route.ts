import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId, status } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const projectType = request.nextUrl.searchParams.get("projectType") || "";
    const priority = request.nextUrl.searchParams.get("priority") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(projects.companyId, companyId));
    if (search) conditions.push(ilike(projects.projectName, `%${search}%`));
    if (status) conditions.push(eq(projects.status, status));
    if (projectType) conditions.push(eq(projects.projectType, projectType));
    if (priority) conditions.push(eq(projects.priority, priority));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "projectName" ? projects.projectName : sort === "startDate" ? projects.startDate : projects.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.projects.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(projects).where(where),
    ]);

    return success({
      data,
      pagination: {
        page,
        limit,
        total: totalResult[0]?.value || 0,
        totalPages: Math.ceil((totalResult[0]?.value || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, projectName, projectCode, description,
      projectType, status, priority, departmentId, customerId,
      startDate, expectedEndDate, estimatedCost, currency,
      projectManagerId, notes, isTemplate,
    } = body;

    if (!tenantId || !companyId || !projectName) {
      return badRequest("tenantId, companyId, and projectName are required");
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        tenantId,
        companyId,
        projectName,
        projectCode,
        description,
        projectType: projectType || "internal",
        status: status || "planning",
        priority: priority || "medium",
        departmentId,
        customerId,
        startDate,
        expectedEndDate,
        estimatedCost,
        currency: currency || "USD",
        projectManagerId,
        notes,
        isTemplate: isTemplate || false,
      })
      .returning();

    return success(newProject, 201);
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return serverError();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return badRequest("id is required");

    const [updated] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    if (!updated) return badRequest("Project not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/projects error:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return badRequest("id is required");

    const [deleted] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    if (!deleted) return badRequest("Project not found");

    return success({ message: "Project deleted" });
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return serverError();
  }
}
