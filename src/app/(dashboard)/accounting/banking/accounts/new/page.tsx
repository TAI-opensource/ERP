"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import Link from "next/link"

export default function NewBankAccountPage() {
  return (
    <OverviewLayout
      title="New Bank Account"
      description="Add a new bank account"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input id="name" placeholder="e.g. Main Operating Account" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank">Bank Name</Label>
                <Input id="bank" placeholder="e.g. Chase Bank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" placeholder="Account number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routing">Routing Number</Label>
                <Input id="routing" placeholder="Routing number" />
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
                <Label htmlFor="openingBalance">Opening Balance</Label>
                <Input id="openingBalance" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Account description" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/banking/accounts" />}>
            Cancel
          </Button>
          <Button>Create Account</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
