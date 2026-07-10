"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const accountingLinks = [
  { title: "Overview", href: "/accounting" },
  { title: "Chart of Accounts", href: "/accounting/chart-of-accounts" },
  { title: "Journal Entries", href: "/accounting/journal-entries" },
  { title: "Payment Entries", href: "/accounting/payment-entries" },
  { title: "Sales Invoices", href: "/accounting/sales-invoices" },
  { title: "Purchase Invoices", href: "/accounting/purchase-invoices" },
  { title: "Banking", href: "/accounting/banking" },
  { title: "Budgets", href: "/accounting/budgets" },
  { title: "Reports", href: "/accounting/reports" },
  { title: "Tax Templates", href: "/accounting/tax-templates" },
  { title: "Fixed Assets", href: "/accounting/assets" },
]

export default function AccountingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 gap-6 p-6">
      <aside className="hidden w-56 shrink-0 lg:block">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Accounting</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="flex flex-col gap-1 p-2">
              {accountingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    usePathname() === link.href ? "bg-muted text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </CardContent>
        </Card>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  )
}
