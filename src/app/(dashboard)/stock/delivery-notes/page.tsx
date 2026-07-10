"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const deliveryNotes = [
  { id: "DN-001", customer: "Acme Corp", salesOrder: "SO-2024-001", date: "2024-01-15", items: 5, driver: "James Wilson", vehicle: "TRK-001", status: "Delivered" },
  { id: "DN-002", customer: "TechStart Inc", salesOrder: "SO-2024-002", date: "2024-01-14", items: 3, driver: "Robert Brown", vehicle: "TRK-002", status: "In Transit" },
  { id: "DN-003", customer: "Global Industries", salesOrder: "SO-2024-003", date: "2024-01-14", items: 8, driver: "James Wilson", vehicle: "TRK-001", status: "Delivered" },
  { id: "DN-004", customer: "Local Business Co", salesOrder: "SO-2024-004", date: "2024-01-13", items: 2, driver: "Mike Davis", vehicle: "VAN-001", status: "Delivered" },
  { id: "DN-005", customer: "Manufacturing Plus", salesOrder: "SO-2024-005", date: "2024-01-13", items: 6, driver: "Robert Brown", vehicle: "TRK-002", status: "Pending" },
  { id: "DN-006", customer: "Retail Chain", salesOrder: "SO-2024-006", date: "2024-01-12", items: 4, driver: "James Wilson", vehicle: "TRK-001", status: "Pending" },
]

const columns = [
  { key: "id", label: "Delivery #" },
  { key: "customer", label: "Customer" },
  { key: "salesOrder", label: "Sales Order" },
  { key: "date", label: "Delivery Date" },
  { key: "items", label: "Items", className: "text-right" },
  { key: "driver", label: "Driver" },
  { key: "vehicle", label: "Vehicle" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Pending Deliveries", value: "2" },
  { label: "In Transit", value: "1" },
  { label: "Delivered Today", value: "3" },
  { label: "Total Items", value: "28" },
]

export default function DeliveryNotesPage() {
  return (
    <OverviewLayout
      title="Delivery Notes"
      description="Track deliveries and proof of delivery"
      actionLabel="New Delivery Note"
      actionHref="/stock/delivery-notes/new"
      stats={summaryStats}
    >
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today&apos;s Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Currently on the road</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completed This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Successful deliveries</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={deliveryNotes} />
      </div>
    </OverviewLayout>
  )
}
