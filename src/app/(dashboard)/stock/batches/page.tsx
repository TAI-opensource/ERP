"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const batches = [
  { id: "BATCH-001", item: "Widget Alpha", manufactureDate: "2024-01-10", expiryDate: "2025-01-10", qty: 500, available: 150, warehouse: "Warehouse A", status: "Active" },
  { id: "BATCH-002", item: "Component X1", manufactureDate: "2024-01-08", expiryDate: "2025-01-08", qty: 1000, available: 342, warehouse: "Warehouse B", status: "Active" },
  { id: "BATCH-003", item: "Motor Assembly", manufactureDate: "2024-01-05", expiryDate: "2025-01-05", qty: 100, available: 45, warehouse: "Warehouse A", status: "Active" },
  { id: "BATCH-004", item: "Bracket Assembly", manufactureDate: "2023-12-20", expiryDate: "2024-12-20", qty: 2000, available: 567, warehouse: "Warehouse C", status: "Active" },
  { id: "BATCH-005", item: "Widget Beta", manufactureDate: "2023-11-15", expiryDate: "2024-11-15", qty: 300, available: 89, warehouse: "Warehouse A", status: "Expiring Soon" },
  { id: "BATCH-006", item: "Control Unit", manufactureDate: "2023-10-01", expiryDate: "2024-10-01", qty: 50, available: 3, warehouse: "Warehouse B", status: "Expired" },
]

const columns = [
  { key: "id", label: "Batch #" },
  { key: "item", label: "Item" },
  { key: "manufactureDate", label: "Mfg Date" },
  { key: "expiryDate", label: "Expiry Date" },
  { key: "qty", label: "Qty", className: "text-right" },
  { key: "available", label: "Available", className: "text-right" },
  { key: "warehouse", label: "Warehouse" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function BatchesPage() {
  return (
    <OverviewLayout
      title="Batch Tracking"
      description="Track inventory batches and expiry dates"
      actionLabel="New Batch"
      actionHref="/stock/batches/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={batches} />
      </div>
    </OverviewLayout>
  )
}
