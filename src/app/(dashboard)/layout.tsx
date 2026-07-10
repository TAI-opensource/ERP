"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  accounting: "Accounting",
  "chart-of-accounts": "Chart of Accounts",
  "journal-entries": "Journal Entries",
  "payment-entries": "Payment Entries",
  "sales-invoices": "Sales Invoices",
  "purchase-invoices": "Purchase Invoices",
  stock: "Stock",
  items: "Items",
  warehouses: "Warehouses",
  "stock-entries": "Stock Entries",
  batches: "Batches",
  "serial-numbers": "Serial Numbers",
  selling: "Selling",
  customers: "Customers",
  quotations: "Quotations",
  "sales-orders": "Sales Orders",
  buying: "Buying",
  suppliers: "Suppliers",
  "purchase-orders": "Purchase Orders",
  hr: "Human Resources",
  employees: "Employees",
  attendance: "Attendance",
  leave: "Leave",
  payroll: "Payroll",
  crm: "CRM",
  leads: "Leads",
  opportunities: "Opportunities",
  campaigns: "Campaigns",
  manufacturing: "Manufacturing",
  bom: "Bill of Materials",
  "work-orders": "Work Orders",
  "job-cards": "Job Cards",
  projects: "Projects",
  tasks: "Tasks",
  timesheets: "Timesheets",
  assets: "Assets",
  "asset-list": "Asset List",
  maintenance: "Maintenance",
  quality: "Quality",
  procedures: "Procedures",
  inspections: "Inspections",
  upgrade: "Upgrade to Pro",
  account: "Account Settings",
  billing: "Billing",
  notifications: "Notifications",
  new: "New",
  security: "Security",
  preferences: "Preferences",
  team: "Team",
  "payment-methods": "Payment Methods",
  invoices: "Invoices",
  subscriptions: "Subscriptions",
  history: "History",
  banking: "Banking",
  accounts: "Accounts",
  transactions: "Transactions",
  reconciliation: "Reconciliation",
  budgets: "Budgets",
  "tax-templates": "Tax Templates",
  reports: "Reports",
  "balance-sheet": "Balance Sheet",
  "profit-loss": "Profit & Loss",
  "trial-balance": "Trial Balance",
  "general-ledger": "General Ledger",
  "accounts-receivable": "Accounts Receivable",
  "accounts-payable": "Accounts Payable",
  "bank-summary": "Bank Summary",
  "tax-summary": "Tax Summary",
  "cash-flow": "Cash Flow",
  dunnings: "Dunnings",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {segments.map((segment, idx) => {
                const href = "/" + segments.slice(0, idx + 1).join("/")
                const label = routeLabels[segment] ?? segment
                const isLast = idx === segments.length - 1
                return (
                  <BreadcrumbItem key={href}>
                    {idx > 0 && <BreadcrumbSeparator />}
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
