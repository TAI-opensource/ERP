"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronRightIcon,
  ChevronDownIcon,
  SearchIcon,
  PlusIcon,
  Trash2Icon,
  EditIcon,
  GripVerticalIcon,
  WalletIcon,
  CreditCardIcon,
  BuildingIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  LandmarkIcon,
} from "lucide-react"

type AccountType = "asset" | "liability" | "equity" | "income" | "expense"
type AccountSubtype = string

interface AccountNode {
  id: string
  name: string
  code: string
  type: AccountType
  subtype?: AccountSubtype
  balance: number
  currency?: string
  isActive: boolean
  children?: AccountNode[]
  parentId?: string | null
  level?: number
}

interface ChartOfAccountsTreeProps {
  accounts: AccountNode[]
  selectedAccountId?: string
  onSelectAccount?: (account: AccountNode) => void
  onAddAccount?: (parentId: string | null) => void
  onEditAccount?: (account: AccountNode) => void
  onDeleteAccount?: (account: AccountNode) => void
  onDragEnd?: (accountId: string, targetParentId: string | null) => void
  searchPlaceholder?: string
  className?: string
  maxHeight?: string
  showBalances?: boolean
  showInactive?: boolean
}

const accountTypeConfig: Record<AccountType, { label: string; icon: React.ReactNode; color: string }> = {
  asset: {
    label: "Asset",
    icon: <WalletIcon className="size-4" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  liability: {
    label: "Liability",
    icon: <CreditCardIcon className="size-4" />,
    color: "text-red-600 dark:text-red-400",
  },
  equity: {
    label: "Equity",
    icon: <LandmarkIcon className="size-4" />,
    color: "text-purple-600 dark:text-purple-400",
  },
  income: {
    label: "Income",
    icon: <TrendingUpIcon className="size-4" />,
    color: "text-green-600 dark:text-green-400",
  },
  expense: {
    label: "Expense",
    icon: <TrendingDownIcon className="size-4" />,
    color: "text-orange-600 dark:text-orange-400",
  },
}

function AccountTreeNode({
  account,
  depth = 0,
  selectedAccountId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  expandedIds,
  onToggle,
  showBalances,
  dragEnabled,
}: {
  account: AccountNode
  depth?: number
  selectedAccountId?: string
  onSelect?: (account: AccountNode) => void
  onAdd?: (parentId: string) => void
  onEdit?: (account: AccountNode) => void
  onDelete?: (account: AccountNode) => void
  expandedIds: Set<string>
  onToggle: (id: string) => void
  showBalances?: boolean
  dragEnabled?: boolean
}) {
  const hasChildren = account.children && account.children.length > 0
  const isExpanded = expandedIds.has(account.id)
  const isSelected = selectedAccountId === account.id
  const [isDragOver, setIsDragOver] = React.useState(false)
  const typeConfig = accountTypeConfig[account.type]

  return (
    <div>
      <div
        className={cn(
          "group/account flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
          "hover:bg-muted",
          isSelected && "bg-muted font-medium text-foreground",
          !isSelected && "text-foreground",
          !account.isActive && "opacity-50",
          isDragOver && "bg-primary/10 ring-1 ring-primary/30"
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        draggable={dragEnabled}
        onDragStart={(e) => {
          e.dataTransfer.setData("accountId", account.id)
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
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle(account.id)
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

        <span className={cn("shrink-0", typeConfig.color)}>
          {typeConfig.icon}
        </span>

        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {account.code}
        </span>

        <button
          className="flex flex-1 items-center gap-2 overflow-hidden text-left"
          onClick={() => onSelect?.(account)}
        >
          <span className="truncate">{account.name}</span>
        </button>

        {account.subtype && (
          <Badge variant="outline" className="shrink-0 text-[10px]">
            {account.subtype}
          </Badge>
        )}

        {showBalances && (
          <span className={cn(
            "shrink-0 font-mono text-xs tabular-nums",
            account.balance >= 0 ? "text-foreground" : "text-destructive"
          )}>
            {account.currency ?? "USD"} {account.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        )}

        {!account.isActive && (
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            Inactive
          </Badge>
        )}

        <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover/account:opacity-100">
          {onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAdd(account.id)
              }}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <PlusIcon className="size-3.5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(account)
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
                onDelete(account)
              }}
              className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2Icon className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {account.children!.map((child) => (
            <AccountTreeNode
              key={child.id}
              account={child}
              depth={depth + 1}
              selectedAccountId={selectedAccountId}
              onSelect={onSelect}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              expandedIds={expandedIds}
              onToggle={onToggle}
              showBalances={showBalances}
              dragEnabled={dragEnabled}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ChartOfAccountsTree({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  onDragEnd,
  searchPlaceholder = "Search accounts...",
  className,
  maxHeight = "600px",
  showBalances = true,
  showInactive = true,
}: ChartOfAccountsTreeProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())
  const [typeFilter, setTypeFilter] = React.useState<AccountType | "all">("all")

  const toggleExpand = React.useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const filterTree = React.useCallback(
    (nodes: AccountNode[], query: string): AccountNode[] => {
      if (!query && typeFilter === "all") return nodes
      const lower = query.toLowerCase()

      return nodes.reduce<AccountNode[]>((acc, node) => {
        if (!showInactive && !node.isActive) return acc

        const matchesType = typeFilter === "all" || node.type === typeFilter
        const matchesSearch =
          !query ||
          node.name.toLowerCase().includes(lower) ||
          node.code.toLowerCase().includes(lower)

        const filteredChildren = node.children ? filterTree(node.children, query) : []

        if ((matchesType && matchesSearch) || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
          })
        }

        return acc
      }, [])
    },
    [typeFilter, showInactive]
  )

  const displayData = React.useMemo(() => {
    const filtered = filterTree(accounts, searchQuery)
    if (searchQuery || typeFilter !== "all") {
      const expandAll = (nodes: AccountNode[]): string[] => {
        return nodes.reduce<string[]>((acc, node) => {
          if (node.children && node.children.length > 0) {
            acc.push(node.id)
            acc.push(...expandAll(node.children))
          }
          return acc
        }, [])
      }
      setExpandedIds(new Set(expandAll(filtered)))
    }
    return filtered
  }, [accounts, searchQuery, typeFilter, filterTree])

  const totalBalance = React.useMemo(() => {
    const sumBalances = (nodes: AccountNode[]): number => {
      return nodes.reduce((sum, node) => {
        const childrenSum = node.children ? sumBalances(node.children) : 0
        return sum + node.balance + childrenSum
      }, 0)
    }
    return sumBalances(displayData)
  }, [displayData])

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-1">
          {(["all", "asset", "liability", "equity", "income", "expense"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                typeFilter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {type === "all" ? "All" : accountTypeConfig[type].label}
            </button>
          ))}
        </div>

        {onAddAccount && (
          <Button size="sm" onClick={() => onAddAccount(null)}>
            <PlusIcon className="mr-1 size-4" />
            Add Account
          </Button>
        )}
      </div>

      <ScrollArea style={{ maxHeight }}>
        <div className="py-1">
          {displayData.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              No accounts found
            </div>
          ) : (
            displayData.map((account) => (
              <AccountTreeNode
                key={account.id}
                account={account}
                selectedAccountId={selectedAccountId}
                onSelect={onSelectAccount}
                onAdd={onAddAccount}
                onEdit={onEditAccount}
                onDelete={onDeleteAccount}
                expandedIds={expandedIds}
                onToggle={toggleExpand}
                showBalances={showBalances}
                dragEnabled={!!onDragEnd}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {showBalances && (
        <div className="flex items-center justify-between border-t pt-2">
          <span className="text-sm text-muted-foreground">Total Balance</span>
          <span className="font-mono text-sm font-medium tabular-nums">
            USD {totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}
    </div>
  )
}

export {
  ChartOfAccountsTree,
  AccountTreeNode,
  accountTypeConfig,
  type AccountNode,
  type AccountType,
  type AccountSubtype,
  type ChartOfAccountsTreeProps,
}
