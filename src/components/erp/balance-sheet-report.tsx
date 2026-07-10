"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DownloadIcon, PrinterIcon } from "lucide-react"

interface BalanceSheetSection {
  title: string
  items: {
    code: string
    name: string
    amount: number
    previousAmount?: number
  }[]
  total: number
  previousTotal?: number
}

interface BalanceSheetReportProps {
  companyName: string
  reportDate: string
  previousDate?: string
  assets: BalanceSheetSection
  liabilities: BalanceSheetSection
  equity: BalanceSheetSection
  onExport?: () => void
  onPrint?: () => void
  className?: string
}

function BalanceSheetReport({
  companyName,
  reportDate,
  previousDate,
  assets,
  liabilities,
  equity,
  onExport,
  onPrint,
  className,
}: BalanceSheetReportProps) {
  const totalLiabilitiesAndEquity = liabilities.total + equity.total

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const renderSection = (section: BalanceSheetSection, showPrevious: boolean) => (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {section.title}
      </h4>
      <div className="rounded-lg border">
        {section.items.map((item, idx) => (
          <div
            key={item.code}
            className={cn(
              "flex items-center justify-between px-4 py-2 text-sm",
              idx !== section.items.length - 1 && "border-b"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{item.code}</span>
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-8">
              {showPrevious && item.previousAmount !== undefined && (
                <span className="font-mono text-sm tabular-nums text-muted-foreground">
                  {formatAmount(item.previousAmount)}
                </span>
              )}
              <span className="font-mono text-sm tabular-nums font-medium">
                {formatAmount(item.amount)}
              </span>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-2 text-sm font-medium bg-muted/50 border-t">
          <span>Total {section.title}</span>
          <div className="flex items-center gap-8">
            {showPrevious && section.previousTotal !== undefined && (
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {formatAmount(section.previousTotal)}
              </span>
            )}
            <span className="font-mono text-sm tabular-nums">
              {formatAmount(section.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Balance Sheet</CardTitle>
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            {renderSection(assets, !!previousDate)}
          </div>
          <div className="space-y-6">
            {renderSection(liabilities, !!previousDate)}
            {renderSection(equity, !!previousDate)}
          </div>
        </div>

        <Separator />

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="font-mono text-xl font-bold tabular-nums">
                {formatAmount(assets.total)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Liabilities</p>
              <p className="font-mono text-xl font-bold tabular-nums">
                {formatAmount(liabilities.total)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Equity</p>
              <p className="font-mono text-xl font-bold tabular-nums">
                {formatAmount(equity.total)}
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Liabilities + Equity</span>
            <span className="font-mono text-xl font-bold tabular-nums">
              {formatAmount(totalLiabilitiesAndEquity)}
            </span>
          </div>
          {Math.abs(assets.total - totalLiabilitiesAndEquity) < 0.01 ? (
            <p className="mt-2 text-center text-sm text-green-600 font-medium">
              Balance Sheet is balanced
            </p>
          ) : (
            <p className="mt-2 text-center text-sm text-destructive font-medium">
              Difference: {formatAmount(assets.total - totalLiabilitiesAndEquity)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export {
  BalanceSheetReport,
  type BalanceSheetReportProps,
  type BalanceSheetSection,
}
