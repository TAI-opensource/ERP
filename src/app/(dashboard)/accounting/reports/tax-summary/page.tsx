"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleDataTable } from "@/components/erp/simple-data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const taxSummary = [
  { tax: "ICMS", rate: "18%", taxableAmount: "$500,000", taxAmount: "$90,000", status: "Paid" },
  { tax: "IPI", rate: "10%", taxableAmount: "$200,000", taxAmount: "$20,000", status: "Paid" },
  { tax: "PIS", rate: "1.65%", taxableAmount: "$1,245,000", taxAmount: "$20,543", status: "Pending" },
  { tax: "COFINS", rate: "7.6%", taxableAmount: "$1,245,000", taxAmount: "$94,620", status: "Pending" },
  { tax: "ISS", rate: "5%", taxableAmount: "$85,000", taxAmount: "$4,250", status: "Paid" },
  { tax: "IRPJ", rate: "15%", taxableAmount: "$256,500", taxAmount: "$38,475", status: "Pending" },
  { tax: "CSLL", rate: "9%", taxableAmount: "$256,500", taxAmount: "$23,085", status: "Pending" },
]

const columns = [
  { key: "tax", label: "Tax" },
  { key: "rate", label: "Rate" },
  { key: "taxableAmount", label: "Taxable Amount", className: "text-right" },
  { key: "taxAmount", label: "Tax Amount", className: "text-right" },
  { key: "status", label: "Status" },
]

export default function TaxSummaryPage() {
  return (
    <OverviewLayout
      title="Tax Summary"
      description="Overview of tax obligations and payments"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tax Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$290,973</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">$114,250</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">$176,723</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Tax Rate (Effective)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">21.7%</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tax Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={taxSummary} />
          </CardContent>
        </Card>

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
