"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Badge } from "@/components/ui/badge"

const journalEntries = [
  {
    id: "JE-0045",
    date: "2024-01-15",
    postingDate: "2024-01-15",
    accounts: "Cash / Sales Revenue",
    debit: "$5,000.00",
    credit: "$5,000.00",
    reference: "INV-2024-001",
    status: "Posted",
    user: "John Doe",
  },
  {
    id: "JE-0044",
    date: "2024-01-14",
    postingDate: "2024-01-14",
    accounts: "Accounts Receivable / Sales Revenue",
    debit: "$12,500.00",
    credit: "$12,500.00",
    reference: "INV-2024-002",
    status: "Posted",
    user: "Jane Smith",
  },
  {
    id: "JE-0043",
    date: "2024-01-13",
    postingDate: "-",
    accounts: "Inventory / Accounts Payable",
    debit: "$8,200.00",
    credit: "$8,200.00",
    reference: "PO-2024-003",
    status: "Draft",
    user: "John Doe",
  },
  {
    id: "JE-0042",
    date: "2024-01-12",
    postingDate: "2024-01-12",
    accounts: "Salary Expense / Cash",
    debit: "$45,000.00",
    credit: "$45,000.00",
    reference: "PAY-2024-001",
    status: "Posted",
    user: "Admin",
  },
  {
    id: "JE-0041",
    date: "2024-01-11",
    postingDate: "2024-01-11",
    accounts: "Rent Expense / Cash",
    debit: "$3,000.00",
    credit: "$3,000.00",
    reference: "EXP-2024-005",
    status: "Posted",
    user: "Jane Smith",
  },
]

const columns = [
  { key: "id", label: "Entry #" },
  { key: "date", label: "Date" },
  { key: "accounts", label: "Accounts" },
  { key: "debit", label: "Debit", className: "text-right" },
  { key: "credit", label: "Credit", className: "text-right" },
  { key: "reference", label: "Reference" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function JournalEntriesPage() {
  return (
    <OverviewLayout
      title="Journal Entries"
      description="Record and manage financial transactions"
      actionLabel="New Entry"
      actionHref="/accounting/journal-entries/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={journalEntries} />
      </div>
    </OverviewLayout>
  )
}
