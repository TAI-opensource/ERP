import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function getAuthSession() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function success(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function parseSearchParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const companyId = searchParams.get("companyId") || "";

  return { page, limit, offset, sort, order, search, status, companyId };
}
