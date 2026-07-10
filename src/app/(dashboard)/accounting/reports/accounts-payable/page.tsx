"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const payableData = [
  { supplier: "Component Co", invoice: "PINV-2024-003", date: "2024-01-13", dueDate: "2024-02-13", amount: "$4,800", paid: "$0", outstanding: "$4,800", daysOverdue: 0, status: "Unpaid" },
  { supplier: "Material Masters", invoice: "PINV-2024-004", date: "2024-01-12", dueDate: "2024-01-12", amount: "$22,000", paid: "$0", outstanding: "$22,000", daysOverdue: 3, status: "Overdue" },
  { supplier: "Electro Parts", invoice: "PINV-2024-005", date: "2024-01-11", dueDate: "2024-02-11", amount: "$5,300", paid: "$2,000", outstanding: "$3,300", daysOverdue: 0, status: "Partly Paid" },
  { supplier: "Supplier Alpha", invoice: "PINV-2024-006", date: "2024-01-10", dueDate: "2024-02-10", amount: "$11,400", paid: "$0", outstanding: "$11,400", daysOverdue: 0, status: "Unpaid" },
]

const columns = [
  { key: "supplier", label: "Supplier" },
  { key: "invoice", label: "Invoice #" },
  { key: "date", label: "Invoice Date" },
  { key: "dueDate", label: "Due Date" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "outstanding", label: "Outstanding", className: "text-right" },
  { key: "daysOverdue", label: "Days Overdue", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function AccountsPayablePage() {
  return (
    <OverviewLayout
      title="Accounts Payable"
      description="Track outstanding supplier payments"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Payable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$41,500</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">$22,000</div>
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
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payable Details</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={payableData} />
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
