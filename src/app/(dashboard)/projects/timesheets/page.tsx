"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const timesheets = [
  { id: "TS-001", employee: "Alice Johnson", project: "ERP Implementation", task: "Configure accounting module", date: "2024-01-15", hours: "8.00", status: "Approved" },
  { id: "TS-002", employee: "Bob Williams", project: "ERP Implementation", task: "Data migration planning", date: "2024-01-15", hours: "7.50", status: "Approved" },
  { id: "TS-003", employee: "Carol Davis", project: "Website Redesign", task: "Finalize homepage design", date: "2024-01-15", hours: "6.00", status: "Pending" },
  { id: "TS-004", employee: "Alice Johnson", project: "Mobile App v2", task: "API integration testing", date: "2024-01-14", hours: "4.00", status: "Approved" },
  { id: "TS-005", employee: "David Brown", project: "ERP Implementation", task: "Team coordination", date: "2024-01-15", hours: "8.50", status: "Approved" },
  { id: "TS-006", employee: "Eva Martinez", project: "ERP Implementation", task: "Test stock management", date: "2024-01-14", hours: "5.00", status: "Pending" },
]

const columns = [
  { key: "id", label: "Timesheet #" },
  { key: "employee", label: "Employee" },
  { key: "project", label: "Project" },
  { key: "task", label: "Task" },
  { key: "date", label: "Date" },
  { key: "hours", label: "Hours", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function TimesheetsPage() {
  return (
    <OverviewLayout
      title="Timesheets"
      description="Track employee time and project hours"
      actionLabel="Log Time"
      actionHref="/projects/timesheets/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={timesheets} />
      </div>
    </OverviewLayout>
  )
}
