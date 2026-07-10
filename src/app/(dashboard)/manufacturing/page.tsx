import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Factory, Settings, CheckCircle, Clock } from "lucide-react"

const stats = [
  { label: "Active Work Orders", value: "12" },
  { label: "BOMs Defined", value: "45" },
  { label: "Completed This Month", value: "28" },
  { label: "Workstations", value: "8" },
]

const workOrders = [
  { id: "WO-2024-001", item: "Widget Alpha", qty: 500, startDate: "2024-01-15", endDate: "2024-01-20", progress: 75, status: "In Progress" },
  { id: "WO-2024-002", item: "Component X1", qty: 1000, startDate: "2024-01-14", endDate: "2024-01-22", progress: 45, status: "In Progress" },
  { id: "WO-2024-003", item: "Motor Assembly", qty: 100, startDate: "2024-01-13", endDate: "2024-01-18", progress: 100, status: "Completed" },
  { id: "WO-2024-004", item: "Bracket Assembly", qty: 2000, startDate: "2024-01-16", endDate: "2024-01-25", progress: 0, status: "Planned" },
]

const workstations = [
  { name: "Assembly Line 1", status: "Active", utilization: "85%" },
  { name: "Assembly Line 2", status: "Active", utilization: "72%" },
  { name: "CNC Machine", status: "Maintenance", utilization: "0%" },
  { name: "Paint Shop", status: "Active", utilization: "68%" },
]

export default function ManufacturingPage() {
  return (
    <OverviewLayout
      title="Manufacturing"
      description="Manage work orders, BOMs, and production"
      actionLabel="New Work Order"
      actionHref="/manufacturing/work-orders/new"
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workOrders.map((wo) => (
                <div key={wo.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{wo.id} - {wo.item}</p>
                      <p className="text-xs text-muted-foreground">Qty: {wo.qty} • {wo.startDate} to {wo.endDate}</p>
                    </div>
                    <span className={`text-xs ${wo.status === "Completed" ? "text-emerald-500" : wo.status === "In Progress" ? "text-blue-500" : "text-muted-foreground"}`}>{wo.status}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${wo.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workstations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workstations.map((ws) => (
                <div key={ws.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{ws.name}</p>
                    <p className={`text-xs ${ws.status === "Active" ? "text-emerald-500" : "text-yellow-500"}`}>{ws.status}</p>
                  </div>
                  <p className="text-sm font-medium">{ws.utilization}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
