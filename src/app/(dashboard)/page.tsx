import { MetricCard } from "@/components/erp/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Activity } from "lucide-react"

const metrics = [
  { title: "Total Revenue", value: "$45,231.89", change: 20.1, icon: <DollarSign className="size-4" /> },
  { title: "Sales Orders", value: "235", change: 12.5, icon: <ShoppingCart className="size-4" /> },
  { title: "Inventory Items", value: "1,234", change: -2.3, icon: <Package className="size-4" /> },
  { title: "Active Customers", value: "573", change: 8.1, icon: <Users className="size-4" /> },
]

const recentActivity = [
  { module: "Sales", action: "New order #SO-2024-001", time: "2 min ago", status: "completed" },
  { module: "Stock", action: "Item received at Warehouse A", time: "15 min ago", status: "completed" },
  { module: "Accounting", action: "Journal entry #JE-0042 posted", time: "1 hour ago", status: "completed" },
  { module: "Buying", action: "PO #PO-2024-003 pending approval", time: "2 hours ago", status: "pending" },
  { module: "HR", action: "Employee check-in recorded", time: "3 hours ago", status: "completed" },
  { module: "CRM", action: "Lead 'Acme Corp' assigned", time: "5 hours ago", status: "open" },
]

const moduleSummary = [
  { name: "Accounting", items: ["12 pending invoices", "3 unposted journals"], color: "bg-blue-500" },
  { name: "Stock", items: ["8 items low stock", "2 warehouses active"], color: "bg-green-500" },
  { name: "Selling", items: ["15 open quotations", "7 draft orders"], color: "bg-purple-500" },
  { name: "Buying", items: ["5 pending POs", "2 awaiting delivery"], color: "bg-orange-500" },
  { name: "HR", items: ["47 employees", "2 pending leave"], color: "bg-pink-500" },
  { name: "CRM", items: ["23 open leads", "5 deals pipeline"], color: "bg-cyan-500" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here&apos;s your business overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {a.module.slice(0, 2)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${a.status === "completed" ? "bg-emerald-500" : a.status === "pending" ? "bg-yellow-500" : "bg-blue-500"}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleSummary.map((m) => (
                <div key={m.name} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${m.color}`} />
                    <span className="text-sm font-medium">{m.name}</span>
                  </div>
                  {m.items.map((item) => (
                    <p key={item} className="pl-4 text-xs text-muted-foreground">{item}</p>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
