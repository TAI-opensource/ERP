"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DownloadIcon, PrinterIcon } from "lucide-react"

interface TaxLine {
  taxName: string
  taxRate: number
  taxableAmount: number
  taxAmount: number
  collected?: number
  paid?: number
}

interface TaxSummaryReportProps {
  companyName: string
  periodStart: string
  periodEnd: string
  taxes: TaxLine[]
  totalTaxableAmount: number
  totalTaxAmount: number
  totalCollected?: number
  totalPaid?: number
  netPayable?: number
  onExport?: () => void
  onPrint?: () => void
  className?: string
}

function TaxSummaryReport({
  companyName,
  periodStart,
  periodEnd,
  taxes,
  totalTaxableAmount,
  totalTaxAmount,
  totalCollected,
  totalPaid,
  netPayable,
  onExport,
  onPrint,
  className,
}: TaxSummaryReportProps) {
  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Tax Summary</CardTitle>
            <p className="text-sm text-muted-foreground">{companyName}</p>
            <p className="text-sm text-muted-foreground">
              {periodStart} - {periodEnd}
            </p>
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
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Tax</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Taxable Amount</TableHead>
                <TableHead className="text-right">Tax Amount</TableHead>
                {totalCollected !== undefined && (
                  <TableHead className="text-right">Collected</TableHead>
                )}
                {totalPaid !== undefined && (
                  <TableHead className="text-right">Paid</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={totalCollected !== undefined && totalPaid !== undefined ? 6 : 4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No tax data available
                  </TableCell>
                </TableRow>
              ) : (
                taxes.map((tax) => (
                  <TableRow key={tax.taxName}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{tax.taxName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {tax.taxRate}%
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {formatAmount(tax.taxableAmount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium tabular-nums">
                      {formatAmount(tax.taxAmount)}
                    </TableCell>
                    {totalCollected !== undefined && (
                      <TableCell className="text-right font-mono text-sm tabular-nums text-green-600">
                        {tax.collected !== undefined ? formatAmount(tax.collected) : "-"}
                      </TableCell>
                    )}
                    {totalPaid !== undefined && (
                      <TableCell className="text-right font-mono text-sm tabular-nums text-red-600">
                        {tax.paid !== undefined ? formatAmount(tax.paid) : "-"}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </Table>
            {taxes.length > 0 && (
              <tfoot>
                <tr className="border-t-2 bg-muted/50 font-medium">
                  <td className="px-4 py-3 text-sm">Total</td>
                  <td className="text-right px-4 py-3"></td>
                  <td className="text-right px-4 py-3 font-mono text-sm tabular-nums">
                    {formatAmount(totalTaxableAmount)}
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-sm tabular-nums">
                    {formatAmount(totalTaxAmount)}
                  </td>
                  {totalCollected !== undefined && (
                    <td className="text-right px-4 py-3 font-mono text-sm tabular-nums">
                      {formatAmount(totalCollected)}
                    </td>
                  )}
                  {totalPaid !== undefined && (
                    <td className="text-right px-4 py-3 font-mono text-sm tabular-nums">
                      {formatAmount(totalPaid)}
                    </td>
                  )}
                </tr>
              </tfoot>
            )}
          </Table>
        </div>

        {netPayable !== undefined && (
          <div className={cn(
            "rounded-lg border p-4",
            netPayable > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
          )}>
            <div className="flex items-center justify-between">
              <span className="font-medium">Net Tax Payable</span>
              <span className={cn(
                "font-mono text-xl font-bold tabular-nums",
                netPayable > 0 ? "text-red-600" : "text-green-600"
              )}>
                {formatAmount(Math.abs(netPayable))}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {netPayable > 0 ? "Amount to pay to tax authorities" : "Amount to be refunded"}
            </p>
          </div>
        )}

        <div className="rounded-lg bg-muted/30 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Taxable</p>
              <p className="font-mono text-xl font-bold tabular-nums">
                {formatAmount(totalTaxableAmount)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Tax</p>
              <p className="font-mono text-xl font-bold tabular-nums">
                {formatAmount(totalTaxAmount)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Effective Rate</p>
              <p className="text-xl font-bold">
                {totalTaxableAmount > 0
                  ? ((totalTaxAmount / totalTaxableAmount) * 100).toFixed(1)
                  : "0.0"}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export {
  TaxSummaryReport,
  type TaxSummaryReportProps,
  type TaxLine,
}
