"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const scorecards = [
  { id: "SC-001", supplier: "Supplier Alpha", period: "January 2024", quality: 95, delivery: 98, price: 88, overall: "A", status: "Completed" },
  { id: "SC-002", supplier: "Parts Unlimited", period: "January 2024", quality: 82, delivery: 90, price: 92, overall: "B", status: "Completed" },
  { id: "SC-003", supplier: "Component Co", period: "January 2024", quality: 91, delivery: 85, price: 78, overall: "B", status: "Completed" },
  { id: "SC-004", supplier: "Material Masters", period: "January 2024", quality: 78, delivery: 72, price: 95, overall: "C", status: "Completed" },
  { id: "SC-005", supplier: "Electro Parts", period: "January 2024", quality: 96, delivery: 94, price: 85, overall: "A", status: "Completed" },
  { id: "SC-006", supplier: "Legacy Suppliers", period: "January 2024", quality: 65, delivery: 60, price: 70, overall: "D", status: "Pending" },
]

const columns = [
  { key: "id", label: "Scorecard #" },
  { key: "supplier", label: "Supplier" },
  { key: "period", label: "Period" },
  { key: "quality", label: "Quality", className: "text-right" },
  { key: "delivery", label: "Delivery", className: "text-right" },
  { key: "price", label: "Price", className: "text-right" },
  { key: "overall", label: "Grade" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Suppliers Evaluated", value: "6" },
  { label: "Grade A", value: "2" },
  { label: "Grade B", value: "2" },
  { label: "Avg Quality Score", value: "84.5" },
]

export default function SupplierScorecardsPage() {
  return (
    <OverviewLayout
      title="Supplier Scorecards"
      description="Evaluate supplier performance and quality metrics"
      actionLabel="New Scorecard"
      actionHref="/buying/supplier-scorecards/new"
      stats={summaryStats}
    >
      <div className="grid gap-6 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Grade A Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">2</div>
            <p className="text-xs text-muted-foreground">Score above 90</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Grade B Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">2</div>
            <p className="text-xs text-muted-foreground">Score 80-89</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Grade C Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">1</div>
            <p className="text-xs text-muted-foreground">Score 70-79</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Grade D Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">1</div>
            <p className="text-xs text-muted-foreground">Score below 70</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={scorecards} />
      </div>
    </OverviewLayout>
  )
}
