"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const revenue = [
  { item: "Sales Revenue", amount: "$1,245,000" },
  { item: "Service Revenue", amount: "$85,000" },
  { item: "Other Income", amount: "$12,000" },
  { item: "Total Revenue", amount: "$1,342,000" },
]

const cogs = [
  { item: "Cost of Goods Sold", amount: "$534,000" },
  { item: "Direct Labor", amount: "$120,000" },
  { item: "Total COGS", amount: "$654,000" },
]

const expenses = [
  { item: "Salary Expense", amount: "$312,000" },
  { item: "Rent Expense", amount: "$36,000" },
  { item: "Utilities Expense", amount: "$12,000" },
  { item: "Marketing Expense", amount: "$45,000" },
  { item: "Office Supplies", amount: "$8,500" },
  { item: "Depreciation", amount: "$18,000" },
  { item: "Total Operating Expenses", amount: "$431,500" },
]

export default function ProfitLossPage() {
  return (
    <OverviewLayout
      title="Profit & Loss Statement (DRE)"
      description="View your company's financial performance"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,342,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Gross Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$688,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Operating Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$256,500</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$256,500</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {revenue.map((item) => (
                  <div key={item.item} className="flex items-center justify-between">
                    <span className={`text-sm ${item.item.startsWith("Total") ? "font-bold" : ""}`}>{item.item}</span>
                    <span className={`text-sm ${item.item.startsWith("Total") ? "font-bold" : ""}`}>{item.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost of Goods Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cogs.map((item) => (
                  <div key={item.item} className="flex items-center justify-between">
                    <span className={`text-sm ${item.item.startsWith("Total") ? "font-bold" : ""}`}>{item.item}</span>
                    <span className={`text-sm ${item.item.startsWith("Total") ? "font-bold" : ""}`}>{item.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Operating Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.map((item) => (
                <div key={item.item} className="flex items-center justify-between">
                  <span className={`text-sm ${item.item.startsWith("Total") ? "font-bold" : ""}`}>{item.item}</span>
                  <span className={`text-sm ${item.item.startsWith("Total") ? "font-bold" : ""}`}>{item.amount}</span>
                </div>
              ))}
            </div>
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
