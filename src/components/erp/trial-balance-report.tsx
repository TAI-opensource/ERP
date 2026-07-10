"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DownloadIcon, PrinterIcon } from "lucide-react"

interface TrialBalanceLine {
  code: string
  name: string
  debit: number
  credit: number
}

interface TrialBalanceReportProps {
  companyName: string
  reportDate: string
  lines: TrialBalanceLine[]
  totalDebit: number
  totalCredit: number
  onExport?: () => void
  onPrint?: () => void
  className?: string
}

function TrialBalanceReport({
  companyName,
  reportDate,
  lines,
  totalDebit,
  totalCredit,
  onExport,
  onPrint,
  className,
}: TrialBalanceReportProps) {
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Trial Balance</CardTitle>
            <p className="text-sm text-muted-foreground">{companyName}</p>
            <p className="text-sm text-muted-foreground">As of {reportDate}</p>
          </div>
          <div className="flex items-center gap-2">
            {isBalanced ? (
              <Badge variant="outline" className="text-green-600 border-green-200">
                Balanced
              </Badge>
            ) : (
              <Badge variant="destructive">
                Unbalanced
              </Badge>
            )}
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
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 text-sm font-medium">Account</th>
                <th className="text-right px-4 py-3 text-sm font-medium w-[150px]">Debit</th>
                <th className="text-right px-4 py-3 text-sm font-medium w-[150px]">Credit</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => (
                <tr
                  key={line.code}
                  className={cn(idx !== lines.length - 1 && "border-b")}
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{line.name}</span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-2 font-mono text-sm tabular-nums">
                    {line.debit > 0 ? formatAmount(line.debit) : ""}
                  </td>
                  <td className="text-right px-4 py-2 font-mono text-sm tabular-nums">
                    {line.credit > 0 ? formatAmount(line.credit) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 bg-muted/50 font-medium">
                <td className="px-4 py-3 text-sm">Total</td>
                <td className="text-right px-4 py-3 font-mono text-sm tabular-nums">
                  {formatAmount(totalDebit)}
                </td>
                <td className="text-right px-4 py-3 font-mono text-sm tabular-nums">
                  {formatAmount(totalCredit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Total Debit: </span>
              <span className="font-mono text-sm font-medium tabular-nums">{formatAmount(totalDebit)}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Total Credit: </span>
              <span className="font-mono text-sm font-medium tabular-nums">{formatAmount(totalCredit)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Difference: </span>
            <span className={cn(
              "font-mono text-sm font-bold tabular-nums",
              isBalanced ? "text-green-600" : "text-destructive"
            )}>
              {formatAmount(Math.abs(totalDebit - totalCredit))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export {
  TrialBalanceReport,
  type TrialBalanceReportProps,
  type TrialBalanceLine,
}
