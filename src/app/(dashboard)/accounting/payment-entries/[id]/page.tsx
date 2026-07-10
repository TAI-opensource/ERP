"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/erp/simple-data-table"
import Link from "next/link"

const paymentDetails = {
  id: "PAY-2024-001",
  date: "2024-01-15",
  party: "Acme Corp",
  partyType: "Customer",
  type: "Receive",
  amount: "$12,500.00",
  reference: "INV-2024-001",
  mode: "Bank Transfer",
  status: "Submitted",
  account: "1100 - Bank Account",
  remarks: "Payment for invoice INV-2024-001",
}

export default function PaymentEntryDetailPage() {
  return (
    <OverviewLayout
      title={`Payment ${paymentDetails.id}`}
      description="View payment entry details"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Payment Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentDetails.amount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Payment Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentDetails.type}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Payment Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentDetails.mode}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={paymentDetails.status} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Payment Number</p>
                <p className="font-medium">{paymentDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{paymentDetails.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Party</p>
                <p className="font-medium">{paymentDetails.party}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Party Type</p>
                <p className="font-medium">{paymentDetails.partyType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-medium">{paymentDetails.reference}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account</p>
                <p className="font-medium">{paymentDetails.account}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Remarks</p>
                <p className="font-medium">{paymentDetails.remarks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/payment-entries" />}>
            Back to Payments
          </Button>
          {paymentDetails.status === "Draft" && (
            <Button>Submit Payment</Button>
          )}
        </div>
      </div>
    </OverviewLayout>
  )
}
