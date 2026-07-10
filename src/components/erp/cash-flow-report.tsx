"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DownloadIcon, PrinterIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"

interface CashFlowLine {
  code: string
  name: string
  amount: number
  previousAmount?: number
}

interface CashFlowSection {
  title: string
  items: CashFlowLine[]
  total: number
  previousTotal?: number
}

interface CashFlowReportProps {
  companyName: string
  periodStart: string
  periodEnd: string
  previousPeriodStart?: string
  previousPeriodEnd?: string
  operatingActivities: CashFlowSection
  investingActivities: CashFlowSection
  financingActivities: CashFlowSection
  openingCashBalance: number
  closingCashBalance: number
  previousOpeningBalance?: number
  previousClosingBalance?: number
  onExport?: () => void
  onPrint?: () => void
  className?: string
}

function CashFlowReport({
  companyName,
  periodStart,
  periodEnd,
  previousPeriodStart,
  previousPeriodEnd,
  operatingActivities,
  investingActivities,
  financingActivities,
  openingCashBalance,
  closingCashBalance,
  previousOpeningBalance,
  previousClosingBalance,
  onExport,
  onPrint,
  className,
}: CashFlowReportProps) {
  const netChange = closingCashBalance - openingCashBalance
  const previousNetChange = previousClosingBalance !== undefined && previousOpeningBalance !== undefined
    ? previousClosingBalance - previousOpeningBalance
    : undefined

  const showPrevious = !!(previousPeriodStart && previousPeriodEnd)

  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const renderSection = (section: CashFlowSection) => (
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
              <span className={cn(
                "font-mono text-sm tabular-nums font-medium",
                item.amount >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {item.amount >= 0 ? "+" : ""}{formatAmount(item.amount)}
              </span>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-2 text-sm font-medium bg-muted/50 border-t">
          <span>Net Cash from {section.title}</span>
          <div className="flex items-center gap-8">
            {showPrevious && section.previousTotal !== undefined && (
              <span className={cn(
                "font-mono text-sm tabular-nums text-muted-foreground",
              )}>
                {section.previousTotal >= 0 ? "+" : ""}{formatAmount(section.previousTotal)}
              </span>
            )}
            <span className={cn(
              "font-mono text-sm tabular-nums",
              section.total >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {section.total >= 0 ? "+" : ""}{formatAmount(section.total)}
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
            <CardTitle className="text-xl">Cash Flow Statement</CardTitle>
            <p className="text-sm text-muted-foreground">{companyName}</p>
            <p className="text-sm text-muted-foreground">
              {periodStart} - {periodEnd}
              {showPrevious && ` (vs ${previousPeriodStart} - ${previousPeriodEnd})`}
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
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Opening Cash Balance</span>
            <span className="font-mono text-sm font-bold tabular-nums">
              {formatAmount(openingCashBalance)}
            </span>
          </div>
        </div>

        {renderSection(operatingActivities)}

        <Separator />

        {renderSection(investingActivities)}

        <Separator />

        {renderSection(financingActivities)}

        <Separator />

        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Net Change in Cash</span>
            <div className="flex items-center gap-2">
              {netChange >= 0 ? (
                <TrendingUpIcon className="size-4 text-green-600" />
              ) : (
                <TrendingDownIcon className="size-4 text-red-600" />
              )}
              <span className={cn(
                "font-mono text-lg font-bold tabular-nums",
                netChange >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {netChange >= 0 ? "+" : ""}{formatAmount(netChange)}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm">Opening Balance</span>
            <span className="font-mono text-sm tabular-nums">
              {formatAmount(openingCashBalance)}
            </span>
          </div>

          <div className="flex items-center justify-between font-medium">
            <span>Closing Cash Balance</span>
            <span className="font-mono text-lg font-bold tabular-nums">
              {formatAmount(closingCashBalance)}
            </span>
          </div>
        </div>

        {showPrevious && previousNetChange !== undefined && (
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Period Net Change</span>
              <span className={cn(
                "font-mono text-sm tabular-nums",
                previousNetChange >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {previousNetChange >= 0 ? "+" : ""}{formatAmount(previousNetChange)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export {
  CashFlowReport,
  type CashFlowReportProps,
  type CashFlowLine,
  type CashFlowSection,
}
