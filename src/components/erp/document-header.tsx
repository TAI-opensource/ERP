"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge, type StatusType } from "@/components/erp/status-badge"
import {
  MoreHorizontalIcon,
  PrinterIcon,
  DownloadIcon,
  SendIcon,
  CopyIcon,
  Trash2Icon,
  EditIcon,
  CheckIcon,
  XIcon,
  ArrowLeftIcon,
  ShareIcon,
  RefreshCwIcon,
  FileTextIcon,
  HistoryIcon,
  LockIcon,
  UnlockIcon,
  MessageSquareIcon,
  PaperclipIcon,
} from "lucide-react"

interface DocumentAction {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "destructive" | "ghost" | "outline"
  disabled?: boolean
  hidden?: boolean
  loading?: boolean
  shortcut?: string
  group?: "primary" | "secondary" | "danger"
}

interface DocumentHeaderProps {
  title: string
  subtitle?: string
  documentNumber?: string
  status?: StatusType | string
  statusConfig?: { label: string; color: string; bgColor: string }
  date?: string
  dueDate?: string
  author?: string
  authorAvatar?: string
  actions?: DocumentAction[]
  onBack?: () => void
  onPrint?: () => void
  onExport?: () => void
  onSend?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  onSave?: () => void
  onCancel?: () => void
  onApprove?: () => void
  onReject?: () => void
  onLock?: () => void
  isLocked?: boolean
  isEditing?: boolean
  isDirty?: boolean
  isSaving?: boolean
  showBackButton?: boolean
  showActions?: boolean
  showPrint?: boolean
  showExport?: boolean
  showSend?: boolean
  breadcrumbs?: { label: string; href?: string }[]
  meta?: { label: string; value: string }[]
  className?: string
  renderExtra?: () => React.ReactNode
}

function DocumentHeader({
  title,
  subtitle,
  documentNumber,
  status,
  statusConfig,
  date,
  dueDate,
  author,
  authorAvatar,
  actions = [],
  onBack,
  onPrint,
  onExport,
  onSend,
  onDuplicate,
  onDelete,
  onSave,
  onCancel,
  onApprove,
  onReject,
  onLock,
  isLocked = false,
  isEditing = false,
  isDirty = false,
  isSaving = false,
  showBackButton = true,
  showActions = true,
  showPrint = true,
  showExport = true,
  showSend = false,
  breadcrumbs,
  meta,
  className,
  renderExtra,
}: DocumentHeaderProps) {
  const primaryActions = actions.filter((a) => a.group === "primary" || !a.group).filter((a) => !a.hidden)
  const secondaryActions = actions.filter((a) => a.group === "secondary").filter((a) => !a.hidden)
  const dangerActions = actions.filter((a) => a.group === "danger").filter((a) => !a.hidden)

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-muted-foreground/50">/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {showBackButton && onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mt-0.5 shrink-0">
              <ArrowLeftIcon className="size-4" />
            </Button>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h1>
              {documentNumber && (
                <Badge variant="outline" className="font-mono">
                  {documentNumber}
                </Badge>
              )}
              {status && (
                <StatusBadge
                  status={status}
                  config={statusConfig}
                  dot
                  showPulse
                />
              )}
              {isLocked && (
                <Badge variant="secondary" className="gap-1">
                  <LockIcon className="size-3" />
                  Locked
                </Badge>
              )}
            </div>

            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {date && (
                <span className="flex items-center gap-1">
                  <FileTextIcon className="size-3" />
                  {date}
                </span>
              )}
              {dueDate && (
                <span className="flex items-center gap-1">
                  Due: {dueDate}
                </span>
              )}
              {author && (
                <span className="flex items-center gap-1.5">
                  {authorAvatar ? (
                    <img src={authorAvatar} alt={author} className="size-4 rounded-full" />
                  ) : (
                    <div className="flex size-4 items-center justify-center rounded-full bg-primary text-[8px] font-medium text-primary-foreground">
                      {author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {author}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isDirty && (
            <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400">
              Unsaved changes
            </Badge>
          )}

          {renderExtra?.()}

          {showPrint && onPrint && (
            <Button variant="outline" size="sm" onClick={onPrint}>
              <PrinterIcon className="size-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          )}

          {showExport && onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <DownloadIcon className="size-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}

          {showSend && onSend && (
            <Button size="sm" onClick={onSend}>
              <SendIcon className="size-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          )}

          {isEditing && onSave && (
            <Button size="sm" onClick={onSave} disabled={isSaving}>
              {isSaving ? (
                <RefreshCwIcon className="size-4 animate-spin" />
              ) : (
                <CheckIcon className="size-4" />
              )}
              Save
            </Button>
          )}

          {isEditing && onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <XIcon className="size-4" />
              Cancel
            </Button>
          )}

          {!isEditing && onApprove && (
            <Button size="sm" onClick={onApprove} className="bg-green-600 hover:bg-green-700">
              <CheckIcon className="size-4" />
              Approve
            </Button>
          )}

          {!isEditing && onReject && (
            <Button variant="destructive" size="sm" onClick={onReject}>
              <XIcon className="size-4" />
              Reject
            </Button>
          )}

          {showActions && (primaryActions.length > 0 || secondaryActions.length > 0 || dangerActions.length > 0 || onDuplicate || onDelete || onLock) && (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" />}>
                <MoreHorizontalIcon className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {primaryActions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className="gap-2"
                  >
                    {action.icon}
                    {action.label}
                    {action.shortcut && (
                      <span className="ml-auto text-xs text-muted-foreground">{action.shortcut}</span>
                    )}
                  </DropdownMenuItem>
                ))}

                {primaryActions.length > 0 && secondaryActions.length > 0 && <DropdownMenuSeparator />}

                {secondaryActions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className="gap-2"
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}

                {onLock && (
                  <>
                    {(primaryActions.length > 0 || secondaryActions.length > 0) && <DropdownMenuSeparator />}
                    <DropdownMenuItem onClick={onLock} className="gap-2">
                      {isLocked ? <UnlockIcon className="size-4" /> : <LockIcon className="size-4" />}
                      {isLocked ? "Unlock" : "Lock"}
                    </DropdownMenuItem>
                  </>
                )}

                {onDuplicate && (
                  <DropdownMenuItem onClick={onDuplicate} className="gap-2">
                    <CopyIcon className="size-4" />
                    Duplicate
                  </DropdownMenuItem>
                )}

                {(dangerActions.length > 0 || onDelete) && <DropdownMenuSeparator />}

                {dangerActions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}

                {onDelete && (
                  <DropdownMenuItem onClick={onDelete} className="gap-2 text-destructive focus:text-destructive">
                    <Trash2Icon className="size-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {meta && meta.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {meta.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{item.label}:</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      <Separator />
    </div>
  )
}

export { DocumentHeader, type DocumentAction, type DocumentHeaderProps }
