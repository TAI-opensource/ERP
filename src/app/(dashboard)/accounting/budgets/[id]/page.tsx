"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import Link from "next/link"

const budgetDetails = {
  id: "BUD-001",
  name: "Annual Operating Budget 2024",
  period: "Jan 2024 - Dec 2024",
  amount: "$1,500,000",
  spent: "$892,000",
  remaining: "$608,000",
  utilization: "59.5%",
  status: "Active",
}

const budgetLines = [
  { account: "5100 - Salary Expense", budgeted: "$600,000", spent: "$312,000", remaining: "$288,000", utilization: "52.0%" },
  { account: "5200 - Rent Expense", budgeted: "$180,000", spent: "$36,000", remaining: "$144,000", utilization: "20.0%" },
  { account: "5300 - Utilities Expense", budgeted: "$60,000", spent: "$12,000", remaining: "$48,000", utilization: "20.0%" },
  { account: "5400 - Marketing Expense", budgeted: "$150,000", spent: "$78,000", remaining: "$72,000", utilization: "52.0%" },
  { account: "5500 - Office Supplies", budgeted: "$30,000", spent: "$8,500", remaining: "$21,500", utilization: "28.3%" },
]

const columns = [
  { key: "account", label: "Account" },
  { key: "budgeted", label: "Budgeted", className: "text-right" },
  { key: "spent", label: "Spent", className: "text-right" },
  { key: "remaining", label: "Remaining", className: "text-right" },
  { key: "utilization", label: "Utilization", className: "text-right" },
]

export default function BudgetDetailPage() {
  return (
    <OverviewLayout
      title={budgetDetails.name}
      description="View budget details and line items"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{budgetDetails.amount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{budgetDetails.spent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{budgetDetails.remaining}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{budgetDetails.utilization}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Budget Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Budget Number</p>
                <p className="font-medium">{budgetDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium">{budgetDetails.period}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status={budgetDetails.status} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Lines</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={budgetLines} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/budgets" />}>
            Back to Budgets
          </Button>
          <Button>Edit Budget</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
