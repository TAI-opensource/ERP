"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const payroll = [
  { id: "PAY-2024-01", period: "January 2024", employees: 47, grossPay: "$215,000", deductions: "$29,000", netPay: "$186,000", status: "Paid" },
  { id: "PAY-2023-12", period: "December 2023", employees: 45, grossPay: "$208,000", deductions: "$28,000", netPay: "$180,000", status: "Paid" },
  { id: "PAY-2023-11", period: "November 2023", employees: 44, grossPay: "$202,000", deductions: "$27,000", netPay: "$175,000", status: "Paid" },
]

const employeePayroll = [
  { id: "EMP-001", name: "Alice Johnson", department: "Engineering", basic: "$7,500", allowance: "$1,500", deduction: "$1,200", netPay: "$7,800", status: "Paid" },
  { id: "EMP-002", name: "Bob Williams", department: "Sales", basic: "$6,000", allowance: "$2,000", deduction: "$1,100", netPay: "$6,900", status: "Paid" },
  { id: "EMP-003", name: "Carol Davis", department: "Marketing", basic: "$5,500", allowance: "$1,000", deduction: "$900", netPay: "$5,600", status: "Paid" },
  { id: "EMP-004", name: "David Brown", department: "Engineering", basic: "$8,500", allowance: "$1,500", deduction: "$1,350", netPay: "$8,650", status: "Paid" },
  { id: "EMP-005", name: "Eva Martinez", department: "HR", basic: "$6,500", allowance: "$1,200", deduction: "$1,000", netPay: "$6,700", status: "Paid" },
]

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "basic", label: "Basic", className: "text-right" },
  { key: "allowance", label: "Allowance", className: "text-right" },
  { key: "deduction", label: "Deduction", className: "text-right" },
  { key: "netPay", label: "Net Pay", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function PayrollPage() {
  return (
    <OverviewLayout
      title="Payroll"
      description="Process and manage employee payroll"
      actionLabel="Run Payroll"
      actionHref="/hr/payroll/run"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {payroll.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="text-sm">{p.period}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employees</span>
                    <span>{p.employees}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gross Pay</span>
                    <span>{p.grossPay}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deductions</span>
                    <span>{p.deductions}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Net Pay</span>
                    <span>{p.netPay}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="rounded-lg border">
          <SimpleDataTable columns={columns} data={employeePayroll} />
        </div>
      </div>
    </OverviewLayout>
  )
}
