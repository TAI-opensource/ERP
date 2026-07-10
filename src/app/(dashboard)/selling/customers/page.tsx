"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const customers = [
  { id: "CUST-001", name: "Acme Corp", contact: "John Smith", email: "john@acme.com", phone: "+1 555-0101", city: "New York", outstanding: "$12,500", status: "Active" },
  { id: "CUST-002", name: "TechStart Inc", contact: "Sarah Johnson", email: "sarah@techstart.com", phone: "+1 555-0102", city: "San Francisco", outstanding: "$0", status: "Active" },
  { id: "CUST-003", name: "Global Industries", contact: "Mike Brown", email: "mike@global.com", phone: "+1 555-0103", city: "Chicago", outstanding: "$23,000", status: "Active" },
  { id: "CUST-004", name: "Local Business Co", contact: "Emily Davis", email: "emily@localbiz.com", phone: "+1 555-0104", city: "Houston", outstanding: "$4,200", status: "Active" },
  { id: "CUST-005", name: "Manufacturing Plus", contact: "David Wilson", email: "david@mfgplus.com", phone: "+1 555-0105", city: "Detroit", outstanding: "$0", status: "Active" },
  { id: "CUST-006", name: "Retail Chain", contact: "Lisa Anderson", email: "lisa@retailchain.com", phone: "+1 555-0106", city: "Los Angeles", outstanding: "$8,750", status: "Active" },
  { id: "CUST-007", name: "Old Company", contact: "Tom Miller", email: "tom@oldcompany.com", phone: "+1 555-0107", city: "Boston", outstanding: "$0", status: "Inactive" },
]

const columns = [
  { key: "id", label: "Customer ID" },
  { key: "name", label: "Customer Name" },
  { key: "contact", label: "Contact Person" },
  { key: "email", label: "Email" },
  { key: "city", label: "City" },
  { key: "outstanding", label: "Outstanding", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function CustomersPage() {
  return (
    <OverviewLayout
      title="Customers"
      description="Manage your customer database"
      actionLabel="New Customer"
      actionHref="/selling/customers/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={customers} />
      </div>
    </OverviewLayout>
  )
}
