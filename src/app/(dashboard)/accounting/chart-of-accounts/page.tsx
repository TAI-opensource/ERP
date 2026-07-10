"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const accounts = [
  { code: "1000", name: "Cash and Cash Equivalents", type: "Asset", group: "Current Assets", balance: "$245,000", status: "Active" },
  { code: "1100", name: "Accounts Receivable", type: "Asset", group: "Current Assets", balance: "$128,000", status: "Active" },
  { code: "1200", name: "Inventory", type: "Asset", group: "Current Assets", balance: "$89,000", status: "Active" },
  { code: "1500", name: "Fixed Assets", type: "Asset", group: "Non-Current Assets", balance: "$450,000", status: "Active" },
  { code: "2000", name: "Accounts Payable", type: "Liability", group: "Current Liabilities", balance: "$67,000", status: "Active" },
  { code: "2100", name: "Short-term Loans", type: "Liability", group: "Current Liabilities", balance: "$50,000", status: "Active" },
  { code: "3000", name: "Owner's Equity", type: "Equity", group: "Equity", balance: "$500,000", status: "Active" },
  { code: "4000", name: "Sales Revenue", type: "Income", group: "Revenue", balance: "$1,245,000", status: "Active" },
  { code: "5000", name: "Cost of Goods Sold", type: "Expense", group: "Cost of Sales", balance: "$534,000", status: "Active" },
  { code: "5100", name: "Salary Expense", type: "Expense", group: "Operating Expenses", balance: "$312,000", status: "Active" },
  { code: "5200", name: "Rent Expense", type: "Expense", group: "Operating Expenses", balance: "$36,000", status: "Active" },
  { code: "5300", name: "Utilities Expense", type: "Expense", group: "Operating Expenses", balance: "$12,000", status: "Inactive" },
]

const columns = [
  { key: "code", label: "Code" },
  { key: "name", label: "Account Name" },
  { key: "type", label: "Type" },
  { key: "group", label: "Group" },
  { key: "balance", label: "Balance", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function ChartOfAccountsPage() {
  return (
    <OverviewLayout
      title="Chart of Accounts"
      description="Manage your account structure and balances"
      actionLabel="New Account"
      actionHref="/accounting/chart-of-accounts/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={accounts} />
      </div>
    </OverviewLayout>
  )
}
