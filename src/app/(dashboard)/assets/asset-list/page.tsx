"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const assets = [
  { id: "AST-001", name: "Dell Laptop #12", category: "IT Hardware", location: "Office - Floor 3", purchaseDate: "2023-06-15", purchaseCost: "$1,200", currentValue: "$840", assignedTo: "Alice Johnson", status: "Active" },
  { id: "AST-002", name: "Company Vehicle #3", category: "Vehicles", location: "Parking Lot A", purchaseDate: "2022-01-10", purchaseCost: "$35,000", currentValue: "$24,500", assignedTo: "Sales Team", status: "Active" },
  { id: "AST-003", name: "CNC Machine", category: "Machinery", location: "Factory - Bay 2", purchaseDate: "2021-03-20", purchaseCost: "$85,000", currentValue: "$59,500", assignedTo: "Production", status: "Under Maintenance" },
  { id: "AST-004", name: "Office Printer Fleet", category: "Office Equipment", location: "Office - Floor 1", purchaseDate: "2023-09-01", purchaseCost: "$4,500", currentValue: "$3,600", assignedTo: "Admin", status: "Active" },
  { id: "AST-005", name: "Server Rack", category: "IT Hardware", location: "Server Room", purchaseDate: "2022-08-15", purchaseCost: "$12,000", currentValue: "$8,400", assignedTo: "IT", status: "Active" },
  { id: "AST-006", name: "Conference Table", category: "Furniture", location: "Office - Floor 1", purchaseDate: "2023-02-20", purchaseCost: "$2,500", currentValue: "$2,000", assignedTo: "Meeting Room", status: "Active" },
  { id: "AST-007", name: "Company Vehicle #5", category: "Vehicles", location: "Parking Lot B", purchaseDate: "2020-05-10", purchaseCost: "$32,000", currentValue: "$19,200", assignedTo: "Logistics", status: "Retired" },
]

const columns = [
  { key: "id", label: "Asset ID" },
  { key: "name", label: "Asset Name" },
  { key: "category", label: "Category" },
  { key: "location", label: "Location" },
  { key: "purchaseDate", label: "Purchase Date" },
  { key: "purchaseCost", label: "Cost", className: "text-right" },
  { key: "currentValue", label: "Current Value", className: "text-right" },
  { key: "assignedTo", label: "Assigned To" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function AssetListPage() {
  return (
    <OverviewLayout
      title="Asset List"
      description="Complete list of company assets"
      actionLabel="Add Asset"
      actionHref="/assets/asset-list/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={assets} />
      </div>
    </OverviewLayout>
  )
}
