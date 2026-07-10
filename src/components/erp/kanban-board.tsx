"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVerticalIcon, PlusIcon, MoreHorizontalIcon, XIcon } from "lucide-react"

interface KanbanCard {
  id: string
  title: string
  description?: string
  priority?: "low" | "medium" | "high" | "urgent"
  assignee?: string
  assigneeAvatar?: string
  tags?: { label: string; color?: string }[]
  dueDate?: string
  value?: number
  currency?: string
  metadata?: Record<string, unknown>
}

interface KanbanColumn {
  id: string
  title: string
  color?: string
  cards: KanbanCard[]
  limit?: number
  icon?: React.ReactNode
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string, toIndex: number) => void
  onCardClick?: (card: KanbanCard, columnId: string) => void
  onAddCard?: (columnId: string) => void
  onDeleteCard?: (cardId: string, columnId: string) => void
  onEditCard?: (card: KanbanCard, columnId: string) => void
  renderCard?: (card: KanbanCard, columnId: string) => React.ReactNode
  renderColumnHeader?: (column: KanbanColumn) => React.ReactNode
  draggable?: boolean
  showValue?: boolean
  showPriority?: boolean
  showAvatar?: boolean
  showTags?: boolean
  showDueDate?: boolean
  emptyMessage?: string
  className?: string
  cardClassName?: string
  columnClassName?: string
  maxHeight?: string
}

function PriorityBadge({ priority }: { priority: KanbanCard["priority"] }) {
  const variants: Record<string, string> = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }

  if (!priority) return null

  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", variants[priority])}>
      {priority}
    </span>
  )
}

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
}

function KanbanCardItem({
  card,
  columnId,
  draggable,
  onCardClick,
  onDeleteCard,
  onEditCard,
  renderCard,
  showValue,
  showPriority,
  showAvatar,
  showTags,
  showDueDate,
  className,
}: {
  card: KanbanCard
  columnId: string
  draggable: boolean
  onCardClick?: KanbanBoardProps["onCardClick"]
  onDeleteCard?: KanbanBoardProps["onDeleteCard"]
  onEditCard?: KanbanBoardProps["onEditCard"]
  renderCard?: KanbanBoardProps["renderCard"]
  showValue?: boolean
  showPriority?: boolean
  showAvatar?: boolean
  showTags?: boolean
  showDueDate?: boolean
  className?: string
}) {
  const [isDragging, setIsDragging] = React.useState(false)

  if (renderCard) {
    return renderCard(card, columnId)
  }

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("cardId", card.id)
        e.dataTransfer.setData("fromColumn", columnId)
        setIsDragging(true)
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={() => onCardClick?.(card, columnId)}
      className={cn(
        "group/card rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md",
        draggable && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50",
        card.priority === "urgent" && "border-l-4 border-l-red-500",
        card.priority === "high" && "border-l-4 border-l-orange-500",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          {showPriority && card.priority && <PriorityBadge priority={card.priority} />}
          <h4 className="text-sm font-medium text-foreground">{card.title}</h4>
          {card.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">{card.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100">
          {onEditCard && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEditCard(card, columnId)
              }}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <MoreHorizontalIcon className="size-3.5" />
            </button>
          )}
          {onDeleteCard && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteCard(card.id, columnId)
              }}
              className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {showTags && card.tags && card.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {card.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              style={tag.color ? { backgroundColor: tag.color + "20", color: tag.color } : undefined}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showAvatar && card.assignee && (
            <div className="flex items-center gap-1.5">
              {card.assigneeAvatar ? (
                <img src={card.assigneeAvatar} alt={card.assignee} className="size-5 rounded-full" />
              ) : (
                <div className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {card.assignee.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs text-muted-foreground">{card.assignee}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showDueDate && card.dueDate && (
            <span className="text-[10px] text-muted-foreground">{card.dueDate}</span>
          )}
          {showValue && card.value !== undefined && (
            <span className="text-xs font-medium text-foreground">
              {formatCurrency(card.value, card.currency)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function KanbanBoard({
  columns,
  onCardMove,
  onCardClick,
  onAddCard,
  onDeleteCard,
  onEditCard,
  renderCard,
  renderColumnHeader,
  draggable = true,
  showValue = false,
  showPriority = true,
  showAvatar = true,
  showTags = true,
  showDueDate = false,
  emptyMessage = "No cards",
  className,
  cardClassName,
  columnClassName,
  maxHeight = "calc(100vh - 280px)",
}: KanbanBoardProps) {
  const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault()
    setDragOverColumn(null)

    const cardId = e.dataTransfer.getData("cardId")
    const fromColumnId = e.dataTransfer.getData("fromColumn")

    if (!cardId || !fromColumnId) return

    const fromCol = columns.find((c) => c.id === fromColumnId)
    const toCol = columns.find((c) => c.id === toColumnId)
    if (!fromCol || !toCol) return

    const cardIndex = fromCol.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) return

    onCardMove?.(cardId, fromColumnId, toColumnId, toCol.cards.length)
  }

  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
      {columns.map((column) => {
        const isOver = dragOverColumn === column.id
        const isFull = column.limit !== undefined && column.cards.length >= column.limit

        return (
          <div
            key={column.id}
            className={cn(
              "flex min-w-[280px] flex-col rounded-xl border border-border bg-muted/30",
              isOver && "ring-2 ring-primary/50",
              columnClassName
            )}
            onDragOver={draggable ? (e) => handleDragOver(e, column.id) : undefined}
            onDragLeave={draggable ? handleDragLeave : undefined}
            onDrop={draggable ? (e) => handleDrop(e, column.id) : undefined}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              {renderColumnHeader ? (
                renderColumnHeader(column)
              ) : (
                <div className="flex items-center gap-2">
                  {column.color && (
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                  )}
                  {column.icon}
                  <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="ml-1">
                    {column.cards.length}
                  </Badge>
                </div>
              )}

              {onAddCard && !isFull && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onAddCard(column.id)}
                >
                  <PlusIcon className="size-4" />
                </Button>
              )}
            </div>

            <div
              className="flex flex-1 flex-col gap-2 overflow-y-auto p-2"
              style={{ maxHeight }}
            >
              {column.cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                </div>
              ) : (
                column.cards.map((card) => (
                  <KanbanCardItem
                    key={card.id}
                    card={card}
                    columnId={column.id}
                    draggable={draggable}
                    onCardClick={onCardClick}
                    onDeleteCard={onDeleteCard}
                    onEditCard={onEditCard}
                    renderCard={renderCard}
                    showValue={showValue}
                    showPriority={showPriority}
                    showAvatar={showAvatar}
                    showTags={showTags}
                    showDueDate={showDueDate}
                    className={cardClassName}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { KanbanBoard, KanbanCardItem, PriorityBadge, formatCurrency, type KanbanCard, type KanbanColumn, type KanbanBoardProps }
