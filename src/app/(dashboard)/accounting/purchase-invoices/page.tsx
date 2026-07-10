"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const purchaseInvoices = [
  { id: "PINV-2024-001", supplier: "Supplier Alpha", date: "2024-01-15", dueDate: "2024-02-15", amount: "$8,200", paid: "$8,200", outstanding: "$0", status: "Paid" },
  { id: "PINV-2024-002", supplier: "Parts Unlimited", date: "2024-01-14", dueDate: "2024-02-14", amount: "$15,500", paid: "$15,500", outstanding: "$0", status: "Paid" },
  { id: "PINV-2024-003", supplier: "Component Co", date: "2024-01-13", dueDate: "2024-02-13", amount: "$4,800", paid: "$0", outstanding: "$4,800", status: "Unpaid" },
  { id: "PINV-2024-004", supplier: "Material Masters", date: "2024-01-12", dueDate: "2024-01-12", amount: "$22,000", paid: "$0", outstanding: "$22,000", status: "Overdue" },
  { id: "PINV-2024-005", supplier: "Electro Parts", date: "2024-01-11", dueDate: "2024-02-11", amount: "$5,300", paid: "$2,000", outstanding: "$3,300", status: "Partly Paid" },
  { id: "PINV-2024-006", supplier: "Supplier Alpha", date: "2024-01-10", dueDate: "2024-02-10", amount: "$11,400", paid: "$0", outstanding: "$11,400", status: "Unpaid" },
]

const columns = [
  { key: "id", label: "Invoice #" },
  { key: "supplier", label: "Supplier" },
  { key: "date", label: "Date" },
  { key: "dueDate", label: "Due Date" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "paid", label: "Paid", className: "text-right" },
  { key: "outstanding", label: "Outstanding", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function PurchaseInvoicesPage() {
  return (
    <OverviewLayout
      title="Purchase Invoices"
      description="Manage supplier invoices and payments"
      actionLabel="New Invoice"
      actionHref="/accounting/purchase-invoices/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={purchaseInvoices} />
      </div>
    </OverviewLayout>
  )
}
