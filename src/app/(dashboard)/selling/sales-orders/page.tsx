"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const salesOrders = [
  { id: "SO-2024-001", customer: "Acme Corp", date: "2024-01-15", deliveryDate: "2024-01-25", amount: "$12,500", status: "Confirmed" },
  { id: "SO-2024-002", customer: "TechStart Inc", date: "2024-01-14", deliveryDate: "2024-01-24", amount: "$8,750", status: "Pending" },
  { id: "SO-2024-003", customer: "Global Industries", date: "2024-01-13", deliveryDate: "2024-01-23", amount: "$23,000", status: "Shipped" },
  { id: "SO-2024-004", customer: "Local Business Co", date: "2024-01-12", deliveryDate: "2024-01-22", amount: "$4,200", status: "Delivered" },
  { id: "SO-2024-005", customer: "Manufacturing Plus", date: "2024-01-11", deliveryDate: "2024-01-21", amount: "$15,800", status: "Confirmed" },
  { id: "SO-2024-006", customer: "Retail Chain", date: "2024-01-10", deliveryDate: "2024-01-20", amount: "$6,300", status: "Draft" },
  { id: "SO-2024-007", customer: "Acme Corp", date: "2024-01-09", deliveryDate: "2024-01-19", amount: "$9,100", status: "Delivered" },
]

const columns = [
  { key: "id", label: "Order #" },
  { key: "customer", label: "Customer" },
  { key: "date", label: "Order Date" },
  { key: "deliveryDate", label: "Delivery Date" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function SalesOrdersPage() {
  return (
    <OverviewLayout
      title="Sales Orders"
      description="Track and manage customer orders"
      actionLabel="New Order"
      actionHref="/selling/sales-orders/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={salesOrders} />
      </div>
    </OverviewLayout>
  )
}
