"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const subscriptions = [
  { id: "SUB-001", customer: "Acme Corp", plan: "Enterprise", startDate: "2024-01-01", nextBilling: "2024-02-01", amount: "$2,500/month", status: "Active" },
  { id: "SUB-002", customer: "TechStart Inc", plan: "Professional", startDate: "2023-06-15", nextBilling: "2024-02-15", amount: "$999/month", status: "Active" },
  { id: "SUB-003", customer: "Global Industries", plan: "Enterprise", startDate: "2023-03-01", nextBilling: "2024-03-01", amount: "$2,500/month", status: "Active" },
  { id: "SUB-004", customer: "Local Business Co", plan: "Basic", startDate: "2023-11-01", nextBilling: "2024-02-01", amount: "$299/month", status: "Active" },
  { id: "SUB-005", customer: "Manufacturing Plus", plan: "Professional", startDate: "2023-08-01", nextBilling: "2024-02-01", amount: "$999/month", status: "Cancelled" },
  { id: "SUB-006", customer: "Retail Chain", plan: "Basic", startDate: "2023-10-01", nextBilling: "2024-02-01", amount: "$299/month", status: "Past Due" },
]

const columns = [
  { key: "id", label: "Subscription #" },
  { key: "customer", label: "Customer" },
  { key: "plan", label: "Plan" },
  { key: "startDate", label: "Start Date" },
  { key: "nextBilling", label: "Next Billing" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Active Subscriptions", value: "4" },
  { label: "Monthly Revenue", value: "$6,297" },
  { label: "Annual Revenue", value: "$75,564" },
  { label: "Churn Rate", value: "2.1%" },
]

export default function SubscriptionsPage() {
  return (
    <OverviewLayout
      title="Subscriptions"
      description="Manage recurring subscriptions and billing"
      actionLabel="New Subscription"
      actionHref="/accounting/subscriptions/new"
      stats={summaryStats}
    >
      <div className="grid gap-6 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Basic Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$299</div>
            <p className="text-xs text-muted-foreground">2 active subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Professional Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$999</div>
            <p className="text-xs text-muted-foreground">1 active subscriber</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Enterprise Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,500</div>
            <p className="text-xs text-muted-foreground">2 active subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <p className="text-xs text-muted-foreground">Monthly churn</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={subscriptions} />
      </div>
    </OverviewLayout>
  )
}
