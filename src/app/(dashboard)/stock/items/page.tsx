"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const items = [
  { sku: "WGT-001", name: "Widget Alpha", category: "Electronics", stock: 150, warehouse: "Warehouse A", price: "$25.00", status: "Active" },
  { sku: "WGT-002", name: "Widget Beta", category: "Electronics", stock: 89, warehouse: "Warehouse A", price: "$32.00", status: "Active" },
  { sku: "CMP-001", name: "Component X1", category: "Parts", stock: 342, warehouse: "Warehouse B", price: "$12.50", status: "Active" },
  { sku: "CMP-002", name: "Component X2", category: "Parts", stock: 12, warehouse: "Warehouse B", price: "$18.75", status: "Low Stock" },
  { sku: "PRT-001", name: "Bracket Assembly", category: "Hardware", stock: 567, warehouse: "Warehouse C", price: "$8.00", status: "Active" },
  { sku: "PRT-002", name: "Mounting Plate", category: "Hardware", stock: 234, warehouse: "Warehouse C", price: "$15.00", status: "Active" },
  { sku: "ASM-001", name: "Motor Assembly", category: "Assemblies", stock: 45, warehouse: "Warehouse A", price: "$125.00", status: "Active" },
  { sku: "ASM-002", name: "Control Unit", category: "Assemblies", stock: 3, warehouse: "Warehouse B", price: "$250.00", status: "Low Stock" },
]

const columns = [
  { key: "sku", label: "SKU" },
  { key: "name", label: "Item Name" },
  { key: "category", label: "Category" },
  { key: "stock", label: "Stock", className: "text-right" },
  { key: "warehouse", label: "Warehouse" },
  { key: "price", label: "Price", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function ItemsPage() {
  return (
    <OverviewLayout
      title="Item Master List"
      description="Manage all inventory items and their details"
      actionLabel="New Item"
      actionHref="/stock/items/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={items} />
      </div>
    </OverviewLayout>
  )
}
