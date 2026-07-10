"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleDataTable } from "@/components/erp/simple-data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const ledgerData = [
  { date: "2024-01-01", journal: "JE-0041", account: "1000 - Cash", description: "Opening balance", debit: "$200,000", credit: "-", balance: "$200,000" },
  { date: "2024-01-05", journal: "JE-0042", account: "4000 - Sales Revenue", description: "Sales to Acme Corp", debit: "-", credit: "$12,500", balance: "$12,500" },
  { date: "2024-01-05", journal: "JE-0042", account: "1100 - Accounts Receivable", description: "Invoice INV-2024-001", debit: "$12,500", credit: "-", balance: "$12,500" },
  { date: "2024-01-10", journal: "JE-0043", account: "5000 - COGS", description: "Cost of goods sold", debit: "$8,200", credit: "-", balance: "$8,200" },
  { date: "2024-01-10", journal: "JE-0043", account: "1200 - Inventory", description: "Inventory reduction", debit: "-", credit: "$8,200", balance: "$8,200" },
  { date: "2024-01-15", journal: "JE-0045", account: "1000 - Cash", description: "Payment received", debit: "$12,500", credit: "-", balance: "$212,500" },
  { date: "2024-01-15", journal: "JE-0045", account: "1100 - Accounts Receivable", description: "AR reduction", debit: "-", credit: "$12,500", balance: "$0" },
]

const columns = [
  { key: "date", label: "Date" },
  { key: "journal", label: "Journal #" },
  { key: "account", label: "Account" },
  { key: "description", label: "Description" },
  { key: "debit", label: "Debit", className: "text-right" },
  { key: "credit", label: "Credit", className: "text-right" },
  { key: "balance", label: "Balance", className: "text-right" },
]

export default function GeneralLedgerPage() {
  return (
    <OverviewLayout
      title="General Ledger"
      description="View all transactions by account"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Debit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$225,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$33,200</div>
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
            <CardTitle>General Ledger - January 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={ledgerData} />
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
