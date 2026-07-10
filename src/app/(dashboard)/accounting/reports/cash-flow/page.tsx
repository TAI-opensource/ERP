"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleDataTable } from "@/components/erp/simple-data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const cashFlowData = [
  { category: "Operating Activities", items: [
    { description: "Receipts from customers", amount: "$41,250" },
    { description: "Payments to suppliers", amount: "-$28,200" },
    { description: "Salary payments", amount: "-$45,000" },
    { description: "Rent payment", amount: "-$3,000" },
    { description: "Net Cash from Operations", amount: "-$34,950" },
  ]},
  { category: "Investing Activities", items: [
    { description: "Purchase of equipment", amount: "-$15,000" },
    { description: "Net Cash from Investing", amount: "-$15,000" },
  ]},
  { category: "Financing Activities", items: [
    { description: "Loan proceeds", amount: "$50,000" },
    { description: "Loan repayment", amount: "-$10,000" },
    { description: "Net Cash from Financing", amount: "$40,000" },
  ]},
]

const columns = [
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount", className: "text-right" },
]

export default function CashFlowPage() {
  return (
    <OverviewLayout
      title="Cash Flow Statement"
      description="Track cash inflows and outflows"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Operating Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">-$34,950</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Investing Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">-$15,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Financing Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">$40,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Cash Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">-$9,950</div>
            </CardContent>
          </Card>
        </div>

        {cashFlowData.map((section) => (
          <Card key={section.category}>
            <CardHeader>
              <CardTitle>{section.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleDataTable columns={columns} data={section.items} />
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/reports" />}>
            Back to Reports
          </Button>
          <Button>Export PDF</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
