"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const purchaseOrders = [
  { id: "PO-2024-001", supplier: "Supplier Alpha", date: "2024-01-15", requiredDate: "2024-01-25", amount: "$8,200", status: "Pending" },
  { id: "PO-2024-002", supplier: "Parts Unlimited", date: "2024-01-14", requiredDate: "2024-01-24", amount: "$15,500", status: "Approved" },
  { id: "PO-2024-003", supplier: "Component Co", date: "2024-01-13", requiredDate: "2024-01-23", amount: "$4,800", status: "Received" },
  { id: "PO-2024-004", supplier: "Material Masters", date: "2024-01-12", requiredDate: "2024-01-22", amount: "$22,000", status: "Pending" },
  { id: "PO-2024-005", supplier: "Electro Parts", date: "2024-01-11", requiredDate: "2024-01-21", amount: "$5,300", status: "Approved" },
  { id: "PO-2024-006", supplier: "Supplier Alpha", date: "2024-01-10", requiredDate: "2024-01-20", amount: "$11,400", status: "Draft" },
]

const columns = [
  { key: "id", label: "PO #" },
  { key: "supplier", label: "Supplier" },
  { key: "date", label: "Order Date" },
  { key: "requiredDate", label: "Required By" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function PurchaseOrdersPage() {
  return (
    <OverviewLayout
      title="Purchase Orders"
      description="Create and manage purchase orders"
      actionLabel="New Purchase Order"
      actionHref="/buying/purchase-orders/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={purchaseOrders} />
      </div>
    </OverviewLayout>
  )
}
