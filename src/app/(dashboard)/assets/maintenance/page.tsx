"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const maintenanceSchedule = [
  { id: "MNT-001", asset: "CNC Machine", type: "Repair", frequency: "As Needed", lastDate: "2024-01-10", nextDate: "2024-01-15", assignedTo: "External Vendor", cost: "$2,500", status: "In Progress" },
  { id: "MNT-002", asset: "Server Room AC", type: "Preventive", frequency: "Monthly", lastDate: "2024-01-01", nextDate: "2024-01-18", assignedTo: "Facilities", cost: "$200", status: "Scheduled" },
  { id: "MNT-003", asset: "Company Vehicle #3", type: "Service", frequency: "Quarterly", lastDate: "2023-12-15", nextDate: "2024-01-20", assignedTo: "External Vendor", cost: "$500", status: "Scheduled" },
  { id: "MNT-004", asset: "Office Printer Fleet", type: "Inspection", frequency: "Monthly", lastDate: "2024-01-05", nextDate: "2024-02-05", assignedTo: "IT Team", cost: "$0", status: "Scheduled" },
  { id: "MNT-005", asset: "Server Rack", type: "Preventive", frequency: "Quarterly", lastDate: "2023-11-20", nextDate: "2024-02-20", assignedTo: "IT Team", cost: "$100", status: "Scheduled" },
  { id: "MNT-006", asset: "Company Vehicle #3", type: "Service", frequency: "Quarterly", lastDate: "2023-09-15", nextDate: "2023-12-15", assignedTo: "External Vendor", cost: "$500", status: "Completed" },
]

const columns = [
  { key: "id", label: "Maintenance #" },
  { key: "asset", label: "Asset" },
  { key: "type", label: "Type" },
  { key: "frequency", label: "Frequency" },
  { key: "lastDate", label: "Last Date" },
  { key: "nextDate", label: "Next Date" },
  { key: "assignedTo", label: "Assigned To" },
  { key: "cost", label: "Est. Cost", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function MaintenancePage() {
  return (
    <OverviewLayout
      title="Maintenance Schedule"
      description="Track asset maintenance and service schedules"
      actionLabel="Schedule Maintenance"
      actionHref="/assets/maintenance/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={maintenanceSchedule} />
      </div>
    </OverviewLayout>
  )
}
