"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const receivableData = [
  { customer: "Acme Corp", invoice: "INV-2024-002", date: "2024-01-14", dueDate: "2024-02-14", amount: "$8,750", paid: "$3,000", outstanding: "$5,750", daysOverdue: 0, status: "Partly Paid" },
  { customer: "Local Business Co", invoice: "INV-2024-004", date: "2024-01-12", dueDate: "2024-01-12", amount: "$4,200", paid: "$0", outstanding: "$4,200", daysOverdue: 3, status: "Overdue" },
  { customer: "Manufacturing Plus", invoice: "INV-2024-005", date: "2024-01-11", dueDate: "2024-02-11", amount: "$15,800", paid: "$0", outstanding: "$15,800", daysOverdue: 0, status: "Unpaid" },
  { customer: "Acme Corp", invoice: "INV-2024-007", date: "2024-01-09", dueDate: "2024-02-09", amount: "$9,100", paid: "$0", outstanding: "$9,100", daysOverdue: 0, status: "Unpaid" },
]

const columns = [
  { key: "customer", label: "Customer" },
  { key: "invoice", label: "Invoice #" },
  { key: "date", label: "Invoice Date" },
  { key: "dueDate", label: "Due Date" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "outstanding", label: "Outstanding", className: "text-right" },
  { key: "daysOverdue", label: "Days Overdue", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function AccountsReceivablePage() {
  return (
    <OverviewLayout
      title="Accounts Receivable"
      description="Track outstanding customer payments"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Receivable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$34,850</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">$4,200</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Days Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Receivable Details</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={receivableData} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/reports" />}>
            Back to Reports
          </Button>
          <Button>Export PDF</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
