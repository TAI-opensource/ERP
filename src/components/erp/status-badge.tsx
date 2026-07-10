"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type StatusType =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "completed"
  | "active"
  | "inactive"
  | "expired"
  | "paid"
  | "unpaid"
  | "partial"
  | "overdue"
  | "open"
  | "closed"
  | "resolved"
  | "new"
  | "in_progress"
  | "on_hold"
  | "custom"

interface StatusConfig {
  label: string
  color: string
  bgColor: string
  borderColor?: string
  icon?: React.ReactNode
  pulse?: boolean
}

interface StatusBadgeProps {
  status: StatusType | string
  config?: StatusConfig
  size?: "sm" | "default" | "lg"
  showIcon?: boolean
  showPulse?: boolean
  dot?: boolean
  className?: string
}

const defaultStatuses: Record<string, StatusConfig> = {
  draft: {
    label: "Draft",
    color: "text-gray-700 dark:text-gray-200",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
  pending: {
    label: "Pending",
    color: "text-yellow-700 dark:text-yellow-200",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    pulse: true,
  },
  approved: {
    label: "Approved",
    color: "text-green-700 dark:text-green-200",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    borderColor: "border-green-200 dark:border-green-800",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-700 dark:text-red-200",
    bgColor: "bg-red-100 dark:bg-red-900/50",
    borderColor: "border-red-200 dark:border-red-800",
  },
  processing: {
    label: "Processing",
    color: "text-blue-700 dark:text-blue-200",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    pulse: true,
  },
  shipped: {
    label: "Shipped",
    color: "text-indigo-700 dark:text-indigo-200",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/50",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  delivered: {
    label: "Delivered",
    color: "text-green-700 dark:text-green-200",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    borderColor: "border-green-200 dark:border-green-800",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700 dark:text-red-200",
    bgColor: "bg-red-100 dark:bg-red-900/50",
    borderColor: "border-red-200 dark:border-red-800",
  },
  completed: {
    label: "Completed",
    color: "text-green-700 dark:text-green-200",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    borderColor: "border-green-200 dark:border-green-800",
  },
  active: {
    label: "Active",
    color: "text-green-700 dark:text-green-200",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    borderColor: "border-green-200 dark:border-green-800",
  },
  inactive: {
    label: "Inactive",
    color: "text-gray-700 dark:text-gray-200",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
  expired: {
    label: "Expired",
    color: "text-orange-700 dark:text-orange-200",
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  paid: {
    label: "Paid",
    color: "text-green-700 dark:text-green-200",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    borderColor: "border-green-200 dark:border-green-800",
  },
  unpaid: {
    label: "Unpaid",
    color: "text-red-700 dark:text-red-200",
    bgColor: "bg-red-100 dark:bg-red-900/50",
    borderColor: "border-red-200 dark:border-red-800",
  },
  partial: {
    label: "Partial",
    color: "text-yellow-700 dark:text-yellow-200",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  overdue: {
    label: "Overdue",
    color: "text-red-700 dark:text-red-200",
    bgColor: "bg-red-100 dark:bg-red-900/50",
    borderColor: "border-red-200 dark:border-red-800",
    pulse: true,
  },
  open: {
    label: "Open",
    color: "text-blue-700 dark:text-blue-200",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  closed: {
    label: "Closed",
    color: "text-gray-700 dark:text-gray-200",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
  resolved: {
    label: "Resolved",
    color: "text-green-700 dark:text-green-200",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    borderColor: "border-green-200 dark:border-green-800",
  },
  new: {
    label: "New",
    color: "text-purple-700 dark:text-purple-200",
    bgColor: "bg-purple-100 dark:bg-purple-900/50",
    borderColor: "border-purple-200 dark:border-purple-800",
    pulse: true,
  },
  in_progress: {
    label: "In Progress",
    color: "text-blue-700 dark:text-blue-200",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    pulse: true,
  },
  on_hold: {
    label: "On Hold",
    color: "text-orange-700 dark:text-orange-200",
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
}

function StatusBadge({
  status,
  config: customConfig,
  size = "default",
  showIcon = false,
  showPulse = false,
  dot = false,
  className,
}: StatusBadgeProps) {
  const config = customConfig ?? defaultStatuses[status] ?? {
    label: status,
    color: "text-gray-700 dark:text-gray-200",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-200 dark:border-gray-700",
  }

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    default: "text-xs px-2 py-0.5 gap-1.5",
    lg: "text-sm px-3 py-1 gap-2",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        config.color,
        config.bgColor,
        config.borderColor,
        sizeClasses[size],
        config.pulse && showPulse && "animate-pulse",
        className
      )}
    >
      {dot && (
        <span className="relative flex size-2">
          {config.pulse && (
            <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-75", config.bgColor)} />
          )}
          <span className={cn("relative inline-flex size-2 rounded-full", config.bgColor.replace("/50", ""))} />
        </span>
      )}
      {showIcon && config.icon}
      {config.label}
    </span>
  )
}

interface StatusTimelineProps {
  statuses: { status: string; label: string; date?: string; user?: string; description?: string }[]
  currentStatus: string
  className?: string
}

function StatusTimeline({ statuses, currentStatus, className }: StatusTimelineProps) {
  const currentIdx = statuses.findIndex((s) => s.status === currentStatus)

  return (
    <div className={cn("flex items-center gap-0", className)}>
      {statuses.map((item, idx) => {
        const isComplete = idx <= currentIdx
        const isCurrent = item.status === currentStatus
        const config = defaultStatuses[item.status]

        return (
          <React.Fragment key={item.status}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 transition-colors",
                  isComplete
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground",
                  isCurrent && "ring-2 ring-primary/20"
                )}
              >
                {isComplete ? (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{idx + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isComplete ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              {item.date && (
                <span className="text-[10px] text-muted-foreground">{item.date}</span>
              )}
            </div>
            {idx < statuses.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-0.5 flex-1",
                  idx < currentIdx ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export { StatusBadge, StatusTimeline, defaultStatuses, type StatusConfig, type StatusBadgeProps, type StatusTimelineProps, type StatusType }
