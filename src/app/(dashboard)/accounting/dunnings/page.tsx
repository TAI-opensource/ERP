"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const dunnings = [
  { id: "DUN-001", customer: "Acme Corp", invoice: "INV-2024-001", amount: "$12,500", dueDate: "2024-01-10", daysOverdue: 5, level: "First Reminder", status: "Sent" },
  { id: "DUN-002", customer: "Global Industries", invoice: "INV-2024-003", amount: "$23,000", dueDate: "2024-01-05", daysOverdue: 10, level: "Second Reminder", status: "Sent" },
  { id: "DUN-003", customer: "Retail Chain", invoice: "INV-2024-006", amount: "$6,300", dueDate: "2023-12-28", daysOverdue: 18, level: "Final Notice", status: "Pending" },
  { id: "DUN-004", customer: "Old Company", invoice: "INV-2023-089", amount: "$45,000", dueDate: "2023-11-15", daysOverdue: 61, level: "Legal Action", status: "Escalated" },
  { id: "DUN-005", customer: "Local Business Co", invoice: "INV-2024-004", amount: "$4,200", dueDate: "2024-01-08", daysOverdue: 7, level: "First Reminder", status: "Sent" },
]

const columns = [
  { key: "id", label: "Dunning #" },
  { key: "customer", label: "Customer" },
  { key: "invoice", label: "Invoice" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "dueDate", label: "Due Date" },
  { key: "daysOverdue", label: "Days Overdue", className: "text-right" },
  { key: "level", label: "Dunning Level" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Total Outstanding", value: "$91,000" },
  { label: "Overdue Invoices", value: "5" },
  { label: "Dunning Level 1", value: "2" },
  { label: "Escalated Cases", value: "1" },
]

export default function DunningsPage() {
  return (
    <OverviewLayout
      title="Dunning Management"
      description="Track overdue payments and send dunning letters"
      actionLabel="New Dunning"
      actionHref="/accounting/dunnings/new"
      stats={summaryStats}
    >
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">First Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Pending response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Second Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Pending response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Final Notice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Pending response</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={dunnings} />
      </div>
    </OverviewLayout>
  )
}
