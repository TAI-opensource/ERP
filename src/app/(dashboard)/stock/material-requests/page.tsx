"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const materialRequests = [
  { id: "MR-001", department: "Production", requestedBy: "John Wilson", items: 5, requiredDate: "2024-01-20", status: "Approved" },
  { id: "MR-002", department: "Maintenance", requestedBy: "Sarah Brown", items: 3, requiredDate: "2024-01-18", status: "Pending" },
  { id: "MR-003", department: "Production", requestedBy: "Mike Davis", items: 8, requiredDate: "2024-01-22", status: "Approved" },
  { id: "MR-004", department: "Quality", requestedBy: "Emily Wilson", items: 2, requiredDate: "2024-01-19", status: "Fulfilled" },
  { id: "MR-005", department: "Production", requestedBy: "Robert Johnson", items: 6, requiredDate: "2024-01-25", status: "Pending" },
  { id: "MR-006", department: "Maintenance", requestedBy: "Lisa Anderson", items: 4, requiredDate: "2024-01-17", status: "Rejected" },
]

const columns = [
  { key: "id", label: "Request #" },
  { key: "department", label: "Department" },
  { key: "requestedBy", label: "Requested By" },
  { key: "items", label: "Items", className: "text-right" },
  { key: "requiredDate", label: "Required Date" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Pending Requests", value: "2" },
  { label: "Approved", value: "2" },
  { label: "Fulfilled", value: "1" },
  { label: "Total Items", value: "28" },
]

export default function MaterialRequestsPage() {
  return (
    <OverviewLayout
      title="Material Requests"
      description="Manage internal material requests and fulfillment"
      actionLabel="New Request"
      actionHref="/stock/material-requests/new"
      stats={summaryStats}
    >
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requests awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Being fulfilled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completed This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Requests fulfilled</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={materialRequests} />
      </div>
    </OverviewLayout>
  )
}
