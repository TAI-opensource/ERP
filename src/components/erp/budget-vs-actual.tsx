"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DownloadIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"

interface BudgetVsActualLine {
  accountId: string
  accountCode: string
  accountName: string
  budgetAmount: number
  actualAmount: number
  variance: number
  variancePercent: number
}

interface BudgetVsActualProps {
  budgetName: string
  fiscalYear: string
  lines: BudgetVsActualLine[]
  totalBudget: number
  totalActual: number
  totalVariance: number
  onExport?: () => void
  periodFilter?: string
  onPeriodChange?: (period: string) => void
  className?: string
}

const periods = [
  { value: "ytd", label: "Year to Date" },
  { value: "q1", label: "Q1" },
  { value: "q2", label: "Q2" },
  { value: "q3", label: "Q3" },
  { value: "q4", label: "Q4" },
  { value: "jan", label: "January" },
  { value: "feb", label: "February" },
  { value: "mar", label: "March" },
  { value: "apr", label: "April" },
  { value: "may", label: "May" },
  { value: "jun", label: "June" },
  { value: "jul", label: "July" },
  { value: "aug", label: "August" },
  { value: "sep", label: "September" },
  { value: "oct", label: "October" },
  { value: "nov", label: "November" },
  { value: "dec", label: "December" },
]

function BudgetVsActual({
  budgetName,
  fiscalYear,
  lines,
  totalBudget,
  totalActual,
  totalVariance,
  onExport,
  periodFilter = "ytd",
  onPeriodChange,
  className,
}: BudgetVsActualProps) {
  const totalVariancePercent = React.useMemo(() => {
    if (totalBudget === 0) return 0
    return ((totalActual - totalBudget) / totalBudget) * 100
  }, [totalBudget, totalActual])

  const overBudgetLines = React.useMemo(
    () => lines.filter((l) => l.actualAmount > l.budgetAmount).length,
    [lines]
  )

  const underBudgetLines = React.useMemo(
    () => lines.filter((l) => l.actualAmount <= l.budgetAmount).length,
    [lines]
  )

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Budget vs Actual - {budgetName}</CardTitle>
              <p className="text-sm text-muted-foreground">Fiscal Year {fiscalYear}</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={periodFilter} onValueChange={(v) => onPeriodChange?.(v ?? "all")}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="font-mono text-xl font-bold tabular-nums">
                {totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Actual</p>
              <p className="font-mono text-xl font-bold tabular-nums">
                {totalActual.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={cn(
              "rounded-lg border p-4",
              totalVariance > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
            )}>
              <p className="text-sm text-muted-foreground">Variance</p>
              <div className="flex items-center gap-2">
                <p className={cn(
                  "font-mono text-xl font-bold tabular-nums",
                  totalVariance > 0 ? "text-red-600" : "text-green-600"
                )}>
                  {totalVariance > 0 ? "+" : ""}{totalVariance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                {totalVariance > 0 ? (
                  <TrendingUpIcon className="size-5 text-red-600" />
                ) : (
                  <TrendingDownIcon className="size-5 text-green-600" />
                )}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Variance %</p>
              <p className={cn(
                "font-mono text-xl font-bold tabular-nums",
                totalVariancePercent > 0 ? "text-red-600" : "text-green-600"
              )}>
                {totalVariancePercent > 0 ? "+" : ""}{totalVariancePercent.toFixed(1)}%
              </p>
              <div className="mt-1 flex gap-2">
                <Badge variant="outline" className="text-xs">
                  <span className="text-green-600">{underBudgetLines} under</span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <span className="text-red-600">{overBudgetLines} over</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-right">Variance %</TableHead>
                  <TableHead className="w-[150px]">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No budget data available
                    </TableCell>
                  </TableRow>
                ) : (
                  lines.map((line) => {
                    const isOver = line.variance > 0
                    const utilizationPercent = line.budgetAmount > 0
                      ? Math.min((line.actualAmount / line.budgetAmount) * 100, 100)
                      : 0

                    return (
                      <TableRow key={line.accountId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">{line.accountCode}</span>
                            <span className="text-sm">{line.accountName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm tabular-nums">
                          {line.budgetAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm tabular-nums">
                          {line.actualAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-mono text-sm tabular-nums font-medium",
                          isOver ? "text-red-600" : "text-green-600"
                        )}>
                          {line.variance > 0 ? "+" : ""}{line.variance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-mono text-sm tabular-nums",
                          isOver ? "text-red-600" : "text-green-600"
                        )}>
                          {line.variancePercent > 0 ? "+" : ""}{line.variancePercent.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  utilizationPercent > 100 ? "bg-red-500" : utilizationPercent > 80 ? "bg-yellow-500" : "bg-green-500"
                                )}
                                style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs tabular-nums w-10 text-right">
                              {utilizationPercent.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
                {lines.length > 0 && (
                  <TableRow className="font-medium bg-muted/50">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {totalActual.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-mono text-sm tabular-nums",
                      totalVariance > 0 ? "text-red-600" : "text-green-600"
                    )}>
                      {totalVariance > 0 ? "+" : ""}{totalVariance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-mono text-sm tabular-nums",
                      totalVariancePercent > 0 ? "text-red-600" : "text-green-600"
                    )}>
                      {totalVariancePercent > 0 ? "+" : ""}{totalVariancePercent.toFixed(1)}%
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export {
  BudgetVsActual,
  type BudgetVsActualProps,
  type BudgetVsActualLine,
  periods,
}
