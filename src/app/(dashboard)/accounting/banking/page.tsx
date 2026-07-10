"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const bankAccounts = [
  { id: "BANK-001", name: "Main Operating Account", bank: "Chase Bank", accountNumber: "****4521", balance: "$245,000", currency: "USD", status: "Active" },
  { id: "BANK-002", name: "Savings Account", bank: "Bank of America", accountNumber: "****7832", balance: "$128,000", currency: "USD", status: "Active" },
  { id: "BANK-003", name: "Petty Cash", bank: "Cash", accountNumber: "-", balance: "$2,500", currency: "USD", status: "Active" },
]

const recentTransactions = [
  { date: "2024-01-15", description: "Payment from Acme Corp", account: "Main Operating", type: "Credit", amount: "$12,500", balance: "$245,000", status: "Cleared" },
  { date: "2024-01-14", description: "Office rent payment", account: "Main Operating", type: "Debit", amount: "$3,000", balance: "$232,500", status: "Cleared" },
  { date: "2024-01-13", description: "Supplier payment", account: "Main Operating", type: "Debit", amount: "$8,200", balance: "$235,500", status: "Pending" },
  { date: "2024-01-12", description: "Salary disbursement", account: "Main Operating", type: "Debit", amount: "$45,000", balance: "$243,700", status: "Cleared" },
]

const transactionColumns = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "account", label: "Account" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "balance", label: "Balance", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function BankingPage() {
  return (
    <OverviewLayout
      title="Banking"
      description="Manage bank accounts and transactions"
      actionLabel="New Transaction"
      actionHref="/accounting/banking/transactions"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$375,500</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+$4,300</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {bankAccounts.map((acc) => (
            <Card key={acc.id}>
              <CardHeader>
                <CardTitle className="text-sm">{acc.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{acc.balance}</div>
                <p className="text-xs text-muted-foreground">{acc.bank} - {acc.accountNumber}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={transactionColumns} data={recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
