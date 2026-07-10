"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronRightIcon,
  ChevronDownIcon,
  SearchIcon,
  FolderIcon,
  FileIcon,
  PlusIcon,
  Trash2Icon,
  EditIcon,
  MoreHorizontalIcon,
} from "lucide-react"

interface TreeNode {
  id: string
  label: string
  code?: string
  description?: string
  icon?: React.ReactNode
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  children?: TreeNode[]
  disabled?: boolean
  type?: "folder" | "file" | "account" | "warehouse" | "category"
  level?: number
  metadata?: Record<string, unknown>
}

interface TreeViewProps {
  data: TreeNode[]
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  onSelect?: (node: TreeNode) => void
  onExpand?: (node: TreeNode, expanded: boolean) => void
  onAdd?: (parentId: string | null) => void
  onDelete?: (node: TreeNode) => void
  onRename?: (node: TreeNode) => void
  renderNode?: (node: TreeNode, state: { expanded: boolean; selected: boolean; depth: number }) => React.ReactNode
  searchable?: boolean
  searchPlaceholder?: string
  checkable?: boolean
  collapsible?: boolean
  showIcons?: boolean
  showBadges?: boolean
  showCode?: boolean
  defaultExpandedIds?: string[]
  expandedIds?: string[]
  emptyMessage?: string
  className?: string
  nodeClassName?: string
  maxHeight?: string
  multiSelect?: boolean
  dragEnabled?: boolean
  onDragEnd?: (nodeId: string, targetParentId: string | null) => void
}

function TreeNodeItem({
  node,
  depth = 0,
  selectedIds,
  expandedIds,
  internalExpanded,
  onToggle,
  onSelect,
  onCheck,
  onAdd,
  onDelete,
  onRename,
  renderNode,
  searchable,
  showIcons,
  showBadges,
  showCode,
  checkable,
  collapsible,
  nodeClassName,
  dragEnabled,
}: {
  node: TreeNode
  depth?: number
  selectedIds: string[]
  expandedIds: Set<string>
  internalExpanded: Set<string>
  onToggle: (id: string) => void
  onSelect: (node: TreeNode) => void
  onCheck: (id: string) => void
  onAdd?: (parentId: string) => void
  onDelete?: (node: TreeNode) => void
  onRename?: (node: TreeNode) => void
  renderNode?: TreeViewProps["renderNode"]
  searchable: boolean
  showIcons: boolean
  showBadges: boolean
  showCode: boolean
  checkable: boolean
  collapsible: boolean
  nodeClassName?: string
  dragEnabled?: boolean
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id) || internalExpanded.has(node.id)
  const isSelected = selectedIds.includes(node.id)

  const [isDragOver, setIsDragOver] = React.useState(false)

  if (renderNode) {
    return (
      <div
        className={cn(nodeClassName)}
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {renderNode(node, { expanded: isExpanded, selected: isSelected, depth })}
      </div>
    )
  }

  return (
    <div className={nodeClassName}>
      <div
        className={cn(
          "group/node flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors",
          "hover:bg-muted",
          isSelected && "bg-muted font-medium text-foreground",
          !isSelected && "text-foreground",
          node.disabled && "pointer-events-none opacity-50",
          isDragOver && "bg-primary/10 ring-1 ring-primary/30"
        )}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        draggable={dragEnabled}
        onDragStart={(e) => {
          e.dataTransfer.setData("nodeId", node.id)
        }}
        onDragOver={(e) => {
          if (hasChildren) {
            e.preventDefault()
            setIsDragOver(true)
          }
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
        }}
      >
        {collapsible && hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
            className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-muted"
          >
            {isExpanded ? (
              <ChevronDownIcon className="size-3.5" />
            ) : (
              <ChevronRightIcon className="size-3.5" />
            )}
          </button>
        ) : (
          <span className="size-5 shrink-0" />
        )}

        {checkable && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onCheck(node.id)}
            className="size-4"
          />
        )}

        {showIcons && (
          <span className="shrink-0 text-muted-foreground">
            {node.icon ?? (hasChildren ? <FolderIcon className="size-4" /> : <FileIcon className="size-4" />)}
          </span>
        )}

        <button
          className="flex flex-1 items-center gap-2 overflow-hidden text-left"
          onClick={() => onSelect(node)}
        >
          {showCode && node.code && (
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{node.code}</span>
          )}
          <span className="truncate">{node.label}</span>
        </button>

        {showBadges && node.badge && (
          <Badge variant={node.badgeVariant ?? "secondary"} className="shrink-0">
            {node.badge}
          </Badge>
        )}

        <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover/node:opacity-100">
          {onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAdd(node.id)
              }}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <PlusIcon className="size-3.5" />
            </button>
          )}
          {onRename && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRename(node)
              }}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <EditIcon className="size-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(node)
              }}
              className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2Icon className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {collapsible && hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              internalExpanded={internalExpanded}
              onToggle={onToggle}
              onSelect={onSelect}
              onCheck={onCheck}
              onAdd={onAdd}
              onDelete={onDelete}
              onRename={onRename}
              renderNode={renderNode}
              searchable={searchable}
              showIcons={showIcons}
              showBadges={showBadges}
              showCode={showCode}
              checkable={checkable}
              collapsible={collapsible}
              nodeClassName={nodeClassName}
              dragEnabled={dragEnabled}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TreeView({
  data,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  onSelect,
  onExpand,
  onAdd,
  onDelete,
  onRename,
  renderNode,
  searchable = false,
  searchPlaceholder = "Search...",
  checkable = false,
  collapsible = true,
  showIcons = true,
  showBadges = false,
  showCode = false,
  defaultExpandedIds = [],
  expandedIds: controlledExpandedIds,
  emptyMessage = "No items",
  className,
  nodeClassName,
  maxHeight,
  multiSelect = false,
  dragEnabled = false,
}: TreeViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [internalSelectedIds, setInternalSelectedIds] = React.useState<string[]>([])
  const [internalExpandedIds, setInternalExpandedIds] = React.useState<Set<string>>(
    new Set(defaultExpandedIds)
  )

  const selectedIds = controlledSelectedIds ?? internalSelectedIds
  const expandedIds = controlledExpandedIds ? new Set(controlledExpandedIds) : internalExpandedIds

  const toggleExpand = React.useCallback(
    (id: string) => {
      setInternalExpandedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    },
    []
  )

  const handleSelect = React.useCallback(
    (node: TreeNode) => {
      if (node.disabled) return

      if (multiSelect) {
        setInternalSelectedIds((prev) => {
          const isSelected = prev.includes(node.id)
          const next = isSelected
            ? prev.filter((id) => id !== node.id)
            : [...prev, node.id]
          onSelectionChange?.(next)
          return next
        })
      } else {
        const isSelected = selectedIds.includes(node.id)
        const next = isSelected ? [] : [node.id]
        setInternalSelectedIds(next)
        onSelectionChange?.(next)
      }
      onSelect?.(node)
    },
    [multiSelect, selectedIds, onSelectionChange, onSelect]
  )

  const handleCheck = React.useCallback(
    (id: string) => {
      setInternalSelectedIds((prev) => {
        const isSelected = prev.includes(id)
        const next = isSelected ? prev.filter((i) => i !== id) : [...prev, id]
        onSelectionChange?.(next)
        return next
      })
    },
    [onSelectionChange]
  )

  const filterTree = React.useCallback(
    (nodes: TreeNode[], query: string): TreeNode[] => {
      if (!query) return nodes
      const lower = query.toLowerCase()

      return nodes.reduce<TreeNode[]>((acc, node) => {
        const matchesSelf =
          node.label.toLowerCase().includes(lower) ||
          (node.code && node.code.toLowerCase().includes(lower)) ||
          (node.description && node.description.toLowerCase().includes(lower))

        const filteredChildren = node.children ? filterTree(node.children, query) : []

        if (matchesSelf || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
          })
        }

        return acc
      }, [])
    },
    []
  )

  const displayData = React.useMemo(() => {
    const filtered = filterTree(data, searchQuery)
    if (searchQuery) {
      const expandAll = (nodes: TreeNode[]): string[] => {
        return nodes.reduce<string[]>((acc, node) => {
          if (node.children && node.children.length > 0) {
            acc.push(node.id)
            acc.push(...expandAll(node.children))
          }
          return acc
        }, [])
      }
      const ids = expandAll(filtered)
      setInternalExpandedIds(new Set(ids))
    }
    return filtered
  }, [data, searchQuery, filterTree])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {searchable && (
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      )}

      <ScrollArea style={{ maxHeight }}>
        <div className="py-1">
          {displayData.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            displayData.map((node) => (
              <TreeNodeItem
                key={node.id}
                node={node}
                selectedIds={selectedIds}
                expandedIds={expandedIds}
                internalExpanded={new Set()}
                onToggle={toggleExpand}
                onSelect={handleSelect}
                onCheck={handleCheck}
                onAdd={onAdd}
                onDelete={onDelete}
                onRename={onRename}
                renderNode={renderNode}
                searchable={searchable}
                showIcons={showIcons}
                showBadges={showBadges}
                showCode={showCode}
                checkable={checkable}
                collapsible={collapsible}
                nodeClassName={nodeClassName}
                dragEnabled={dragEnabled}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export { TreeView, TreeNodeItem, type TreeNode, type TreeViewProps }
