"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  PlusIcon,
  EditIcon,
  Trash2Icon,
  CheckIcon,
  XIcon,
  SendIcon,
  MessageSquareIcon,
  UploadIcon,
  DownloadIcon,
  LogInIcon,
  LogOutIcon,
  RefreshCwIcon,
  ClockIcon,
  MoreHorizontalIcon,
  FilterIcon,
  ChevronDownIcon,
} from "lucide-react"

type ActivityType =
  | "created"
  | "updated"
  | "deleted"
  | "approved"
  | "rejected"
  | "sent"
  | "received"
  | "commented"
  | "uploaded"
  | "downloaded"
  | "logged_in"
  | "logged_out"
  | "status_changed"
  | "assigned"
  | "merged"
  | "exported"
  | "imported"
  | "custom"

interface ActivityUser {
  name: string
  avatar?: string
  email?: string
}

interface ActivityItem {
  id: string
  type: ActivityType
  user: ActivityUser
  description: string
  details?: string
  timestamp: string
  icon?: React.ReactNode
  color?: string
  badge?: { label: string; variant?: "default" | "secondary" | "destructive" | "outline" }
  attachments?: { name: string; url: string; type?: string }[]
  metadata?: Record<string, unknown>
}

interface ActivityLogProps {
  activities: ActivityItem[]
  onActivityClick?: (activity: ActivityItem) => void
  onUserClick?: (user: ActivityUser) => void
  onReply?: (activity: ActivityItem) => void
  onDelete?: (activity: ActivityItem) => void
  onEdit?: (activity: ActivityItem) => void
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
  filters?: { type: ActivityType; label: string }[]
  activeFilter?: ActivityType | null
  onFilterChange?: (filter: ActivityType | null) => void
  showUser?: boolean
  showTimestamp?: boolean
  showDetails?: boolean
  showAttachments?: boolean
  showActions?: boolean
  compact?: boolean
  maxItems?: number
  emptyMessage?: string
  className?: string
  itemClassName?: string
}

const activityTypeConfig: Record<ActivityType, { icon: React.ReactNode; color: string; label: string }> = {
  created: { icon: <PlusIcon className="size-3.5" />, color: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300", label: "Created" },
  updated: { icon: <EditIcon className="size-3.5" />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300", label: "Updated" },
  deleted: { icon: <Trash2Icon className="size-3.5" />, color: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300", label: "Deleted" },
  approved: { icon: <CheckIcon className="size-3.5" />, color: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300", label: "Approved" },
  rejected: { icon: <XIcon className="size-3.5" />, color: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300", label: "Rejected" },
  sent: { icon: <SendIcon className="size-3.5" />, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300", label: "Sent" },
  received: { icon: <DownloadIcon className="size-3.5" />, color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300", label: "Received" },
  commented: { icon: <MessageSquareIcon className="size-3.5" />, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300", label: "Commented" },
  uploaded: { icon: <UploadIcon className="size-3.5" />, color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300", label: "Uploaded" },
  downloaded: { icon: <DownloadIcon className="size-3.5" />, color: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300", label: "Downloaded" },
  logged_in: { icon: <LogInIcon className="size-3.5" />, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", label: "Logged in" },
  logged_out: { icon: <LogOutIcon className="size-3.5" />, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", label: "Logged out" },
  status_changed: { icon: <RefreshCwIcon className="size-3.5" />, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300", label: "Status changed" },
  assigned: { icon: <PlusIcon className="size-3.5" />, color: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300", label: "Assigned" },
  merged: { icon: <RefreshCwIcon className="size-3.5" />, color: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300", label: "Merged" },
  exported: { icon: <DownloadIcon className="size-3.5" />, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300", label: "Exported" },
  imported: { icon: <UploadIcon className="size-3.5" />, color: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300", label: "Imported" },
  custom: { icon: <MoreHorizontalIcon className="size-3.5" />, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", label: "Custom" },
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  })
}

function ActivityItemComponent({
  activity,
  onActivityClick,
  onUserClick,
  onReply,
  onDelete,
  onEdit,
  showUser = true,
  showTimestamp = true,
  showDetails = true,
  showAttachments = true,
  showActions = true,
  compact = false,
  className,
}: {
  activity: ActivityItem
  onActivityClick?: ActivityLogProps["onActivityClick"]
  onUserClick?: ActivityLogProps["onUserClick"]
  onReply?: ActivityLogProps["onReply"]
  onDelete?: ActivityLogProps["onDelete"]
  onEdit?: ActivityLogProps["onEdit"]
  showUser?: boolean
  showTimestamp?: boolean
  showDetails?: boolean
  showAttachments?: boolean
  showActions?: boolean
  compact?: boolean
  className?: string
}) {
  const config = activityTypeConfig[activity.type] ?? activityTypeConfig.custom

  return (
    <div
      className={cn(
        "group flex gap-3",
        onActivityClick && "cursor-pointer",
        compact ? "py-2" : "py-3",
        className
      )}
      onClick={() => onActivityClick?.(activity)}
    >
      <div className="relative shrink-0">
        {showUser && (
          <Avatar className={cn(compact ? "size-7" : "size-8")}>
            <AvatarImage src={activity.user.avatar} />
            <AvatarFallback className="text-xs">
              {activity.user.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={cn(
            "absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full border-2 border-background",
            activity.color ?? config.color
          )}
        >
          {activity.icon ?? config.icon}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 text-sm">
            {showUser && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onUserClick?.(activity.user)
                }}
                className="font-medium text-foreground hover:underline"
              >
                {activity.user.name}
              </button>
            )}
            <span className="text-muted-foreground">{activity.description}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activity.badge && (
              <Badge variant={activity.badge.variant ?? "secondary"} className="text-[10px]">
                {activity.badge.label}
              </Badge>
            )}

            {showTimestamp && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTimestamp(activity.timestamp)}
              </span>
            )}

            {showActions && (onReply || onDelete || onEdit) && (
              <div className="opacity-0 group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" onClick={(e) => e.stopPropagation()} />}>
                    <MoreHorizontalIcon className="size-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onReply && (
                      <DropdownMenuItem onClick={() => onReply(activity)}>
                        Reply
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(activity)}>
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem onClick={() => onDelete(activity)} className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        {showDetails && activity.details && (
          <p className="mt-1 text-xs text-muted-foreground">{activity.details}</p>
        )}

        {showAttachments && activity.attachments && activity.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {activity.attachments.map((file, idx) => (
              <a
                key={idx}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <UploadIcon className="size-3" />
                {file.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityLog({
  activities,
  onActivityClick,
  onUserClick,
  onReply,
  onDelete,
  onEdit,
  onLoadMore,
  hasMore = false,
  loading = false,
  filters,
  activeFilter,
  onFilterChange,
  showUser = true,
  showTimestamp = true,
  showDetails = true,
  showAttachments = true,
  showActions = true,
  compact = false,
  maxItems,
  emptyMessage = "No activity yet",
  className,
  itemClassName,
}: ActivityLogProps) {
  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities

  return (
    <div className={cn("flex flex-col", className)}>
      {filters && filters.length > 0 && (
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <FilterIcon className="size-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => onFilterChange?.(null)}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                !activeFilter
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              All
            </button>
            {filters.map((filter) => (
              <button
                key={filter.type}
                onClick={() => onFilterChange?.(filter.type)}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  activeFilter === filter.type
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="max-h-[500px]">
        {displayActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ClockIcon className="mb-2 size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {displayActivities.map((activity) => (
              <ActivityItemComponent
                key={activity.id}
                activity={activity}
                onActivityClick={onActivityClick}
                onUserClick={onUserClick}
                onReply={onReply}
                onDelete={onDelete}
                onEdit={onEdit}
                showUser={showUser}
                showTimestamp={showTimestamp}
                showDetails={showDetails}
                showAttachments={showAttachments}
                showActions={showActions}
                compact={compact}
                className={itemClassName}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {hasMore && (
        <div className="flex justify-center border-t border-border pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCwIcon className="mr-1.5 size-3.5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load more
                <ChevronDownIcon className="ml-1.5 size-3.5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export { ActivityLog, ActivityItemComponent, activityTypeConfig, formatTimestamp, type ActivityItem, type ActivityType, type ActivityLogProps }
