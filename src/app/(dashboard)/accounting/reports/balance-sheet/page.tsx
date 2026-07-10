"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const assets = [
  { category: "Property, Plant & Equipment", amount: "$450,000", depreciation: "$90,000", net: "$360,000" },
  { category: "Current Assets", amount: "", depreciation: "", net: "" },
  { category: "Cash and Cash Equivalents", amount: "", depreciation: "", net: "$245,000" },
  { category: "Accounts Receivable", amount: "", depreciation: "", net: "$128,000" },
  { category: "Inventory", amount: "", depreciation: "", net: "$89,000" },
  { category: "Total Current Assets", amount: "", depreciation: "", net: "$462,000" },
  { category: "Total Assets", amount: "", depreciation: "", net: "$822,000" },
]

const liabilities = [
  { category: "Current Liabilities", amount: "" },
  { category: "Accounts Payable", amount: "$67,000" },
  { category: "Short-term Loans", amount: "$50,000" },
  { category: "Total Current Liabilities", amount: "$117,000" },
  { category: "Non-Current Liabilities", amount: "" },
  { category: "Long-term Debt", amount: "$200,000" },
  { category: "Total Liabilities", amount: "$317,000" },
]

const equity = [
  { category: "Owner's Equity", amount: "$500,000" },
  { category: "Retained Earnings", amount: "$5,000" },
  { category: "Total Equity", amount: "$505,000" },
]

export default function BalanceSheetPage() {
  return (
    <OverviewLayout
      title="Balance Sheet"
      description="View your company's financial position"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$822,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$317,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$505,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">As of Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Jan 15, 2024</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assets.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className={`text-sm ${item.category.startsWith("Total") ? "font-bold" : ""}`}>{item.category}</span>
                    <span className={`text-sm ${item.category.startsWith("Total") ? "font-bold" : ""}`}>{item.net || item.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Liabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {liabilities.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className={`text-sm ${item.category.startsWith("Total") ? "font-bold" : ""}`}>{item.category}</span>
                      <span className={`text-sm ${item.category.startsWith("Total") ? "font-bold" : ""}`}>{item.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {equity.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className={`text-sm ${item.category.startsWith("Total") ? "font-bold" : ""}`}>{item.category}</span>
                      <span className={`text-sm ${item.category.startsWith("Total") ? "font-bold" : ""}`}>{item.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
