import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Wrench, DollarSign, Calendar } from "lucide-react"

const stats = [
  { label: "Total Assets", value: "156" },
  { label: "Active", value: "142" },
  { label: "Under Maintenance", value: "8" },
  { label: "Total Value", value: "$2,450,000" },
]

const assetCategories = [
  { name: "Office Equipment", count: 45, value: "$234,000" },
  { name: "IT Hardware", count: 67, value: "$567,000" },
  { name: "Vehicles", count: 12, value: "$890,000" },
  { name: "Machinery", count: 23, value: "$543,000" },
  { name: "Furniture", count: 9, value: "$216,000" },
]

const maintenanceSchedule = [
  { asset: "Server Room AC", type: "Preventive", dueDate: "2024-01-18", status: "Scheduled" },
  { asset: "Company Vehicle #3", type: "Service", dueDate: "2024-01-20", status: "Scheduled" },
  { asset: "CNC Machine", type: "Repair", dueDate: "2024-01-15", status: "In Progress" },
  { asset: "Office Printer Fleet", type: "Inspection", dueDate: "2024-01-22", status: "Scheduled" },
]

export default function AssetsPage() {
  return (
    <OverviewLayout
      title="Assets"
      description="Track and manage company assets"
      actionLabel="Add Asset"
      actionHref="/assets/new"
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetCategories.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.count} assets</p>
                  </div>
                  <p className="text-sm font-medium">{c.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenanceSchedule.map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{m.asset}</p>
                    <p className="text-xs text-muted-foreground">{m.type} • Due: {m.dueDate}</p>
                  </div>
                  <span className={`text-xs ${m.status === "In Progress" ? "text-blue-500" : "text-muted-foreground"}`}>{m.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
