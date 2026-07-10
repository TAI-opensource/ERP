"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const salesReports = [
  { id: "RPT-001", name: "Daily Sales Summary", period: "2024-01-15", generated: "2024-01-15", status: "Generated" },
  { id: "RPT-002", name: "Weekly Sales Report", period: "Jan 8-14, 2024", generated: "2024-01-14", status: "Generated" },
  { id: "RPT-003", name: "Monthly Sales by Customer", period: "January 2024", generated: "2024-01-15", status: "Generated" },
  { id: "RPT-004", name: "Product Performance", period: "January 2024", generated: "2024-01-15", status: "Generated" },
  { id: "RPT-005", name: "Sales by Region", period: "January 2024", generated: "2024-01-15", status: "Pending" },
  { id: "RPT-006", name: "Commission Report", period: "January 2024", generated: "2024-01-15", status: "Pending" },
]

const columns = [
  { key: "id", label: "Report #" },
  { key: "name", label: "Report Name" },
  { key: "period", label: "Period" },
  { key: "generated", label: "Generated Date" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Total Sales", value: "$458,200" },
  { label: "Orders", value: "342" },
  { label: "Avg Order Value", value: "$1,339" },
  { label: "Growth", value: "+15.3%" },
]

export default function SellingReportsPage() {
  return (
    <OverviewLayout
      title="Sales Reports"
      description="Analyze sales performance and trends"
      actionLabel="Generate Report"
      actionHref="/selling/reports/new"
      stats={summaryStats}
    >
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Acme Corp", orders: 28, total: "$89,500" },
                { name: "Global Industries", orders: 15, total: "$67,200" },
                { name: "TechStart Inc", orders: 22, total: "$45,800" },
                { name: "Manufacturing Plus", orders: 18, total: "$38,400" },
                { name: "Retail Chain", orders: 32, total: "$34,100" },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{c.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{c.orders} orders</span>
                  </div>
                  <span className="text-sm font-medium">{c.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Product A", quantity: 156, revenue: "$78,000" },
                { name: "Product B", quantity: 98, revenue: "$49,000" },
                { name: "Product C", quantity: 87, revenue: "$60,900" },
                { name: "Product D", quantity: 72, revenue: "$21,600" },
                { name: "Product E", quantity: 65, revenue: "$32,500" },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{p.quantity} units</span>
                  </div>
                  <span className="text-sm font-medium">{p.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={salesReports} />
      </div>
    </OverviewLayout>
  )
}
