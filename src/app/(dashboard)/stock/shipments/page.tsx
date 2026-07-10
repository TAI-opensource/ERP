"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const shipments = [
  { id: "SHP-001", customer: "Acme Corp", salesOrder: "SO-2024-001", carrier: "FedEx", tracking: "FX123456789", date: "2024-01-15", eta: "2024-01-18", status: "Shipped" },
  { id: "SHP-002", customer: "TechStart Inc", salesOrder: "SO-2024-002", carrier: "UPS", tracking: "UPS987654321", date: "2024-01-14", eta: "2024-01-17", status: "In Transit" },
  { id: "SHP-003", customer: "Global Industries", salesOrder: "SO-2024-003", carrier: "DHL", tracking: "DHL456789123", date: "2024-01-14", eta: "2024-01-19", status: "Shipped" },
  { id: "SHP-004", customer: "Local Business Co", salesOrder: "SO-2024-004", carrier: "USPS", tracking: "USPS789123456", date: "2024-01-13", eta: "2024-01-16", status: "Delivered" },
  { id: "SHP-005", customer: "Manufacturing Plus", salesOrder: "SO-2024-005", carrier: "FedEx", tracking: "FX321654987", date: "2024-01-13", eta: "2024-01-16", status: "Pending" },
  { id: "SHP-006", customer: "Retail Chain", salesOrder: "SO-2024-006", carrier: "UPS", tracking: "UPS654987321", date: "2024-01-12", eta: "2024-01-15", status: "Delivered" },
]

const columns = [
  { key: "id", label: "Shipment #" },
  { key: "customer", label: "Customer" },
  { key: "salesOrder", label: "Sales Order" },
  { key: "carrier", label: "Carrier" },
  { key: "tracking", label: "Tracking #" },
  { key: "date", label: "Ship Date" },
  { key: "eta", label: "ETA" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Pending Shipments", value: "1" },
  { label: "In Transit", value: "2" },
  { label: "Delivered", value: "2" },
  { label: "Total Shipments", value: "6" },
]

export default function ShipmentsPage() {
  return (
    <OverviewLayout
      title="Shipments"
      description="Track shipments and manage carrier integrations"
      actionLabel="New Shipment"
      actionHref="/stock/shipments/new"
      stats={summaryStats}
    >
      <div className="grid gap-6 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">FedEx</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Active shipments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">UPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Active shipments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">DHL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Active shipments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">USPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Active shipments</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={shipments} />
      </div>
    </OverviewLayout>
  )
}
