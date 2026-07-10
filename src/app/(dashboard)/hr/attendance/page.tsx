"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const attendance = [
  { id: "EMP-001", name: "Alice Johnson", department: "Engineering", date: "2024-01-15", checkIn: "09:00", checkOut: "18:15", hours: "9.25", status: "Present" },
  { id: "EMP-002", name: "Bob Williams", department: "Sales", date: "2024-01-15", checkIn: "08:45", checkOut: "17:30", hours: "8.75", status: "Present" },
  { id: "EMP-003", name: "Carol Davis", department: "Marketing", date: "2024-01-15", checkIn: "09:15", checkOut: "18:00", hours: "8.75", status: "Present" },
  { id: "EMP-004", name: "David Brown", department: "Engineering", date: "2024-01-15", checkIn: "08:30", checkOut: "17:45", hours: "9.25", status: "Present" },
  { id: "EMP-005", name: "Eva Martinez", department: "HR", date: "2024-01-15", checkIn: "-", checkOut: "-", hours: "-", status: "Absent" },
  { id: "EMP-006", name: "Frank Wilson", department: "Operations", date: "2024-01-15", checkIn: "09:00", checkOut: "14:00", hours: "5.00", status: "Half Day" },
  { id: "EMP-007", name: "Grace Lee", department: "Finance", date: "2024-01-15", checkIn: "-", checkOut: "-", hours: "-", status: "On Leave" },
]

const stats = [
  { label: "Present Today", value: "4" },
  { label: "Absent", value: "1" },
  { label: "On Leave", value: "1" },
  { label: "Half Day", value: "1" },
]

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "date", label: "Date" },
  { key: "checkIn", label: "Check In" },
  { key: "checkOut", label: "Check Out" },
  { key: "hours", label: "Hours", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function AttendancePage() {
  return (
    <OverviewLayout
      title="Attendance"
      description="Track employee attendance and working hours"
      actionLabel="Mark Attendance"
      actionHref="/hr/attendance/new"
      stats={stats}
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={attendance} />
      </div>
    </OverviewLayout>
  )
}
