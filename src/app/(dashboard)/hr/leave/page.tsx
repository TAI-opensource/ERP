"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const leaveRequests = [
  { id: "LV-001", employee: "Alice Johnson", department: "Engineering", type: "Annual Leave", from: "2024-01-20", to: "2024-01-22", days: 3, reason: "Family vacation", status: "Approved" },
  { id: "LV-002", employee: "Bob Williams", department: "Sales", type: "Sick Leave", from: "2024-01-16", to: "2024-01-16", days: 1, reason: "Medical appointment", status: "Approved" },
  { id: "LV-003", employee: "Carol Davis", department: "Marketing", type: "Annual Leave", from: "2024-01-25", to: "2024-01-26", days: 2, reason: "Personal work", status: "Pending" },
  { id: "LV-004", employee: "David Brown", department: "Engineering", type: "Personal Leave", from: "2024-01-18", to: "2024-01-18", days: 1, reason: "Bank visit", status: "Pending" },
  { id: "LV-005", employee: "Eva Martinez", department: "HR", type: "Annual Leave", from: "2024-01-15", to: "2024-01-15", days: 1, reason: "Personal", status: "Rejected" },
]

const leaveBalance = [
  { type: "Annual Leave", entitled: 20, taken: 12, balance: 8 },
  { type: "Sick Leave", entitled: 10, taken: 3, balance: 7 },
  { type: "Personal Leave", entitled: 5, taken: 1, balance: 4 },
]

const columns = [
  { key: "id", label: "Request #" },
  { key: "employee", label: "Employee" },
  { key: "department", label: "Department" },
  { key: "type", label: "Leave Type" },
  { key: "from", label: "From" },
  { key: "to", label: "To" },
  { key: "days", label: "Days", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function LeavePage() {
  return (
    <OverviewLayout
      title="Leave Management"
      description="Manage employee leave requests and balances"
      actionLabel="New Leave Request"
      actionHref="/hr/leave/new"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {leaveBalance.map((lb) => (
            <Card key={lb.type}>
              <CardHeader>
                <CardTitle className="text-sm">{lb.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entitled</span>
                    <span>{lb.entitled} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taken</span>
                    <span>{lb.taken} days</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Balance</span>
                    <span>{lb.balance} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="rounded-lg border">
          <SimpleDataTable columns={columns} data={leaveRequests} />
        </div>
      </div>
    </OverviewLayout>
  )
}
