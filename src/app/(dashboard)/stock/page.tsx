import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Warehouse, AlertTriangle, TrendingUp } from "lucide-react"

const stats = [
  { label: "Total Items", value: "1,234" },
  { label: "Active Warehouses", value: "3" },
  { label: "Low Stock Alerts", value: "8" },
  { label: "Stock Value", value: "$892,000" },
]

const warehouseSummary = [
  { name: "Warehouse A - Main", items: 456, value: "$345,000", capacity: "78%" },
  { name: "Warehouse B - East", items: 312, value: "$267,000", capacity: "62%" },
  { name: "Warehouse C - West", items: 466, value: "$280,000", capacity: "85%" },
]

const lowStockItems = [
  { name: "Widget A", sku: "WGT-001", current: 5, minimum: 20, warehouse: "Warehouse A" },
  { name: "Component B", sku: "CMP-002", current: 12, minimum: 50, warehouse: "Warehouse B" },
  { name: "Part C", sku: "PRT-003", current: 3, minimum: 15, warehouse: "Warehouse A" },
  { name: "Assembly D", sku: "ASM-004", current: 8, minimum: 25, warehouse: "Warehouse C" },
]

export default function StockPage() {
  return (
    <OverviewLayout
      title="Stock Management"
      description="Manage inventory items and warehouse operations"
      actionLabel="New Item"
      actionHref="/stock/items/new"
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouseSummary.map((w) => (
                <div key={w.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{w.name}</span>
                    <span className="text-sm text-muted-foreground">{w.items} items</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: w.capacity }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{w.value}</span>
                    <span>{w.capacity} capacity</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-yellow-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.sku} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sku} • {item.warehouse}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-500">{item.current} units</p>
                    <p className="text-xs text-muted-foreground">Min: {item.minimum}</p>
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
