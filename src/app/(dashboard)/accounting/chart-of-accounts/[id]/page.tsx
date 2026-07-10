"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SimpleDataTable } from "@/components/erp/simple-data-table"
import Link from "next/link"

const accountDetails = {
  code: "1000",
  name: "Cash and Cash Equivalents",
  type: "Asset",
  group: "Current Assets",
  currency: "USD",
  balance: "$245,000.00",
  status: "Active",
  description: "Includes cash on hand and demand deposits with banks.",
}

const recentTransactions = [
  { date: "2024-01-15", description: "Payment from Acme Corp", reference: "PAY-2024-001", debit: "$12,500", credit: "-", balance: "$245,000" },
  { date: "2024-01-14", description: "Office supplies purchase", reference: "PAY-2024-002", debit: "-", credit: "$850", balance: "$232,500" },
  { date: "2024-01-13", description: "Bank deposit", reference: "JE-0043", debit: "$5,000", credit: "-", balance: "$233,350" },
  { date: "2024-01-12", description: "Salary payment", reference: "PAY-2024-004", debit: "-", credit: "$45,000", balance: "$228,350" },
]

const columns = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "reference", label: "Reference" },
  { key: "debit", label: "Debit", className: "text-right" },
  { key: "credit", label: "Credit", className: "text-right" },
  { key: "balance", label: "Balance", className: "text-right" },
]

export default function AccountDetailPage() {
  return (
    <OverviewLayout
      title={`${accountDetails.code} - ${accountDetails.name}`}
      description="Account details and transaction history"
      actionLabel="Edit Account"
      actionHref="/accounting/chart-of-accounts"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accountDetails.balance}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Account Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accountDetails.type}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accountDetails.group}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge>{accountDetails.status}</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Account Code</p>
                <p className="font-medium">{accountDetails.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Name</p>
                <p className="font-medium">{accountDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="font-medium">{accountDetails.currency}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{accountDetails.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={recentTransactions} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/chart-of-accounts" />}>
            Back to Chart of Accounts
          </Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
