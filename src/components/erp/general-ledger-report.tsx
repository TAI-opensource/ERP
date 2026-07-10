"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { DownloadIcon, PrinterIcon, SearchIcon } from "lucide-react"
import { format } from "date-fns"

interface GeneralLedgerEntry {
  id: string
  date: string
  voucherType: string
  voucherNumber: string
  accountCode: string
  accountName: string
  description: string
  debit: number
  credit: number
  balance: number
  costCenter?: string
}

interface GeneralLedgerReportProps {
  companyName: string
  periodStart: string
  periodEnd: string
  accountCode: string
  accountName: string
  openingBalance: number
  entries: GeneralLedgerEntry[]
  totalDebit: number
  totalCredit: number
  closingBalance: number
  onExport?: () => void
  onPrint?: () => void
  className?: string
}

function GeneralLedgerReport({
  companyName,
  periodStart,
  periodEnd,
  accountCode,
  accountName,
  openingBalance,
  entries,
  totalDebit,
  totalCredit,
  closingBalance,
  onExport,
  onPrint,
  className,
}: GeneralLedgerReportProps) {
  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">General Ledger</CardTitle>
            <p className="text-sm text-muted-foreground">{companyName}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="font-mono">{accountCode}</Badge>
              <span className="text-sm">{accountName}</span>
            </div>
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
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Opening Balance</span>
            <span className="font-mono text-sm font-bold tabular-nums">
              {formatAmount(openingBalance)}
            </span>
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Voucher #</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Cost Center</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No entries found
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">
                      {format(new Date(entry.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {entry.voucherType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{entry.voucherNumber}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{entry.description}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.costCenter || "-"}</TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {entry.debit > 0 ? (
                        <span className="text-foreground">{formatAmount(entry.debit)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {entry.credit > 0 ? (
                        <span className="text-foreground">{formatAmount(entry.credit)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium tabular-nums">
                      {formatAmount(entry.balance)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <tfoot>
              <tr className="border-t-2 bg-muted/50 font-medium">
                <td className="px-4 py-3 text-sm" colSpan={5}>Total</td>
                <td className="text-right px-4 py-3 font-mono text-sm tabular-nums">
                  {formatAmount(totalDebit)}
                </td>
                <td className="text-right px-4 py-3 font-mono text-sm tabular-nums">
                  {formatAmount(totalCredit)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Closing Balance</span>
            <span className={cn(
              "font-mono text-sm font-bold tabular-nums",
              closingBalance >= 0 ? "text-foreground" : "text-destructive"
            )}>
              {formatAmount(closingBalance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export {
  GeneralLedgerReport,
  type GeneralLedgerReportProps,
  type GeneralLedgerEntry,
}
