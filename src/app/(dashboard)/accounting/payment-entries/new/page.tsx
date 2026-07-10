"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import Link from "next/link"

export default function NewPaymentEntryPage() {
  return (
    <OverviewLayout
      title="New Payment Entry"
      description="Record a new payment received or made"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Payment Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Payment Type</Label>
                <Select>
                  <option value="">Select type</option>
                  <option value="receive">Receive</option>
                  <option value="pay">Pay</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="party">Party</Label>
                <Input id="party" placeholder="Customer or Supplier name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partyType">Party Type</Label>
                <Select>
                  <option value="">Select type</option>
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mode">Payment Mode</Label>
                <Select>
                  <option value="">Select mode</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="cash">Cash</option>
                  <option value="credit-card">Credit Card</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference</Label>
                <Input id="reference" placeholder="e.g. INV-2024-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account</Label>
                <Select>
                  <option value="">Select account</option>
                  <option value="cash">1000 - Cash</option>
                  <option value="bank">1100 - Bank Account</option>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input id="remarks" placeholder="Payment description" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/payment-entries" />}>
            Cancel
          </Button>
          <Button>Submit Payment</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
