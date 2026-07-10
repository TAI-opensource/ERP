import { NextRequest } from "next/server";
import { eq, ilike, and, desc, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError, parseSearchParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const { page, limit, offset, sort, order, search, companyId } = parseSearchParams(
      request.nextUrl.searchParams
    );
    const employmentStatus = request.nextUrl.searchParams.get("employmentStatus") || "";
    const departmentId = request.nextUrl.searchParams.get("departmentId") || "";

    const conditions = [];
    if (companyId) conditions.push(eq(employees.companyId, companyId));
    if (search) conditions.push(ilike(employees.employeeName, `%${search}%`));
    if (employmentStatus) conditions.push(eq(employees.employmentStatus, employmentStatus));
    if (departmentId) conditions.push(eq(employees.departmentId, departmentId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sort === "employeeName" ? employees.employeeName : sort === "dateOfJoining" ? employees.dateOfJoining : employees.createdAt;
    const orderFn = order === "asc" ? asc : desc;

    const [data, totalResult] = await Promise.all([
      db.query.employees.findMany({
        where,
        orderBy: [orderFn(sortColumn)],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(employees).where(where),
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
    console.error("GET /api/employees error:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const {
      tenantId, companyId, employeeId, firstName, middleName, lastName,
      employeeName, dateOfBirth, gender, dateOfJoining, departmentId,
      designationId, employeeType, companyEmail, personalEmail,
      personalPhone, companyPhone, addressLine1, addressLine2,
      city, state, postalCode, country, notes,
    } = body;

    if (!tenantId || !companyId || !employeeId || !firstName || !lastName || !employeeName || !dateOfJoining) {
      return badRequest("tenantId, companyId, employeeId, firstName, lastName, employeeName, and dateOfJoining are required");
    }

    const [newEmployee] = await (db as any)
      .insert(employees)
      .values({
        tenantId,
        companyId,
        employeeId,
        firstName,
        middleName,
        lastName,
        employeeName,
        dateOfBirth,
        gender,
        dateOfJoining,
        departmentId,
        designationId,
        employeeType: employeeType || "full_time",
        companyEmail,
        personalEmail,
        personalPhone,
        companyPhone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        notes,
      })
      .returning();

    return success(newEmployee, 201);
  } catch (error) {
    console.error("POST /api/employees error:", error);
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

    const [updated] = await (db as any)
      .update(employees)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();

    if (!updated) return badRequest("Employee not found");

    return success(updated);
  } catch (error) {
    console.error("PUT /api/employees error:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return badRequest("id is required");

    const [deleted] = await (db as any)
      .delete(employees)
      .where(eq(employees.id, id))
      .returning();

    if (!deleted) return badRequest("Employee not found");

    return success({ message: "Employee deleted" });
  } catch (error) {
    console.error("DELETE /api/employees error:", error);
    return serverError();
  }
}
