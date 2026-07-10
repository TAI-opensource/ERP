"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stockReports = [
  { id: "RPT-001", name: "Stock Balance Report", period: "January 2024", generated: "2024-01-15", status: "Generated" },
  { id: "RPT-002", name: "Stock Movement Report", period: "January 2024", generated: "2024-01-15", status: "Generated" },
  { id: "RPT-003", name: "Slow Moving Items", period: "January 2024", generated: "2024-01-15", status: "Generated" },
  { id: "RPT-004", name: "Stock Valuation", period: "January 2024", generated: "2024-01-15", status: "Generated" },
  { id: "RPT-005", name: "Warehouse Utilization", period: "January 2024", generated: "2024-01-15", status: "Pending" },
  { id: "RPT-006", name: "Reorder Report", period: "January 2024", generated: "2024-01-15", status: "Pending" },
]

const columns = [
  { key: "id", label: "Report #" },
  { key: "name", label: "Report Name" },
  { key: "period", label: "Period" },
  { key: "generated", label: "Generated Date" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Total Items", value: "1,234" },
  { label: "Total Value", value: "$892,000" },
  { label: "Low Stock Items", value: "12" },
  { label: "Warehouses", value: "3" },
]

export default function StockReportsPage() {
  return (
    <OverviewLayout
      title="Stock Reports"
      description="Analyze inventory levels and stock movements"
      actionLabel="Generate Report"
      actionHref="/stock/reports/new"
      stats={summaryStats}
    >
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Raw Materials", items: 456, value: "$234,000" },
                { name: "Finished Goods", items: 312, value: "$456,000" },
                { name: "Work in Progress", items: 78, value: "$89,000" },
                { name: "Spare Parts", items: 388, value: "$113,000" },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{c.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{c.items} items</span>
                  </div>
                  <span className="text-sm font-medium">{c.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Items by Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Component A", quantity: 150, value: "$45,000" },
                { name: "Component B", quantity: 230, value: "$34,500" },
                { name: "Raw Material C", quantity: 500, value: "$25,000" },
                { name: "Assembly D", quantity: 80, value: "$24,000" },
                { name: "Part E", quantity: 320, value: "$19,200" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{item.quantity} units</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={stockReports} />
      </div>
    </OverviewLayout>
  )
}
