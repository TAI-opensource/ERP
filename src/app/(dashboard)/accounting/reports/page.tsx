"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const reports = [
  { id: "RPT-001", name: "Profit and Loss Statement", period: "January 2024", generated: "2024-01-15", status: "Generated" },
  { id: "RPT-002", name: "Balance Sheet", period: "January 2024", generated: "2024-01-15", status: "Generated" },
  { id: "RPT-003", name: "Cash Flow Statement", period: "January 2024", generated: "2024-01-15", status: "Generated" },
  { id: "RPT-004", name: "Trial Balance", period: "January 2024", generated: "2024-01-14", status: "Generated" },
  { id: "RPT-005", name: "Accounts Receivable Aging", period: "January 2024", generated: "2024-01-15", status: "Pending" },
  { id: "RPT-006", name: "Accounts Payable Aging", period: "January 2024", generated: "2024-01-15", status: "Pending" },
]

const columns = [
  { key: "id", label: "Report #" },
  { key: "name", label: "Report Name" },
  { key: "period", label: "Period" },
  { key: "generated", label: "Generated Date" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Total Revenue", value: "$1,245,000" },
  { label: "Net Profit", value: "$353,000" },
  { label: "Total Assets", value: "$2,450,000" },
  { label: "Reports Generated", value: "24" },
]

export default function AccountingReportsPage() {
  return (
    <OverviewLayout
      title="Financial Reports"
      description="View and generate financial reports"
      actionLabel="Generate Report"
      actionHref="/accounting/reports/new"
      stats={summaryStats}
    >
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Revenue", value: "$1,245,000", change: "+12.5%" },
                { name: "Expenses", value: "$892,000", change: "+8.2%" },
                { name: "Net Profit", value: "$353,000", change: "+22.1%" },
                { name: "Tax Liability", value: "$88,250", change: "+5.0%" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{item.value}</span>
                    <span className="ml-2 text-xs text-emerald-500">{item.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "Profit and Loss Statement",
                "Balance Sheet",
                "Cash Flow Statement",
                "Trial Balance",
                "Budget vs Actual",
                "Tax Summary",
              ].map((report) => (
                <div key={report} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">{report}</span>
                  <span className="text-xs text-muted-foreground">View</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={reports} />
      </div>
    </OverviewLayout>
  )
}
