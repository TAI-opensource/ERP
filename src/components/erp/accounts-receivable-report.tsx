"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DownloadIcon, PrinterIcon } from "lucide-react"
import { format } from "date-fns"

interface ARInvoice {
  id: string
  invoiceNumber: string
  customerName: string
  invoiceDate: string
  dueDate: string
  total: number
  amountPaid: number
  balance: number
  agingBucket: "current" | "1-30" | "31-60" | "61-90" | "over_90"
  status: "current" | "overdue"
}

interface AccountsReceivableReportProps {
  companyName: string
  reportDate: string
  invoices: ARInvoice[]
  totalOutstanding: number
  agingSummary: {
    current: number
    "1-30": number
    "31-60": number
    "61-90": number
    over_90: number
  }
  onExport?: () => void
  onPrint?: () => void
  className?: string
}

const agingBucketLabels: Record<string, string> = {
  current: "Current",
  "1-30": "1-30 Days",
  "31-60": "31-60 Days",
  "61-90": "61-90 Days",
  over_90: "Over 90 Days",
}

const agingBucketColors: Record<string, string> = {
  current: "text-green-600 bg-green-50",
  "1-30": "text-blue-600 bg-blue-50",
  "31-60": "text-yellow-600 bg-yellow-50",
  "61-90": "text-orange-600 bg-orange-50",
  over_90: "text-red-600 bg-red-50",
}

function AccountsReceivableReport({
  companyName,
  reportDate,
  invoices,
  totalOutstanding,
  agingSummary,
  onExport,
  onPrint,
  className,
}: AccountsReceivableReportProps) {
  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Accounts Receivable</CardTitle>
            <p className="text-sm text-muted-foreground">{companyName}</p>
            <p className="text-sm text-muted-foreground">As of {reportDate}</p>
          </div>
          <div className="flex items-center gap-2">
            {onPrint && (
              <Button variant="outline" size="sm" onClick={onPrint}>
                <PrinterIcon className="mr-1 size-4" />
                Print
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <DownloadIcon className="mr-1 size-4" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {(Object.entries(agingSummary) as [string, number][]).map(([bucket, amount]) => (
            <div key={bucket} className={cn("rounded-lg border p-3", agingBucketColors[bucket])}>
              <p className="text-xs font-medium">{agingBucketLabels[bucket]}</p>
              <p className="font-mono text-lg font-bold tabular-nums">{formatAmount(amount)}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Outstanding</span>
            <span className="font-mono text-xl font-bold tabular-nums">
              {formatAmount(totalOutstanding)}
            </span>
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Aging</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No outstanding invoices
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-xs">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="text-sm">{invoice.customerName}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(invoice.invoiceDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {formatAmount(invoice.total)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums text-green-600">
                      {formatAmount(invoice.amountPaid)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium tabular-nums text-red-600">
                      {formatAmount(invoice.balance)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", agingBucketColors[invoice.agingBucket])}>
                        {agingBucketLabels[invoice.agingBucket]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          invoice.status === "overdue"
                            ? "text-red-600 bg-red-50 border-red-200"
                            : "text-green-600 bg-green-50 border-green-200"
                        )}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export {
  AccountsReceivableReport,
  type AccountsReceivableReportProps,
  type ARInvoice,
  agingBucketLabels,
  agingBucketColors,
}
