"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const assets = [
  { id: "AST-001", name: "Office Building", category: "Building", purchaseDate: "2020-01-15", purchaseCost: "$500,000", depreciation: "$50,000", netBookValue: "$350,000", status: "Active" },
  { id: "AST-002", name: "Delivery Truck #1", category: "Vehicle", purchaseDate: "2022-06-01", purchaseCost: "$45,000", depreciation: "$18,000", netBookValue: "$27,000", status: "Active" },
  { id: "AST-003", name: "Server Infrastructure", category: "IT Equipment", purchaseDate: "2023-01-10", purchaseCost: "$25,000", depreciation: "$7,500", netBookValue: "$17,500", status: "Active" },
  { id: "AST-004", name: "Office Furniture", category: "Furniture", purchaseDate: "2021-03-20", purchaseCost: "$15,000", depreciation: "$6,000", netBookValue: "$9,000", status: "Active" },
  { id: "AST-005", name: "Factory Equipment", category: "Machinery", purchaseDate: "2019-08-15", purchaseCost: "$200,000", depreciation: "$80,000", netBookValue: "$120,000", status: "Active" },
  { id: "AST-006", name: "Old Laptop", category: "IT Equipment", purchaseDate: "2018-05-01", purchaseCost: "$2,000", depreciation: "$2,000", netBookValue: "$0", status: "Disposed" },
]

const columns = [
  { key: "id", label: "Asset #" },
  { key: "name", label: "Asset Name" },
  { key: "category", label: "Category" },
  { key: "purchaseDate", label: "Purchase Date" },
  { key: "purchaseCost", label: "Purchase Cost", className: "text-right" },
  { key: "depreciation", label: "Depreciation", className: "text-right" },
  { key: "netBookValue", label: "Net Book Value", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Total Assets", value: "6" },
  { label: "Total Value", value: "$787,000" },
  { label: "Total Depreciation", value: "$163,500" },
  { label: "Net Book Value", value: "$523,500" },
]

export default function AssetsPage() {
  return (
    <OverviewLayout
      title="Fixed Assets"
      description="Manage your company's fixed assets"
      actionLabel="New Asset"
      actionHref="/accounting/assets/new"
      stats={summaryStats}
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={assets} />
      </div>
    </OverviewLayout>
  )
}
