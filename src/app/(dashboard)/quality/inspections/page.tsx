"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const inspections = [
  { id: "QC-2024-001", item: "Widget Alpha", batch: "BATCH-001", type: "Final Inspection", inspector: "Alice Johnson", date: "2024-01-15", qty: 500, passed: 495, failed: 5, result: "Pass" },
  { id: "QC-2024-002", item: "Component X1", batch: "BATCH-002", type: "In-Process", inspector: "Bob Williams", date: "2024-01-14", qty: 1000, passed: 992, failed: 8, result: "Pass" },
  { id: "QC-2024-003", item: "Motor Assembly", batch: "BATCH-003", type: "Final Inspection", inspector: "Alice Johnson", date: "2024-01-13", qty: 100, passed: 85, failed: 15, result: "Fail" },
  { id: "QC-2024-004", item: "Bracket Assembly", batch: "BATCH-004", type: "Incoming", inspector: "Carol Davis", date: "2024-01-12", qty: 2000, passed: 1990, failed: 10, result: "Pass" },
  { id: "QC-2024-005", item: "Widget Beta", batch: "BATCH-005", type: "Final Inspection", inspector: "Bob Williams", date: "2024-01-11", qty: 300, passed: 298, failed: 2, result: "Pass" },
  { id: "QC-2024-006", item: "Control Unit", batch: "BATCH-006", type: "In-Process", inspector: "Alice Johnson", date: "2024-01-10", qty: 50, passed: 48, failed: 2, result: "Pass" },
]

const columns = [
  { key: "id", label: "Inspection #" },
  { key: "item", label: "Item" },
  { key: "batch", label: "Batch" },
  { key: "type", label: "Type" },
  { key: "inspector", label: "Inspector" },
  { key: "date", label: "Date" },
  { key: "qty", label: "Qty", className: "text-right" },
  { key: "passed", label: "Passed", className: "text-right" },
  { key: "failed", label: "Failed", className: "text-right" },
  { key: "result", label: "Result", render: (item: Record<string, unknown>) => (
    <span className={`text-xs font-medium ${(item.result as string) === "Pass" ? "text-emerald-500" : "text-red-500"}`}>
      {item.result as string}
    </span>
  )},
]

export default function InspectionsPage() {
  return (
    <OverviewLayout
      title="Quality Inspections"
      description="Track quality inspections and results"
      actionLabel="New Inspection"
      actionHref="/quality/inspections/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={inspections} />
      </div>
    </OverviewLayout>
  )
}
