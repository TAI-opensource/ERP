"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  SearchIcon,
  DownloadIcon,
  PlusIcon,
  RefreshCwIcon,
  XIcon,
  CreditCardIcon,
  UsersIcon,
  DollarSignIcon,
  TrendingUpIcon,
} from "lucide-react"

type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "expired" | "paused"
type SubscriptionBilling = "monthly" | "quarterly" | "annually" | "one_time"

interface Subscription {
  id: string
  customerName: string
  customerEmail: string
  plan: string
  amount: number
  billingCycle: SubscriptionBilling
  status: SubscriptionStatus
  startDate: string
  nextBillingDate: string
  endDate?: string
  autoRenew: boolean
  paymentMethod?: string
}

interface SubscriptionListProps {
  subscriptions?: Subscription[]
  onAdd?: () => void
  onCancel?: (id: string) => void
  onRenew?: (id: string) => void
  onPause?: (id: string) => void
  onReactivate?: (id: string) => void
  onExport?: (items: Subscription[]) => void
  className?: string
}

const statusConfig: Record<SubscriptionStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Active", color: "text-green-700", bgColor: "bg-green-100" },
  trialing: { label: "Trialing", color: "text-blue-700", bgColor: "bg-blue-100" },
  past_due: { label: "Past Due", color: "text-red-700", bgColor: "bg-red-100" },
  canceled: { label: "Canceled", color: "text-gray-700", bgColor: "bg-gray-100" },
  expired: { label: "Expired", color: "text-orange-700", bgColor: "bg-orange-100" },
  paused: { label: "Paused", color: "text-yellow-700", bgColor: "bg-yellow-100" },
}

const billingLabels: Record<SubscriptionBilling, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annually: "Annually",
  one_time: "One-time",
}

function SubscriptionSummaryCards({ subscriptions }: { subscriptions: Subscription[] }) {
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active")
  const monthlyRecurring = activeSubscriptions
    .filter((s) => s.billingCycle === "monthly")
    .reduce((sum, s) => sum + s.amount, 0)
  const annualRecurring = activeSubscriptions
    .filter((s) => s.billingCycle === "annually")
    .reduce((sum, s) => sum + s.amount, 0)
  const churnRisk = subscriptions.filter(
    (s) => s.status === "past_due" || s.status === "expired"
  ).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
              <UsersIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeSubscriptions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <DollarSignIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">${monthlyRecurring.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <TrendingUpIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual Revenue</p>
              <p className="text-2xl font-bold">${annualRecurring.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-700">
              <CreditCardIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Churn Risk</p>
              <p className="text-2xl font-bold text-red-600">{churnRisk}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SubscriptionList({
  subscriptions = [],
  onAdd,
  onCancel,
  onRenew,
  onPause,
  onReactivate,
  onExport,
  className,
}: SubscriptionListProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.customerName.toLowerCase().includes(search.toLowerCase()) ||
      sub.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      sub.plan.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Subscriptions</CardTitle>
          <div className="flex items-center gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={() => onExport(filteredSubscriptions)}>
                <DownloadIcon className="mr-1 size-3" />
                Export
              </Button>
            )}
            {onAdd && (
              <Button size="sm" onClick={onAdd}>
                <PlusIcon className="mr-1 size-3" />
                Add Subscription
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SubscriptionSummaryCards subscriptions={subscriptions} />

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Auto-renew</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No subscriptions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const sConfig = statusConfig[sub.status]
                  return (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sub.customerName}</p>
                          <p className="text-xs text-muted-foreground">{sub.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{sub.plan}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${sub.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {billingLabels[sub.billingCycle]}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px]", sConfig.color, sConfig.bgColor)}>
                          {sConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{sub.startDate}</TableCell>
                      <TableCell className="text-sm">{sub.nextBillingDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={sub.autoRenew ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {sub.autoRenew ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {sub.status === "active" && onPause && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => onPause(sub.id)}
                              title="Pause"
                            >
                              <XIcon className="size-3" />
                            </Button>
                          )}
                          {sub.status === "paused" && onReactivate && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => onReactivate(sub.id)}
                              title="Reactivate"
                            >
                              <RefreshCwIcon className="size-3" />
                            </Button>
                          )}
                          {(sub.status === "past_due" || sub.status === "expired") && onRenew && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => onRenew(sub.id)}
                              title="Renew"
                            >
                              <RefreshCwIcon className="size-3 text-green-500" />
                            </Button>
                          )}
                          {sub.status !== "canceled" && onCancel && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => onCancel(sub.id)}
                              title="Cancel"
                            >
                              <XIcon className="size-3 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export {
  SubscriptionList,
  SubscriptionSummaryCards,
  statusConfig,
  billingLabels,
  type Subscription,
  type SubscriptionStatus,
  type SubscriptionBilling,
  type SubscriptionListProps,
}
