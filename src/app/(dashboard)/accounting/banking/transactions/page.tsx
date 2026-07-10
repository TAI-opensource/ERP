"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const transactions = [
  { id: "TXN-001", date: "2024-01-15", description: "Payment from Acme Corp", account: "Main Operating", type: "Credit", amount: "$12,500", balance: "$245,000", reference: "PAY-2024-001", status: "Cleared" },
  { id: "TXN-002", date: "2024-01-14", description: "Office rent payment", account: "Main Operating", type: "Debit", amount: "$3,000", balance: "$232,500", reference: "EXP-2024-001", status: "Cleared" },
  { id: "TXN-003", date: "2024-01-13", description: "Supplier payment - Component Co", account: "Main Operating", type: "Debit", amount: "$8,200", balance: "$235,500", reference: "PAY-2024-002", status: "Pending" },
  { id: "TXN-004", date: "2024-01-12", description: "Salary disbursement", account: "Main Operating", type: "Debit", amount: "$45,000", balance: "$243,700", reference: "PAY-2024-003", status: "Cleared" },
  { id: "TXN-005", date: "2024-01-11", description: "Customer payment - TechStart", account: "Savings Account", type: "Credit", amount: "$5,750", balance: "$128,000", reference: "PAY-2024-004", status: "Cleared" },
  { id: "TXN-006", date: "2024-01-10", description: "Bank transfer to savings", account: "Main Operating", type: "Debit", amount: "$10,000", balance: "$288,700", reference: "TXN-INTERNAL-001", status: "Cleared" },
]

const columns = [
  { key: "id", label: "TXN #" },
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "account", label: "Account" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "reference", label: "Reference" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function BankTransactionsPage() {
  return (
    <OverviewLayout
      title="Bank Transactions"
      description="View all bank transactions"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={transactions} />
      </div>
    </OverviewLayout>
  )
}
