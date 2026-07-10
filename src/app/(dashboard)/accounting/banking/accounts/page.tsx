"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const bankAccounts = [
  { id: "BANK-001", name: "Main Operating Account", bank: "Chase Bank", accountNumber: "****4521", balance: "$245,000", currency: "USD", status: "Active" },
  { id: "BANK-002", name: "Savings Account", bank: "Bank of America", accountNumber: "****7832", balance: "$128,000", currency: "USD", status: "Active" },
  { id: "BANK-003", name: "Petty Cash", bank: "Cash", accountNumber: "-", balance: "$2,500", currency: "USD", status: "Active" },
  { id: "BANK-004", name: "Payroll Account", bank: "Wells Fargo", accountNumber: "****9103", balance: "$50,000", currency: "USD", status: "Active" },
]

const columns = [
  { key: "name", label: "Account Name" },
  { key: "bank", label: "Bank" },
  { key: "accountNumber", label: "Account Number" },
  { key: "balance", label: "Balance", className: "text-right" },
  { key: "currency", label: "Currency" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function BankAccountsPage() {
  return (
    <OverviewLayout
      title="Bank Accounts"
      description="Manage your bank accounts and balances"
      actionLabel="New Account"
      actionHref="/accounting/banking/accounts/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={bankAccounts} />
      </div>
    </OverviewLayout>
  )
}
