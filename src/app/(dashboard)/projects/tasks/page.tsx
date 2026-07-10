"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const tasks = [
  { id: "TSK-001", project: "ERP Implementation", task: "Configure accounting module", assignee: "Alice Johnson", dueDate: "2024-01-18", priority: "High", status: "In Progress" },
  { id: "TSK-002", project: "ERP Implementation", task: "Data migration planning", assignee: "Bob Williams", dueDate: "2024-01-17", priority: "High", status: "Completed" },
  { id: "TSK-003", project: "Website Redesign", task: "Finalize homepage design", assignee: "Carol Davis", dueDate: "2024-01-19", priority: "Medium", status: "In Progress" },
  { id: "TSK-004", project: "Mobile App v2", task: "API integration testing", assignee: "Alice Johnson", dueDate: "2024-01-22", priority: "High", status: "Pending" },
  { id: "TSK-005", project: "ERP Implementation", task: "Test stock management", assignee: "Eva Martinez", dueDate: "2024-01-22", priority: "Medium", status: "Pending" },
  { id: "TSK-006", project: "Website Redesign", task: "Implement responsive layout", assignee: "Carol Davis", dueDate: "2024-01-25", priority: "Medium", status: "Pending" },
  { id: "TSK-007", project: "Data Migration", task: "Validate data integrity", assignee: "Bob Williams", dueDate: "2024-01-17", priority: "High", status: "Completed" },
]

const columns = [
  { key: "id", label: "Task #" },
  { key: "project", label: "Project" },
  { key: "task", label: "Task" },
  { key: "assignee", label: "Assignee" },
  { key: "dueDate", label: "Due Date" },
  { key: "priority", label: "Priority", render: (item: Record<string, unknown>) => (
    <span className={`text-xs font-medium ${(item.priority as string) === "High" ? "text-red-500" : (item.priority as string) === "Medium" ? "text-yellow-500" : "text-muted-foreground"}`}>
      {item.priority as string}
    </span>
  )},
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function TasksPage() {
  return (
    <OverviewLayout
      title="Tasks"
      description="Manage project tasks and assignments"
      actionLabel="New Task"
      actionHref="/projects/tasks/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={tasks} />
      </div>
    </OverviewLayout>
  )
}
