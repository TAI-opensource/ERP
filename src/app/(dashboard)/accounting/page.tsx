import { OverviewLayout } from "@/components/erp/overview-layout"
import { MetricCard } from "@/components/erp/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, TrendingUp, AlertCircle } from "lucide-react"

const stats = [
  { label: "Total Revenue", value: "$1,245,000" },
  { label: "Total Expenses", value: "$892,000" },
  { label: "Net Profit", value: "$353,000" },
  { label: "Pending Invoices", value: "12" },
]

const recentJournals = [
  { id: "JE-0045", date: "2024-01-15", accounts: "Cash / Sales Revenue", debit: "$5,000", credit: "$5,000", status: "Posted" },
  { id: "JE-0044", date: "2024-01-14", accounts: "Accounts Receivable / Sales Revenue", debit: "$12,500", credit: "$12,500", status: "Posted" },
  { id: "JE-0043", date: "2024-01-13", accounts: "Inventory / Accounts Payable", debit: "$8,200", credit: "$8,200", status: "Draft" },
  { id: "JE-0042", date: "2024-01-12", accounts: "Salary Expense / Cash", debit: "$45,000", credit: "$45,000", status: "Posted" },
]

export default function AccountingPage() {
  return (
    <OverviewLayout
      title="Accounting"
      description="Manage your financial records and transactions"
      actionLabel="New Journal Entry"
      actionHref="/accounting/journal-entries/new"
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Journal Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentJournals.map((j) => (
                <div key={j.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{j.id}</p>
                    <p className="text-xs text-muted-foreground">{j.accounts}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{j.debit}</p>
                    <p className={`text-xs ${j.status === "Posted" ? "text-emerald-500" : "text-yellow-500"}`}>{j.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Cash & Bank", balance: "$245,000" },
                { name: "Accounts Receivable", balance: "$128,000" },
                { name: "Inventory", balance: "$89,000" },
                { name: "Accounts Payable", balance: "$67,000" },
                { name: "Sales Revenue", balance: "$1,245,000" },
                { name: "Cost of Goods Sold", balance: "$534,000" },
              ].map((a) => (
                <div key={a.name} className="flex items-center justify-between">
                  <span className="text-sm">{a.name}</span>
                  <span className="text-sm font-medium">{a.balance}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
