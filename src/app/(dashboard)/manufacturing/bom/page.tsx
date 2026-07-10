"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const boms = [
  { id: "BOM-001", item: "Widget Alpha", qty: 1, cost: "$18.50", items: 5, status: "Active" },
  { id: "BOM-002", item: "Component X1", qty: 1, cost: "$12.00", items: 3, status: "Active" },
  { id: "BOM-003", item: "Motor Assembly", qty: 1, cost: "$95.00", items: 8, status: "Active" },
  { id: "BOM-004", item: "Bracket Assembly", qty: 1, cost: "$6.50", items: 4, status: "Active" },
  { id: "BOM-005", item: "Control Unit", qty: 1, cost: "$180.00", items: 12, status: "Draft" },
]

const bomItems = [
  { item: "Widget Alpha", component: "Housing", qty: 1, rate: "$5.00", amount: "$5.00" },
  { item: "Widget Alpha", component: "PCB Board", qty: 1, rate: "$8.00", amount: "$8.00" },
  { item: "Widget Alpha", component: "Connector", qty: 2, rate: "$1.50", amount: "$3.00" },
  { item: "Widget Alpha", component: "Screw Set", qty: 1, rate: "$0.50", amount: "$0.50" },
  { item: "Widget Alpha", component: "Label", qty: 1, rate: "$2.00", amount: "$2.00" },
]

const columns = [
  { key: "id", label: "BOM #" },
  { key: "item", label: "Item" },
  { key: "qty", label: "Qty", className: "text-right" },
  { key: "cost", label: "Cost", className: "text-right" },
  { key: "items", label: "Components", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function BOMPage() {
  return (
    <OverviewLayout
      title="Bill of Materials"
      description="Manage product BOMs and component structures"
      actionLabel="New BOM"
      actionHref="/manufacturing/bom/new"
    >
      <div className="space-y-6">
        <div className="rounded-lg border">
          <SimpleDataTable columns={columns} data={boms} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>BOM Components - Widget Alpha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bomItems.map((bi, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{bi.component}</p>
                    <p className="text-xs text-muted-foreground">Qty: {bi.qty} @ {bi.rate}</p>
                  </div>
                  <p className="text-sm font-medium">{bi.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
