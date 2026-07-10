"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DownloadIcon, PrinterIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"

interface PLLineItem {
  code: string
  name: string
  amount: number
  previousAmount?: number
  percentOfRevenue?: number
}

interface PLSection {
  title: string
  items: PLLineItem[]
  total: number
  previousTotal?: number
}

interface ProfitLossReportProps {
  companyName: string
  periodStart: string
  periodEnd: string
  previousPeriodStart?: string
  previousPeriodEnd?: string
  revenue: PLSection
  costOfGoodsSold: PLSection
  operatingExpenses: PLSection
  otherIncome?: PLSection
  otherExpenses?: PLSection
  tax?: {
    amount: number
    previousAmount?: number
  }
  onExport?: () => void
  onPrint?: () => void
  className?: string
}

function ProfitLossReport({
  companyName,
  periodStart,
  periodEnd,
  previousPeriodStart,
  previousPeriodEnd,
  revenue,
  costOfGoodsSold,
  operatingExpenses,
  otherIncome,
  otherExpenses,
  tax,
  onExport,
  onPrint,
  className,
}: ProfitLossReportProps) {
  const grossProfit = revenue.total - costOfGoodsSold.total
  const grossProfitMargin = revenue.total > 0 ? (grossProfit / revenue.total) * 100 : 0

  const operatingProfit = grossProfit - operatingExpenses.total
  const operatingMargin = revenue.total > 0 ? (operatingProfit / revenue.total) * 100 : 0

  const otherIncomeTotal = otherIncome?.total ?? 0
  const otherExpensesTotal = otherExpenses?.total ?? 0

  const profitBeforeTax = operatingProfit + otherIncomeTotal - otherExpensesTotal
  const taxAmount = tax?.amount ?? 0
  const netProfit = profitBeforeTax - taxAmount
  const netProfitMargin = revenue.total > 0 ? (netProfit / revenue.total) * 100 : 0

  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const showPrevious = !!(previousPeriodStart && previousPeriodEnd)

  const renderSection = (section: PLSection, indent = false) => (
    <div className="space-y-2">
      <h4 className={cn("font-medium text-sm text-muted-foreground uppercase tracking-wide", indent && "ml-4")}>
        {section.title}
      </h4>
      <div className={cn("rounded-lg border", indent && "ml-4")}>
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
              {item.percentOfRevenue !== undefined && (
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {item.percentOfRevenue.toFixed(1)}%
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

  const renderSummaryLine = (label: string, amount: number, previousAmount?: number, highlight = false) => (
    <div className={cn("flex items-center justify-between px-4 py-2", highlight && "bg-muted/50 rounded")}>
      <span className={cn("text-sm", highlight && "font-medium")}>{label}</span>
      <div className="flex items-center gap-8">
        {showPrevious && previousAmount !== undefined && (
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {formatAmount(previousAmount)}
          </span>
        )}
        <span className={cn("font-mono text-sm tabular-nums", highlight && "font-bold")}>
          {formatAmount(amount)}
        </span>
      </div>
    </div>
  )

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Profit & Loss Statement</CardTitle>
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
        {renderSection(revenue)}

        <Separator />

        {renderSection(costOfGoodsSold, true)}

        <div className="rounded-lg border bg-muted/30 p-4">
          {renderSummaryLine("Gross Profit", grossProfit, undefined, true)}
          <div className="px-4 py-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Gross Margin:</span>
              <span className={cn("text-sm font-medium", grossProfitMargin >= 0 ? "text-green-600" : "text-red-600")}>
                {grossProfitMargin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {renderSection(operatingExpenses, true)}

        <div className="rounded-lg border bg-muted/30 p-4">
          {renderSummaryLine("Operating Profit (EBIT)", operatingProfit, undefined, true)}
          <div className="px-4 py-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Operating Margin:</span>
              <span className={cn("text-sm font-medium", operatingMargin >= 0 ? "text-green-600" : "text-red-600")}>
                {operatingMargin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {(otherIncome || otherExpenses) && (
          <>
            <Separator />
            {otherIncome && renderSection(otherIncome, true)}
            {otherExpenses && renderSection(otherExpenses, true)}
          </>
        )}

        <Separator />

        <div className="space-y-2">
          {renderSummaryLine("Profit Before Tax", profitBeforeTax)}

          {tax && (
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm ml-4">Tax</span>
              <div className="flex items-center gap-8">
                {showPrevious && tax.previousAmount !== undefined && (
                  <span className="font-mono text-sm tabular-nums text-muted-foreground">
                    ({formatAmount(tax.previousAmount)})
                  </span>
                )}
                <span className="font-mono text-sm tabular-nums text-red-600">
                  ({formatAmount(taxAmount)})
                </span>
              </div>
            </div>
          )}

          <div className="rounded-lg border bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">Net Profit</span>
                {netProfit >= 0 ? (
                  <TrendingUpIcon className="size-4 text-green-600" />
                ) : (
                  <TrendingDownIcon className="size-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-8">
                {showPrevious && tax?.previousAmount !== undefined && (
                  <span className="font-mono text-lg tabular-nums text-muted-foreground">
                    {formatAmount(0)}
                  </span>
                )}
                <span className={cn(
                  "font-mono text-lg font-bold tabular-nums",
                  netProfit >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {formatAmount(netProfit)}
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Net Profit Margin:</span>
              <span className={cn("text-sm font-medium", netProfitMargin >= 0 ? "text-green-600" : "text-red-600")}>
                {netProfitMargin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export {
  ProfitLossReport,
  type ProfitLossReportProps,
  type PLLineItem,
  type PLSection,
}
