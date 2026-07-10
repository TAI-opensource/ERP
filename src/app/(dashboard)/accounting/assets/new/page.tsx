"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import Link from "next/link"

export default function NewAssetPage() {
  return (
    <OverviewLayout
      title="New Fixed Asset"
      description="Register a new fixed asset"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name</Label>
                <Input id="name" placeholder="e.g. Office Building" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <option value="">Select category</option>
                  <option value="building">Building</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="it-equipment">IT Equipment</option>
                  <option value="furniture">Furniture</option>
                  <option value="machinery">Machinery</option>
                  <option value="land">Land</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input id="purchaseDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseCost">Purchase Cost</Label>
                <Input id="purchaseCost" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usefulLife">Useful Life (Years)</Label>
                <Input id="usefulLife" type="number" placeholder="e.g. 10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depreciationMethod">Depreciation Method</Label>
                <Select>
                  <option value="">Select method</option>
                  <option value="straight-line">Straight Line</option>
                  <option value="declining-balance">Declining Balance</option>
                  <option value="units-of-production">Units of Production</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salvageValue">Salvage Value</Label>
                <Input id="salvageValue" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Main Office" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Asset description" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounting Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assetAccount">Asset Account</Label>
                <Select>
                  <option value="">Select account</option>
                  <option value="1500">1500 - Fixed Assets</option>
                  <option value="1510">1510 - Buildings</option>
                  <option value="1520">1520 - Vehicles</option>
                  <option value="1530">1530 - IT Equipment</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="depreciationAccount">Depreciation Account</Label>
                <Select>
                  <option value="">Select account</option>
                  <option value="1600">1600 - Accumulated Depreciation</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenseAccount">Depreciation Expense Account</Label>
                <Select>
                  <option value="">Select account</option>
                  <option value="5700">5700 - Depreciation Expense</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/assets" />}>
            Cancel
          </Button>
          <Button>Create Asset</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
