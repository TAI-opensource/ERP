"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const workOrders = [
  { id: "WO-2024-001", item: "Widget Alpha", bom: "BOM-001", qty: 500, startDate: "2024-01-15", endDate: "2024-01-20", progress: 75, status: "In Progress" },
  { id: "WO-2024-002", item: "Component X1", bom: "BOM-002", qty: 1000, startDate: "2024-01-14", endDate: "2024-01-22", progress: 45, status: "In Progress" },
  { id: "WO-2024-003", item: "Motor Assembly", bom: "BOM-003", qty: 100, startDate: "2024-01-13", endDate: "2024-01-18", progress: 100, status: "Completed" },
  { id: "WO-2024-004", item: "Bracket Assembly", bom: "BOM-004", qty: 2000, startDate: "2024-01-16", endDate: "2024-01-25", progress: 0, status: "Planned" },
  { id: "WO-2024-005", item: "Control Unit", bom: "BOM-005", qty: 50, startDate: "2024-01-18", endDate: "2024-01-28", progress: 0, status: "Draft" },
  { id: "WO-2024-006", item: "Widget Alpha", bom: "BOM-001", qty: 300, startDate: "2024-01-10", endDate: "2024-01-15", progress: 100, status: "Completed" },
]

const columns = [
  { key: "id", label: "WO #" },
  { key: "item", label: "Item" },
  { key: "bom", label: "BOM" },
  { key: "qty", label: "Qty", className: "text-right" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "progress", label: "Progress", className: "text-right", render: (item: Record<string, unknown>) => (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${item.progress as number}%` }} />
      </div>
      <span className="text-xs">{item.progress as number}%</span>
    </div>
  )},
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function WorkOrdersPage() {
  return (
    <OverviewLayout
      title="Work Orders"
      description="Create and manage manufacturing work orders"
      actionLabel="New Work Order"
      actionHref="/manufacturing/work-orders/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={workOrders} />
      </div>
    </OverviewLayout>
  )
}
