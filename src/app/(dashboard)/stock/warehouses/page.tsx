"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const warehouses = [
  { code: "WH-A", name: "Warehouse A - Main", address: "123 Industrial Blvd, Chicago, IL", manager: "Robert Johnson", items: 456, capacity: "78%", status: "Active" },
  { code: "WH-B", name: "Warehouse B - East", address: "456 Commerce Dr, Detroit, MI", manager: "Sarah Williams", items: 312, capacity: "62%", status: "Active" },
  { code: "WH-C", name: "Warehouse C - West", address: "789 Logistics Ave, Denver, CO", manager: "Michael Brown", items: 466, capacity: "85%", status: "Active" },
  { code: "WH-D", name: "Warehouse D - South", address: "321 Storage Ln, Atlanta, GA", manager: "-", items: 0, capacity: "0%", status: "Inactive" },
]

const columns = [
  { key: "code", label: "Code" },
  { key: "name", label: "Warehouse Name" },
  { key: "address", label: "Address" },
  { key: "manager", label: "Manager" },
  { key: "items", label: "Items", className: "text-right" },
  { key: "capacity", label: "Capacity", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function WarehousesPage() {
  return (
    <OverviewLayout
      title="Warehouse Management"
      description="Manage warehouse locations and capacity"
      actionLabel="New Warehouse"
      actionHref="/stock/warehouses/new"
    >
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {warehouses.filter(w => w.status === "Active").map((w) => (
          <Card key={w.code}>
            <CardHeader>
              <CardTitle className="text-sm">{w.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: w.capacity }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{w.items} items</span>
                  <span>{w.capacity} capacity</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={warehouses} />
      </div>
    </OverviewLayout>
  )
}
