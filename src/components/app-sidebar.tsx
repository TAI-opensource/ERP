"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DollarSignIcon, PackageIcon, ShoppingCartIcon, UsersIcon, HandshakeIcon, FactoryIcon, FolderIcon, Building2Icon, ShieldCheckIcon, ShoppingCart } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Accounting",
      url: "/accounting",
      icon: <DollarSignIcon />,
      items: [
        { title: "Overview", url: "/accounting" },
        { title: "Chart of Accounts", url: "/accounting/chart-of-accounts" },
        { title: "Journal Entries", url: "/accounting/journal-entries" },
        { title: "Payment Entries", url: "/accounting/payment-entries" },
        { title: "Sales Invoices", url: "/accounting/sales-invoices" },
        { title: "Purchase Invoices", url: "/accounting/purchase-invoices" },
        { title: "Banking", url: "/accounting/banking" },
        { title: "Budgets", url: "/accounting/budgets" },
        { title: "Reports", url: "/accounting/reports" },
        { title: "Tax Templates", url: "/accounting/tax-templates" },
        { title: "Fixed Assets", url: "/accounting/assets" },
      ],
    },
    {
      title: "Stock",
      url: "/stock",
      icon: <PackageIcon />,
      items: [
        { title: "Overview", url: "/stock" },
        { title: "Items", url: "/stock/items" },
        { title: "Warehouses", url: "/stock/warehouses" },
        { title: "Stock Entries", url: "/stock/stock-entries" },
        { title: "Batches", url: "/stock/batches" },
        { title: "Serial Numbers", url: "/stock/serial-numbers" },
      ],
    },
    {
      title: "Selling",
      url: "/selling",
      icon: <ShoppingCart />,
      items: [
        { title: "Overview", url: "/selling" },
        { title: "Customers", url: "/selling/customers" },
        { title: "Quotations", url: "/selling/quotations" },
        { title: "Sales Orders", url: "/selling/sales-orders" },
      ],
    },
    {
      title: "Buying",
      url: "/buying",
      icon: <ShoppingCartIcon />,
      items: [
        { title: "Overview", url: "/buying" },
        { title: "Suppliers", url: "/buying/suppliers" },
        { title: "Purchase Orders", url: "/buying/purchase-orders" },
      ],
    },
    {
      title: "Human Resources",
      url: "/hr",
      icon: <UsersIcon />,
      items: [
        { title: "Overview", url: "/hr" },
        { title: "Employees", url: "/hr/employees" },
        { title: "Attendance", url: "/hr/attendance" },
        { title: "Leave", url: "/hr/leave" },
        { title: "Payroll", url: "/hr/payroll" },
      ],
    },
    {
      title: "CRM",
      url: "/crm",
      icon: <HandshakeIcon />,
      items: [
        { title: "Overview", url: "/crm" },
        { title: "Leads", url: "/crm/leads" },
        { title: "Opportunities", url: "/crm/opportunities" },
        { title: "Campaigns", url: "/crm/campaigns" },
      ],
    },
    {
      title: "Manufacturing",
      url: "/manufacturing",
      icon: <FactoryIcon />,
      items: [
        { title: "Overview", url: "/manufacturing" },
        { title: "Bill of Materials", url: "/manufacturing/bom" },
        { title: "Work Orders", url: "/manufacturing/work-orders" },
        { title: "Job Cards", url: "/manufacturing/job-cards" },
      ],
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <FolderIcon />,
      items: [
        { title: "Overview", url: "/projects" },
        { title: "Tasks", url: "/projects/tasks" },
        { title: "Timesheets", url: "/projects/timesheets" },
      ],
    },
    {
      title: "Assets",
      url: "/assets",
      icon: <Building2Icon />,
      items: [
        { title: "Overview", url: "/assets" },
        { title: "Asset List", url: "/assets/asset-list" },
        { title: "Maintenance", url: "/assets/maintenance" },
      ],
    },
    {
      title: "Quality",
      url: "/quality",
      icon: <ShieldCheckIcon />,
      items: [
        { title: "Overview", url: "/quality" },
        { title: "Procedures", url: "/quality/procedures" },
        { title: "Inspections", url: "/quality/inspections" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
