"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleDataTable } from "@/components/erp/simple-data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const trialBalanceData = [
  { account: "1000 - Cash and Cash Equivalents", debit: "$245,000", credit: "-" },
  { account: "1100 - Accounts Receivable", debit: "$128,000", credit: "-" },
  { account: "1200 - Inventory", debit: "$89,000", credit: "-" },
  { account: "1500 - Fixed Assets", debit: "$450,000", credit: "-" },
  { account: "1600 - Accumulated Depreciation", debit: "-", credit: "$90,000" },
  { account: "2000 - Accounts Payable", debit: "-", credit: "$67,000" },
  { account: "2100 - Short-term Loans", debit: "-", credit: "$50,000" },
  { account: "2200 - Long-term Debt", debit: "-", credit: "$200,000" },
  { account: "3000 - Owner's Equity", debit: "-", credit: "$500,000" },
  { account: "3100 - Retained Earnings", debit: "-", credit: "$5,000" },
  { account: "4000 - Sales Revenue", debit: "-", credit: "$1,245,000" },
  { account: "5000 - Cost of Goods Sold", debit: "$534,000", credit: "-" },
  { account: "5100 - Salary Expense", debit: "$312,000", credit: "-" },
  { account: "5200 - Rent Expense", debit: "$36,000", credit: "-" },
  { account: "5300 - Utilities Expense", debit: "$12,000", credit: "-" },
]

const columns = [
  { key: "account", label: "Account" },
  { key: "debit", label: "Debit", className: "text-right" },
  { key: "credit", label: "Credit", className: "text-right" },
]

export default function TrialBalancePage() {
  return (
    <OverviewLayout
      title="Trial Balance"
      description="Verify that debits equal credits"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Debit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,806,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,157,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Difference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">$0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">January 2024</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trial Balance - January 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={trialBalanceData} />
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
