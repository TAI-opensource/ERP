"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const employees = [
  { id: "EMP-001", name: "Alice Johnson", department: "Engineering", designation: "Senior Developer", joinDate: "2021-03-15", email: "alice@company.com", status: "Active" },
  { id: "EMP-002", name: "Bob Williams", department: "Sales", designation: "Sales Manager", joinDate: "2020-07-01", email: "bob@company.com", status: "Active" },
  { id: "EMP-003", name: "Carol Davis", department: "Marketing", designation: "Marketing Specialist", joinDate: "2022-01-10", email: "carol@company.com", status: "Active" },
  { id: "EMP-004", name: "David Brown", department: "Engineering", designation: "Tech Lead", joinDate: "2019-11-20", email: "david@company.com", status: "Active" },
  { id: "EMP-005", name: "Eva Martinez", department: "HR", designation: "HR Manager", joinDate: "2020-05-15", email: "eva@company.com", status: "Active" },
  { id: "EMP-006", name: "Frank Wilson", department: "Operations", designation: "Operations Lead", joinDate: "2021-08-01", email: "frank@company.com", status: "Active" },
  { id: "EMP-007", name: "Grace Lee", department: "Finance", designation: "Accountant", joinDate: "2022-06-15", email: "grace@company.com", status: "On Leave" },
]

const columns = [
  { key: "id", label: "Employee ID" },
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "designation", label: "Designation" },
  { key: "joinDate", label: "Join Date" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function EmployeesPage() {
  return (
    <OverviewLayout
      title="Employees"
      description="Manage employee records and information"
      actionLabel="Add Employee"
      actionHref="/hr/employees/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={employees} />
      </div>
    </OverviewLayout>
  )
}
