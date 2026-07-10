"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const salesInvoices = [
  { id: "INV-2024-001", customer: "Acme Corp", date: "2024-01-15", dueDate: "2024-02-15", amount: "$12,500", paid: "$12,500", outstanding: "$0", status: "Paid" },
  { id: "INV-2024-002", customer: "TechStart Inc", date: "2024-01-14", dueDate: "2024-02-14", amount: "$8,750", paid: "$3,000", outstanding: "$5,750", status: "Partly Paid" },
  { id: "INV-2024-003", customer: "Global Industries", date: "2024-01-13", dueDate: "2024-02-13", amount: "$23,000", paid: "$23,000", outstanding: "$0", status: "Paid" },
  { id: "INV-2024-004", customer: "Local Business Co", date: "2024-01-12", dueDate: "2024-01-12", amount: "$4,200", paid: "$0", outstanding: "$4,200", status: "Overdue" },
  { id: "INV-2024-005", customer: "Manufacturing Plus", date: "2024-01-11", dueDate: "2024-02-11", amount: "$15,800", paid: "$0", outstanding: "$15,800", status: "Unpaid" },
  { id: "INV-2024-006", customer: "Retail Chain", date: "2024-01-10", dueDate: "2024-02-10", amount: "$6,300", paid: "$6,300", outstanding: "$0", status: "Paid" },
  { id: "INV-2024-007", customer: "Acme Corp", date: "2024-01-09", dueDate: "2024-02-09", amount: "$9,100", paid: "$0", outstanding: "$9,100", status: "Unpaid" },
]

const columns = [
  { key: "id", label: "Invoice #" },
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "dueDate", label: "Due Date" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "paid", label: "Paid", className: "text-right" },
  { key: "outstanding", label: "Outstanding", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function SalesInvoicesPage() {
  return (
    <OverviewLayout
      title="Sales Invoices"
      description="Manage customer invoices and payments"
      actionLabel="New Invoice"
      actionHref="/accounting/sales-invoices/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={salesInvoices} />
      </div>
    </OverviewLayout>
  )
}
