"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SimpleDataTable } from "@/components/erp/simple-data-table"
import { StatusBadge } from "@/components/erp/simple-data-table"
import Link from "next/link"

const assetDetails = {
  id: "AST-001",
  name: "Office Building",
  category: "Building",
  purchaseDate: "2020-01-15",
  purchaseCost: "$500,000",
  usefulLife: "20 years",
  depreciationMethod: "Straight Line",
  salvageValue: "$50,000",
  annualDepreciation: "$22,500",
  totalDepreciation: "$90,000",
  netBookValue: "$410,000",
  location: "Main Office - 123 Business St",
  status: "Active",
}

const depreciationSchedule = [
  { year: "2020", depreciation: "$22,500", accumulated: "$22,500", bookValue: "$477,500" },
  { year: "2021", depreciation: "$22,500", accumulated: "$45,000", bookValue: "$455,000" },
  { year: "2022", depreciation: "$22,500", accumulated: "$67,500", bookValue: "$432,500" },
  { year: "2023", depreciation: "$22,500", accumulated: "$90,000", bookValue: "$410,000" },
]

const columns = [
  { key: "year", label: "Year" },
  { key: "depreciation", label: "Depreciation", className: "text-right" },
  { key: "accumulated", label: "Accumulated", className: "text-right" },
  { key: "bookValue", label: "Book Value", className: "text-right" },
]

export default function AssetDetailPage() {
  return (
    <OverviewLayout
      title={`${assetDetails.id} - ${assetDetails.name}`}
      description="View asset details and depreciation schedule"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Purchase Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assetDetails.purchaseCost}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Depreciation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assetDetails.totalDepreciation}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Book Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assetDetails.netBookValue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={assetDetails.status} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Asset Number</p>
                <p className="font-medium">{assetDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{assetDetails.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Purchase Date</p>
                <p className="font-medium">{assetDetails.purchaseDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Useful Life</p>
                <p className="font-medium">{assetDetails.usefulLife}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Depreciation Method</p>
                <p className="font-medium">{assetDetails.depreciationMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salvage Value</p>
                <p className="font-medium">{assetDetails.salvageValue}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Depreciation</p>
                <p className="font-medium">{assetDetails.annualDepreciation}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{assetDetails.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Depreciation Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={depreciationSchedule} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/assets" />}>
            Back to Assets
          </Button>
          <Button>Edit Asset</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
