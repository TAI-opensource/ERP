"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  DownloadIcon,
  InfoIcon,
} from "lucide-react"

type TrendDirection = "up" | "down" | "neutral"

interface MetricData {
  id: string
  title: string
  value: string | number
  previousValue?: string | number
  change?: number
  changeLabel?: string
  trend?: TrendDirection
  icon?: React.ReactNode
  color?: string
  description?: string
  suffix?: string
  prefix?: string
  sparkline?: number[]
  metadata?: Record<string, unknown>
}

interface MetricsCardProps {
  metric: MetricData
  onClick?: () => void
  onRefresh?: () => void
  onExport?: () => void
  onDetails?: () => void
  loading?: boolean
  compact?: boolean
  showTrend?: boolean
  showSparkline?: boolean
  showActions?: boolean
  showIcon?: boolean
  className?: string
  cardClassName?: string
  format?: "number" | "currency" | "percentage" | "compact"
  currency?: string
  decimals?: number
}

function formatValue(
  value: string | number,
  format: string,
  currency: string,
  decimals: number,
  prefix?: string,
  suffix?: string
): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  const effectiveSuffix = suffix ?? ""

  if (isNaN(num)) return String(value) + effectiveSuffix

  let formatted: string

  switch (format) {
    case "currency":
      formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num)
      break
    case "percentage":
      formatted = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num / 100)
      break
    case "compact":
      if (Math.abs(num) >= 1_000_000) {
        formatted = (num / 1_000_000).toFixed(1) + "M"
      } else if (Math.abs(num) >= 1_000) {
        formatted = (num / 1_000).toFixed(1) + "K"
      } else {
        formatted = num.toFixed(decimals)
      }
      break
    default:
      formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num)
  }

  return (prefix ?? "") + formatted + effectiveSuffix
}

function TrendIndicator({
  trend,
  change,
  label,
}: {
  trend?: TrendDirection
  change?: number
  label?: string
}) {
  const effectiveTrend = trend ?? (change !== undefined ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : undefined)

  if (effectiveTrend === undefined && change === undefined) return null

  const trendStyles: Record<string, string> = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  }

  const TrendIcon = effectiveTrend === "up" ? TrendingUpIcon : effectiveTrend === "down" ? TrendingDownIcon : MinusIcon

  return (
    <div className="flex items-center gap-1">
      <span className={cn("flex items-center gap-0.5 text-xs font-medium", trendStyles[effectiveTrend ?? "neutral"])}>
        <TrendIcon className="size-3" />
        {change !== undefined && (
          <span>{Math.abs(change).toFixed(1)}%</span>
        )}
      </span>
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  )
}

function MiniSparkline({ data, color = "currentColor", className }: { data: number[]; color?: string; className?: string }) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const height = 30
  const width = 80
  const padding = 2

  const points = data
    .map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - padding * 2)
      const y = height - padding - ((val - min) / range) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("shrink-0", className)}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MetricsCard({
  metric,
  onClick,
  onRefresh,
  onExport,
  onDetails,
  loading = false,
  compact = false,
  showTrend = true,
  showSparkline = false,
  showActions = false,
  showIcon = true,
  className,
  cardClassName,
  format = "number",
  currency = "USD",
  decimals = 0,
}: MetricsCardProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    if (!onRefresh) return
    setIsRefreshing(true)
    await onRefresh()
    setIsRefreshing(false)
  }

  if (loading) {
    return (
      <Card className={cn(cardClassName)}>
        <CardContent className={cn("flex flex-col gap-3", compact ? "p-3" : "p-4")}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  const displayValue = formatValue(metric.value, format, currency, decimals, metric.prefix, metric.suffix)

  return (
    <Card
      className={cn(
        "transition-shadow",
        onClick && "cursor-pointer hover:shadow-md",
        cardClassName
      )}
      onClick={onClick}
    >
      <CardContent className={cn("flex flex-col gap-3", compact ? "p-3" : "p-4")}>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className={cn("text-sm font-medium text-muted-foreground", compact && "text-xs")}>
              {metric.title}
            </p>
            {metric.description && (
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {showActions && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover/card:opacity-100">
                {onRefresh && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRefresh()
                    }}
                    disabled={isRefreshing}
                  >
                    <RefreshCwIcon className={cn("size-3", isRefreshing && "animate-spin")} />
                  </Button>
                )}
                {onExport && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onExport()
                    }}
                  >
                    <DownloadIcon className="size-3" />
                  </Button>
                )}
                {onDetails && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDetails()
                    }}
                  >
                    <InfoIcon className="size-3" />
                  </Button>
                )}
              </div>
            )}

            {showIcon && metric.icon && (
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  metric.color ?? "bg-primary/10 text-primary"
                )}
              >
                {metric.icon}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end gap-2">
          <span className={cn("font-bold tracking-tight", compact ? "text-xl" : "text-2xl")}>
            {displayValue}
          </span>

          {showSparkline && metric.sparkline && metric.sparkline.length > 1 && (
            <MiniSparkline
              data={metric.sparkline}
              color={
                metric.trend === "down" || (metric.change !== undefined && metric.change < 0)
                  ? "hsl(var(--destructive))"
                  : "hsl(var(--primary))"
              }
              className="h-[30px] w-[80px]"
            />
          )}
        </div>

        {showTrend && (
          <TrendIndicator
            trend={metric.trend}
            change={metric.change}
            label={metric.changeLabel}
          />
        )}
      </CardContent>
    </Card>
  )
}

interface MetricsGridProps {
  metrics: MetricData[]
  columns?: 2 | 3 | 4 | 5 | 6
  loading?: boolean
  format?: MetricsCardProps["format"]
  currency?: string
  decimals?: number
  showTrend?: boolean
  showSparkline?: boolean
  showActions?: boolean
  onMetricClick?: (metric: MetricData) => void
  className?: string
  cardClassName?: string
}

function MetricsGrid({
  metrics,
  columns = 4,
  loading = false,
  format = "number",
  currency = "USD",
  decimals = 0,
  showTrend = true,
  showSparkline = false,
  showActions = false,
  onMetricClick,
  className,
  cardClassName,
}: MetricsGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  }

  if (loading) {
    return (
      <div className={cn("grid gap-4", gridCols[columns], className)}>
        {Array.from({ length: columns }).map((_, i) => (
          <MetricsCard key={i} metric={{ id: String(i), title: "", value: "" }} loading />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {metrics.map((metric) => (
        <MetricsCard
          key={metric.id}
          metric={metric}
          format={format}
          currency={currency}
          decimals={decimals}
          showTrend={showTrend}
          showSparkline={showSparkline}
          showActions={showActions}
          onClick={onMetricClick ? () => onMetricClick(metric) : undefined}
          cardClassName={cardClassName}
        />
      ))}
    </div>
  )
}

export { MetricsCard, MetricsGrid, TrendIndicator, MiniSparkline, formatValue, type MetricData, type MetricsCardProps, type MetricsGridProps, type TrendDirection }
