"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const jobCards = [
  { id: "JC-2024-001", workOrder: "WO-2024-001", workstation: "Assembly Line 1", operator: "John Smith", startDate: "2024-01-15", endDate: "2024-01-17", qtyProduced: 375, qtyRejected: 5, status: "In Progress" },
  { id: "JC-2024-002", workOrder: "WO-2024-001", workstation: "Paint Shop", operator: "Mike Johnson", startDate: "2024-01-17", endDate: "2024-01-19", qtyProduced: 0, qtyRejected: 0, status: "Pending" },
  { id: "JC-2024-003", workOrder: "WO-2024-002", workstation: "CNC Machine", operator: "Sarah Williams", startDate: "2024-01-14", endDate: "2024-01-16", qtyProduced: 450, qtyRejected: 8, status: "Completed" },
  { id: "JC-2024-004", workOrder: "WO-2024-002", workstation: "Assembly Line 2", operator: "Tom Brown", startDate: "2024-01-16", endDate: "2024-01-20", qtyProduced: 200, qtyRejected: 2, status: "In Progress" },
  { id: "JC-2024-005", workOrder: "WO-2024-003", workstation: "Assembly Line 1", operator: "John Smith", startDate: "2024-01-13", endDate: "2024-01-15", qtyProduced: 100, qtyRejected: 1, status: "Completed" },
]

const columns = [
  { key: "id", label: "Job Card #" },
  { key: "workOrder", label: "Work Order" },
  { key: "workstation", label: "Workstation" },
  { key: "operator", label: "Operator" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "qtyProduced", label: "Produced", className: "text-right" },
  { key: "qtyRejected", label: "Rejected", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function JobCardsPage() {
  return (
    <OverviewLayout
      title="Job Cards"
      description="Track manufacturing job cards and operations"
      actionLabel="New Job Card"
      actionHref="/manufacturing/job-cards/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={jobCards} />
      </div>
    </OverviewLayout>
  )
}
