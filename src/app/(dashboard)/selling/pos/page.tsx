"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const recentTransactions = [
  { id: "TXN-001", customer: "Walk-in Customer", items: 3, total: "$127.50", payment: "Cash", time: "10:45 AM", status: "Completed" },
  { id: "TXN-002", customer: "John Smith", items: 1, total: "$49.99", payment: "Credit Card", time: "10:32 AM", status: "Completed" },
  { id: "TXN-003", customer: "Walk-in Customer", items: 5, total: "$234.00", payment: "Debit Card", time: "10:15 AM", status: "Completed" },
  { id: "TXN-004", customer: "Sarah Johnson", items: 2, total: "$89.50", payment: "Credit Card", time: "09:58 AM", status: "Refunded" },
  { id: "TXN-005", customer: "Walk-in Customer", items: 4, total: "$156.25", payment: "Cash", time: "09:42 AM", status: "Completed" },
]

const popularItems = [
  { name: "Product A", sold: 45, revenue: "$2,250" },
  { name: "Product B", sold: 32, revenue: "$1,280" },
  { name: "Product C", sold: 28, revenue: "$1,960" },
  { name: "Product D", sold: 21, revenue: "$630" },
  { name: "Product E", sold: 18, revenue: "$900" },
]

export default function POSPage() {
  return (
    <OverviewLayout
      title="Point of Sale"
      description="Process sales and manage transactions"
      actionLabel="New Transaction"
      actionHref="/selling/pos/new"
    >
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$657.24</div>
            <p className="text-xs text-muted-foreground mt-1">5 transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$131.45</div>
            <p className="text-xs text-muted-foreground mt-1">3.0 items per transaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15</div>
            <p className="text-xs text-muted-foreground mt-1">Across all transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{t.id}</p>
                    <p className="text-xs text-muted-foreground">{t.customer} • {t.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{t.total}</p>
                    <p className={`text-xs ${t.status === "Completed" ? "text-emerald-500" : "text-yellow-500"}`}>{t.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularItems.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">{i + 1}</span>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{item.revenue}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{item.sold} sold</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
