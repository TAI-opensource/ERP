"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import Link from "next/link"

export default function NewAccountPage() {
  return (
    <OverviewLayout
      title="New Account"
      description="Create a new account in the chart of accounts"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Account Code</Label>
                <Input id="code" placeholder="e.g. 1010" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input id="name" placeholder="e.g. Cash in Hand" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <Select>
                  <option value="">Select type</option>
                  <option value="asset">Asset</option>
                  <option value="liability">Liability</option>
                  <option value="equity">Equity</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Account Group</Label>
                <Select>
                  <option value="">Select group</option>
                  <option value="current-assets">Current Assets</option>
                  <option value="non-current-assets">Non-Current Assets</option>
                  <option value="current-liabilities">Current Liabilities</option>
                  <option value="non-current-liabilities">Non-Current Liabilities</option>
                  <option value="equity">Equity</option>
                  <option value="revenue">Revenue</option>
                  <option value="cost-of-sales">Cost of Sales</option>
                  <option value="operating-expenses">Operating Expenses</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select>
                  <option value="USD">USD - US Dollar</option>
                  <option value="BRL">BRL - Brazilian Real</option>
                  <option value="EUR">EUR - Euro</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Account description" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/chart-of-accounts" />}>
            Cancel
          </Button>
          <Button>Create Account</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
