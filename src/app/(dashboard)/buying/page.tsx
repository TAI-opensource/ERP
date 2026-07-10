import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Users, FileText, DollarSign } from "lucide-react"

const stats = [
  { label: "Total Suppliers", value: "89" },
  { label: "Open Purchase Orders", value: "5" },
  { label: "Pending Invoices", value: "12" },
  { label: "Monthly Spend", value: "$156,000" },
]

const recentOrders = [
  { id: "PO-2024-001", supplier: "Supplier Alpha", date: "2024-01-15", amount: "$8,200", status: "Pending" },
  { id: "PO-2024-002", supplier: "Parts Unlimited", date: "2024-01-14", amount: "$15,500", status: "Approved" },
  { id: "PO-2024-003", supplier: "Component Co", date: "2024-01-13", amount: "$4,800", status: "Received" },
  { id: "PO-2024-004", supplier: "Material Masters", date: "2024-01-12", amount: "$22,000", status: "Pending" },
]

const topSuppliers = [
  { name: "Supplier Alpha", orders: 34, spend: "$189,000" },
  { name: "Parts Unlimited", orders: 28, spend: "$156,000" },
  { name: "Component Co", orders: 22, spend: "$98,000" },
  { name: "Material Masters", orders: 18, spend: "$78,000" },
]

export default function BuyingPage() {
  return (
    <OverviewLayout
      title="Buying"
      description="Manage suppliers, purchase orders, and procurement"
      actionLabel="New Purchase Order"
      actionHref="/buying/purchase-orders/new"
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{o.id}</p>
                    <p className="text-xs text-muted-foreground">{o.supplier} • {o.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{o.amount}</p>
                    <p className={`text-xs ${o.status === "Received" ? "text-emerald-500" : o.status === "Pending" ? "text-yellow-500" : "text-blue-500"}`}>{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSuppliers.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.orders} orders</p>
                  </div>
                  <p className="text-sm font-medium">{s.spend}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
