"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleDataTable } from "@/components/erp/simple-data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const bankSummary = [
  { bank: "Chase Bank", account: "Main Operating", number: "****4521", balance: "$245,000", lastTransaction: "2024-01-15" },
  { bank: "Bank of America", account: "Savings Account", number: "****7832", balance: "$128,000", lastTransaction: "2024-01-14" },
  { bank: "Wells Fargo", account: "Payroll Account", number: "****9103", balance: "$50,000", lastTransaction: "2024-01-12" },
  { bank: "Cash", account: "Petty Cash", number: "-", balance: "$2,500", lastTransaction: "2024-01-15" },
]

const columns = [
  { key: "bank", label: "Bank" },
  { key: "account", label: "Account Name" },
  { key: "number", label: "Account Number" },
  { key: "balance", label: "Balance", className: "text-right" },
  { key: "lastTransaction", label: "Last Transaction" },
]

export default function BankSummaryPage() {
  return (
    <OverviewLayout
      title="Bank Summary"
      description="Overview of all bank accounts"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$425,500</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month Inflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">+$41,250</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month Outflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">-$67,050</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bank Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={bankSummary} />
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
