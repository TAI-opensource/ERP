"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const quotations = [
  { id: "QUO-2024-001", customer: "Acme Corp", date: "2024-01-15", validUntil: "2024-02-15", amount: "$12,500", status: "Open" },
  { id: "QUO-2024-002", customer: "TechStart Inc", date: "2024-01-14", validUntil: "2024-02-14", amount: "$8,750", status: "Draft" },
  { id: "QUO-2024-003", customer: "Global Industries", date: "2024-01-13", validUntil: "2024-02-13", amount: "$23,000", status: "Open" },
  { id: "QUO-2024-004", customer: "Local Business Co", date: "2024-01-12", validUntil: "2024-02-12", amount: "$4,200", status: "Closed" },
  { id: "QUO-2024-005", customer: "Manufacturing Plus", date: "2024-01-11", validUntil: "2024-02-11", amount: "$15,800", status: "Open" },
  { id: "QUO-2024-006", customer: "Retail Chain", date: "2024-01-10", validUntil: "2024-02-10", amount: "$6,300", status: "Draft" },
]

const columns = [
  { key: "id", label: "Quotation #" },
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "validUntil", label: "Valid Until" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function QuotationsPage() {
  return (
    <OverviewLayout
      title="Quotations"
      description="Create and manage sales quotations"
      actionLabel="New Quotation"
      actionHref="/selling/quotations/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={quotations} />
      </div>
    </OverviewLayout>
  )
}
