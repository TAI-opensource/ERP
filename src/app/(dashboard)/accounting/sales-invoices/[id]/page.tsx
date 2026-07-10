"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import Link from "next/link"

const invoiceDetails = {
  id: "INV-2024-001",
  customer: "Acme Corp",
  date: "2024-01-15",
  dueDate: "2024-02-15",
  amount: "$12,500.00",
  paid: "$12,500.00",
  outstanding: "$0.00",
  status: "Paid",
  reference: "SO-2024-001",
}

const invoiceItems = [
  { item: "Product A", quantity: "10", rate: "$500.00", amount: "$5,000.00" },
  { item: "Product B", quantity: "5", rate: "$1,000.00", amount: "$5,000.00" },
  { item: "Service - Installation", quantity: "1", rate: "$2,500.00", amount: "$2,500.00" },
]

const columns = [
  { key: "item", label: "Item" },
  { key: "quantity", label: "Quantity", className: "text-right" },
  { key: "rate", label: "Rate", className: "text-right" },
  { key: "amount", label: "Amount", className: "text-right" },
]

export default function SalesInvoiceDetailPage() {
  return (
    <OverviewLayout
      title={`Invoice ${invoiceDetails.id}`}
      description="View sales invoice details"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Invoice Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoiceDetails.amount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Amount Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoiceDetails.paid}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoiceDetails.outstanding}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={invoiceDetails.status} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="font-medium">{invoiceDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{invoiceDetails.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoice Date</p>
                <p className="font-medium">{invoiceDetails.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{invoiceDetails.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-medium">{invoiceDetails.reference}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={invoiceItems} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/sales-invoices" />}>
            Back to Invoices
          </Button>
          {invoiceDetails.status !== "Paid" && (
            <Button render={<Link href="/accounting/payment-entries/new" />}>
              Record Payment
            </Button>
          )}
        </div>
      </div>
    </OverviewLayout>
  )
}
