"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Button } from "@/components/ui/button"

const unreconciled = [
  { date: "2024-01-15", description: "Payment from Acme Corp", type: "Credit", amount: "$12,500", bankStatement: "$12,500", diff: "$0", status: "Matched" },
  { date: "2024-01-14", description: "Office supplies", type: "Debit", amount: "$850", bankStatement: "$850", diff: "$0", status: "Matched" },
  { date: "2024-01-13", description: "Bank fee", type: "Debit", amount: "-", bankStatement: "$25", diff: "$25", status: "Unmatched" },
  { date: "2024-01-12", description: "Customer payment - Global", type: "Credit", amount: "$23,000", bankStatement: "$23,000", diff: "$0", status: "Matched" },
]

const columns = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Books Amount", className: "text-right" },
  { key: "bankStatement", label: "Bank Statement", className: "text-right" },
  { key: "diff", label: "Difference", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function BankReconciliationPage() {
  return (
    <OverviewLayout
      title="Bank Reconciliation"
      description="Reconcile bank statements with book records"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Statement Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$245,675</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Book Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$245,650</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Difference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">$25</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Unmatched Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reconciliation Items</CardTitle>
            <Button>Complete Reconciliation</Button>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={unreconciled} />
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
