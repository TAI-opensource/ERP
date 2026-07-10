"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const budgets = [
  { id: "BUD-001", name: "Annual Operating Budget 2024", period: "Jan 2024 - Dec 2024", amount: "$1,500,000", spent: "$892,000", remaining: "$608,000", status: "Active" },
  { id: "BUD-002", name: "Marketing Budget Q1", period: "Jan 2024 - Mar 2024", amount: "$150,000", spent: "$78,000", remaining: "$72,000", status: "Active" },
  { id: "BUD-003", name: "IT Infrastructure Budget", period: "Jan 2024 - Dec 2024", amount: "$200,000", spent: "$45,000", remaining: "$155,000", status: "Active" },
  { id: "BUD-004", name: "Travel & Entertainment", period: "Jan 2024 - Dec 2024", amount: "$80,000", spent: "$12,000", remaining: "$68,000", status: "Active" },
  { id: "BUD-005", name: "Training & Development", period: "Jan 2024 - Dec 2024", amount: "$50,000", spent: "$8,500", remaining: "$41,500", status: "Draft" },
]

const columns = [
  { key: "id", label: "Budget #" },
  { key: "name", label: "Budget Name" },
  { key: "period", label: "Period" },
  { key: "amount", label: "Budget Amount", className: "text-right" },
  { key: "spent", label: "Spent", className: "text-right" },
  { key: "remaining", label: "Remaining", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Total Budget", value: "$1,980,000" },
  { label: "Total Spent", value: "$1,035,500" },
  { label: "Total Remaining", value: "$944,500" },
  { label: "Budget Utilization", value: "52.3%" },
]

export default function BudgetsPage() {
  return (
    <OverviewLayout
      title="Budgets"
      description="Create and manage departmental budgets"
      actionLabel="New Budget"
      actionHref="/accounting/budgets/new"
      stats={summaryStats}
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={budgets} />
      </div>
    </OverviewLayout>
  )
}
