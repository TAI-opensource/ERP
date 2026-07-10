import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, FileText, ShoppingCart, Users } from "lucide-react"

const stats = [
  { label: "Total Customers", value: "573" },
  { label: "Open Quotations", value: "15" },
  { label: "Pending Orders", value: "7" },
  { label: "Monthly Revenue", value: "$245,000" },
]

const recentOrders = [
  { id: "SO-2024-001", customer: "Acme Corp", date: "2024-01-15", amount: "$12,500", status: "Confirmed" },
  { id: "SO-2024-002", customer: "TechStart Inc", date: "2024-01-14", amount: "$8,750", status: "Pending" },
  { id: "SO-2024-003", customer: "Global Industries", date: "2024-01-13", amount: "$23,000", status: "Shipped" },
  { id: "SO-2024-004", customer: "Local Business Co", date: "2024-01-12", amount: "$4,200", status: "Delivered" },
]

const topCustomers = [
  { name: "Acme Corp", orders: 45, revenue: "$234,000" },
  { name: "TechStart Inc", orders: 32, revenue: "$189,000" },
  { name: "Global Industries", orders: 28, revenue: "$156,000" },
  { name: "Manufacturing Plus", orders: 21, revenue: "$98,000" },
]

export default function SellingPage() {
  return (
    <OverviewLayout
      title="Selling"
      description="Manage customers, quotations, and sales orders"
      actionLabel="New Quotation"
      actionHref="/selling/quotations/new"
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{o.id}</p>
                    <p className="text-xs text-muted-foreground">{o.customer} • {o.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{o.amount}</p>
                    <p className={`text-xs ${o.status === "Delivered" ? "text-emerald-500" : o.status === "Pending" ? "text-yellow-500" : "text-blue-500"}`}>{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.orders} orders</p>
                  </div>
                  <p className="text-sm font-medium">{c.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
