import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { journalEntries, journalEntryLines } from "@/lib/db/schema";
import { getAuthSession, unauthorized, badRequest, success, serverError } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthorized();

    const body = await request.json();
    const { tenantId, companyId, bankAccountId, fiscalYearId, transactions } = body;

    if (!tenantId || !companyId || !bankAccountId || !transactions || !Array.isArray(transactions)) {
      return badRequest("tenantId, companyId, bankAccountId, and transactions array are required");
    }

    const results = await db.transaction(async (tx) => {
      const imported = [];

      for (const txn of transactions) {
        const [entry] = await tx
          .insert(journalEntries)
          .values({
            tenantId,
            companyId,
            fiscalYearId,
            entryNumber: txn.entryNumber || `IMPORT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            entryDate: txn.date,
            postingDate: txn.postingDate || txn.date,
            voucherType: "bank_import",
            voucherNumber: txn.referenceNumber,
            narration: txn.description || `Imported transaction`,
            totalAmount: txn.amount,
            status: "draft",
            createdBy: session.user!.id as string,
          })
          .returning();

        await tx.insert(journalEntryLines).values([
          {
            tenantId,
            journalEntryId: entry.id,
            accountId: bankAccountId,
            debit: txn.amount > 0 ? String(Math.abs(txn.amount)) : "0",
            credit: txn.amount < 0 ? String(Math.abs(txn.amount)) : "0",
            description: txn.description,
          },
          {
            tenantId,
            journalEntryId: entry.id,
            accountId: txn.counterpartAccountId || bankAccountId,
            debit: txn.amount < 0 ? String(Math.abs(txn.amount)) : "0",
            credit: txn.amount > 0 ? String(Math.abs(txn.amount)) : "0",
            description: txn.description,
          },
        ]);

        imported.push(entry);
      }

      return imported;
    });

    return success({
      imported: results.length,
      transactions: results,
    }, 201);
  } catch (error) {
    console.error("POST /api/bank-transactions/import error:", error);
    return serverError();
  }
}
