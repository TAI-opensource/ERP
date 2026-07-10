"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BookOpenIcon,
  FileTextIcon,
  CreditCardIcon,
  LandmarkIcon,
  WalletIcon,
  BarChart3Icon,
  PieChartIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalculatorIcon,
  SettingsIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
} from "lucide-react"

interface AccountingNavItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  badge?: string
  children?: AccountingNavItem[]
}

interface AccountingLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: React.ReactNode
  currentNavItem?: string
  onNavigate?: (id: string) => void
  className?: string
}

const defaultNavItems: AccountingNavItem[] = [
  {
    id: "chart-of-accounts",
    label: "Chart of Accounts",
    icon: <BookOpenIcon className="size-4" />,
  },
  {
    id: "journal-entries",
    label: "Journal Entries",
    icon: <FileTextIcon className="size-4" />,
    badge: "3",
  },
  {
    id: "payment-entries",
    label: "Payment Entries",
    icon: <CreditCardIcon className="size-4" />,
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: <FileTextIcon className="size-4" />,
    children: [
      { id: "sales-invoices", label: "Sales Invoices", icon: <TrendingUpIcon className="size-4" /> },
      { id: "purchase-invoices", label: "Purchase Invoices", icon: <TrendingDownIcon className="size-4" /> },
    ],
  },
  {
    id: "banking",
    label: "Banking",
    icon: <LandmarkIcon className="size-4" />,
    children: [
      { id: "bank-accounts", label: "Bank Accounts", icon: <WalletIcon className="size-4" /> },
      { id: "bank-reconciliation", label: "Reconciliation", icon: <CalculatorIcon className="size-4" /> },
    ],
  },
  {
    id: "budgets",
    label: "Budgets",
    icon: <PieChartIcon className="size-4" />,
  },
  {
    id: "reports",
    label: "Reports",
    icon: <BarChart3Icon className="size-4" />,
    children: [
      { id: "balance-sheet", label: "Balance Sheet" },
      { id: "profit-loss", label: "Profit & Loss" },
      { id: "trial-balance", label: "Trial Balance" },
      { id: "general-ledger", label: "General Ledger" },
      { id: "accounts-receivable", label: "Accounts Receivable" },
      { id: "accounts-payable", label: "Accounts Payable" },
      { id: "cash-flow", label: "Cash Flow" },
      { id: "tax-summary", label: "Tax Summary" },
    ],
  },
]

function AccountingSidebar({
  navItems = defaultNavItems,
  currentNavItem,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: {
  navItems?: AccountingNavItem[]
  currentNavItem?: string
  onNavigate?: (id: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const renderItem = (item: AccountingNavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const isActive = currentNavItem === item.id

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id)
            } else {
              onNavigate?.(item.id)
            }
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
            "hover:bg-muted",
            isActive && "bg-muted font-medium text-foreground",
            !isActive && "text-muted-foreground",
            depth > 0 && "ml-4"
          )}
        >
          <span className="shrink-0">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                <ChevronDownIcon
                  className={cn("size-3.5 transition-transform", isExpanded && "rotate-180")}
                />
              )}
            </>
          )}
        </button>
        {hasChildren && isExpanded && !collapsed && (
          <div>
            {item.children!.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col border-r bg-card",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold">Accounting</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onToggleCollapse}
        >
          {collapsed ? <MenuIcon className="size-4" /> : <XIcon className="size-4" />}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {navItems.map((item) => renderItem(item))}
      </nav>
    </div>
  )
}

function AccountingLayout({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  currentNavItem,
  onNavigate,
  className,
}: AccountingLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className={cn("flex h-screen overflow-hidden", className)}>
      <AccountingSidebar
        currentNavItem={currentNavItem}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span>/</span>}
                      {crumb.href ? (
                        <a href={crumb.href} className="hover:text-foreground">
                          {crumb.label}
                        </a>
                      ) : (
                        <span className="text-foreground">{crumb.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}
              <h1 className="text-2xl font-bold">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export {
  AccountingLayout,
  AccountingSidebar,
  defaultNavItems,
  type AccountingLayoutProps,
  type AccountingNavItem,
}
