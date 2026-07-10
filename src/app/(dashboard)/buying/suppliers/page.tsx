"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const suppliers = [
  { id: "SUP-001", name: "Supplier Alpha", contact: "James Wilson", email: "james@supplieralpha.com", phone: "+1 555-0201", city: "Chicago", outstanding: "$8,200", status: "Active" },
  { id: "SUP-002", name: "Parts Unlimited", contact: "Maria Garcia", email: "maria@partsunlimited.com", phone: "+1 555-0202", city: "Houston", outstanding: "$15,500", status: "Active" },
  { id: "SUP-003", name: "Component Co", contact: "Robert Lee", email: "robert@componentco.com", phone: "+1 555-0203", city: "Dallas", outstanding: "$0", status: "Active" },
  { id: "SUP-004", name: "Material Masters", contact: "Jennifer Chen", email: "jennifer@materialmasters.com", phone: "+1 555-0204", city: "San Jose", outstanding: "$22,000", status: "Active" },
  { id: "SUP-005", name: "Electro Parts", contact: "Andrew Kim", email: "andrew@electroparts.com", phone: "+1 555-0205", city: "Seattle", outstanding: "$5,300", status: "Active" },
  { id: "SUP-006", name: "Legacy Suppliers", contact: "Patricia Moore", email: "patricia@legacysuppliers.com", phone: "+1 555-0206", city: "Phoenix", outstanding: "$0", status: "Inactive" },
]

const columns = [
  { key: "id", label: "Supplier ID" },
  { key: "name", label: "Supplier Name" },
  { key: "contact", label: "Contact Person" },
  { key: "email", label: "Email" },
  { key: "city", label: "City" },
  { key: "outstanding", label: "Outstanding", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function SuppliersPage() {
  return (
    <OverviewLayout
      title="Suppliers"
      description="Manage your supplier database"
      actionLabel="New Supplier"
      actionHref="/buying/suppliers/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={suppliers} />
      </div>
    </OverviewLayout>
  )
}
