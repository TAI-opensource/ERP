"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const procedures = [
  { id: "QP-001", name: "Incoming Material Inspection", category: "Inspection", version: "2.1", effectiveDate: "2024-01-01", reviewDate: "2024-07-01", owner: "Quality Manager", status: "Active" },
  { id: "QP-002", name: "In-Process Quality Check", category: "Inspection", version: "3.0", effectiveDate: "2023-10-15", reviewDate: "2024-04-15", owner: "Quality Manager", status: "Active" },
  { id: "QP-003", name: "Final Product Inspection", category: "Inspection", version: "2.0", effectiveDate: "2023-09-01", reviewDate: "2024-03-01", owner: "Quality Manager", status: "Active" },
  { id: "QP-004", name: "Non-Conformance Handling", category: "Corrective Action", version: "1.5", effectiveDate: "2023-08-01", reviewDate: "2024-02-01", owner: "Quality Manager", status: "Active" },
  { id: "QP-005", name: "Calibration Procedure", category: "Maintenance", version: "1.2", effectiveDate: "2023-06-01", reviewDate: "2024-06-01", owner: "Lab Manager", status: "Active" },
  { id: "QP-006", name: "Document Control", category: "General", version: "2.0", effectiveDate: "2023-01-01", reviewDate: "2024-01-01", owner: "Quality Manager", status: "Under Review" },
]

const columns = [
  { key: "id", label: "Procedure #" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "version", label: "Version" },
  { key: "effectiveDate", label: "Effective Date" },
  { key: "reviewDate", label: "Review Date" },
  { key: "owner", label: "Owner" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function ProceduresPage() {
  return (
    <OverviewLayout
      title="Quality Procedures"
      description="Manage quality procedures and documentation"
      actionLabel="New Procedure"
      actionHref="/quality/procedures/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={procedures} />
      </div>
    </OverviewLayout>
  )
}
