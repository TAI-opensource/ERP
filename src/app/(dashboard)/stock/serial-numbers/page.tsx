"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const serialNumbers = [
  { serialNo: "SN-2024-0001", item: "Motor Assembly", warehouse: "Warehouse A", purchaseDate: "2024-01-05", warrantyExpiry: "2027-01-05", status: "Delivered" },
  { serialNo: "SN-2024-0002", item: "Motor Assembly", warehouse: "Warehouse A", purchaseDate: "2024-01-05", warrantyExpiry: "2027-01-05", status: "Available" },
  { serialNo: "SN-2024-0003", item: "Control Unit", warehouse: "Warehouse B", purchaseDate: "2024-01-08", warrantyExpiry: "2027-01-08", status: "Delivered" },
  { serialNo: "SN-2024-0004", item: "Control Unit", warehouse: "Warehouse B", purchaseDate: "2024-01-08", warrantyExpiry: "2027-01-08", status: "In Maintenance" },
  { serialNo: "SN-2024-0005", item: "Widget Alpha", warehouse: "Warehouse A", purchaseDate: "2024-01-10", warrantyExpiry: "2025-01-10", status: "Available" },
  { serialNo: "SN-2024-0006", item: "Widget Alpha", warehouse: "Warehouse A", purchaseDate: "2024-01-10", warrantyExpiry: "2025-01-10", status: "Available" },
  { serialNo: "SN-2024-0007", item: "Bracket Assembly", warehouse: "Warehouse C", purchaseDate: "2023-12-20", warrantyExpiry: "2024-12-20", status: "Delivered" },
]

const columns = [
  { key: "serialNo", label: "Serial No" },
  { key: "item", label: "Item" },
  { key: "warehouse", label: "Warehouse" },
  { key: "purchaseDate", label: "Purchase Date" },
  { key: "warrantyExpiry", label: "Warranty Expiry" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function SerialNumbersPage() {
  return (
    <OverviewLayout
      title="Serial Number Tracking"
      description="Track individual item serial numbers and warranties"
      actionLabel="Add Serial Number"
      actionHref="/stock/serial-numbers/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={serialNumbers} />
      </div>
    </OverviewLayout>
  )
}
