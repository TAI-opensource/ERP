"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const stockEntries = [
  { id: "STE-2024-001", date: "2024-01-15", type: "Material Receipt", item: "Widget Alpha", from: "Supplier Alpha", to: "Warehouse A", qty: 100, status: "Completed" },
  { id: "STE-2024-002", date: "2024-01-14", type: "Stock Transfer", item: "Component X1", from: "Warehouse A", to: "Warehouse B", qty: 50, status: "Completed" },
  { id: "STE-2024-003", date: "2024-01-13", type: "Material Issue", item: "Bracket Assembly", from: "Warehouse C", to: "Production", qty: 200, status: "Completed" },
  { id: "STE-2024-004", date: "2024-01-12", type: "Stock Adjustment", item: "Mounting Plate", from: "Warehouse C", to: "-", qty: -5, status: "Completed" },
  { id: "STE-2024-005", date: "2024-01-11", type: "Material Receipt", item: "Motor Assembly", from: "Supplier Alpha", to: "Warehouse A", qty: 25, status: "Pending" },
  { id: "STE-2024-006", date: "2024-01-10", type: "Repackaging", item: "Widget Beta", from: "Warehouse A", to: "Warehouse A", qty: 30, status: "Draft" },
]

const columns = [
  { key: "id", label: "Entry #" },
  { key: "date", label: "Date" },
  { key: "type", label: "Type" },
  { key: "item", label: "Item" },
  { key: "from", label: "From" },
  { key: "to", label: "To" },
  { key: "qty", label: "Qty", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function StockEntriesPage() {
  return (
    <OverviewLayout
      title="Stock Entries"
      description="Track material receipts, issues, and transfers"
      actionLabel="New Stock Entry"
      actionHref="/stock/stock-entries/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={stockEntries} />
      </div>
    </OverviewLayout>
  )
}
