"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SelectChangeHandler = (value: string | null, eventDetails: any) => void
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
import {
  SearchIcon,
  SendIcon,
  PhoneIcon,
  MailIcon,
  DownloadIcon,
  FilterIcon,
  AlertCircleIcon,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react"

type DunningStatus = "pending" | "reminded" | "escalated" | "in_collection" | "resolved"
type DunningLevel = "first_notice" | "second_notice" | "final_notice" | "legal"

interface DunningItem {
  id: string
  invoiceNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  amount: number
  dueDate: string
  daysOverdue: number
  status: DunningStatus
  level: DunningLevel
  lastContactDate?: string
  nextActionDate: string
  notes?: string
}

interface DunningListProps {
  items?: DunningItem[]
  onSendReminder?: (itemId: string) => void
  onCall?: (itemId: string) => void
  onEmail?: (itemId: string) => void
  onEscalate?: (itemId: string) => void
  onExport?: (items: DunningItem[]) => void
  className?: string
}

const statusConfig: Record<DunningStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  reminded: { label: "Reminded", color: "text-blue-700", bgColor: "bg-blue-100" },
  escalated: { label: "Escalated", color: "text-orange-700", bgColor: "bg-orange-100" },
  in_collection: { label: "In Collection", color: "text-red-700", bgColor: "bg-red-100" },
  resolved: { label: "Resolved", color: "text-green-700", bgColor: "bg-green-100" },
}

const levelConfig: Record<DunningLevel, { label: string; color: string; bgColor: string }> = {
  first_notice: { label: "1st Notice", color: "text-blue-700", bgColor: "bg-blue-100" },
  second_notice: { label: "2nd Notice", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  final_notice: { label: "Final Notice", color: "text-orange-700", bgColor: "bg-orange-100" },
  legal: { label: "Legal", color: "text-red-700", bgColor: "bg-red-100" },
}

function DunningSummaryCards({ items }: { items: DunningItem[] }) {
  const totalOverdue = items
    .filter((item) => item.status !== "resolved")
    .reduce((sum, item) => sum + item.amount, 0)
  const pendingCount = items.filter((item) => item.status === "pending").length
  const escalatedCount = items.filter((item) => item.status === "escalated" || item.status === "in_collection").length
  const avgDaysOverdue = items.length > 0
    ? Math.round(items.reduce((sum, item) => sum + item.daysOverdue, 0) / items.length)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-700">
              <DollarSignIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                ${totalOverdue.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
              <ClockIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
              <AlertCircleIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Escalated</p>
              <p className="text-2xl font-bold">{escalatedCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <ClockIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Days Overdue</p>
              <p className="text-2xl font-bold">{avgDaysOverdue}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DunningList({
  items = [],
  onSendReminder,
  onCall,
  onEmail,
  onEscalate,
  onExport,
  className,
}: DunningListProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [levelFilter, setLevelFilter] = React.useState<string>("all")

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesLevel = levelFilter === "all" || item.level === levelFilter
    return matchesSearch && matchesStatus && matchesLevel
  })

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dunning List</CardTitle>
          <div className="flex items-center gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={() => onExport(filteredItems)}>
                <DownloadIcon className="mr-1 size-3" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <DunningSummaryCards items={items} />

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by customer or invoice..."
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
          <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v ?? "all")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {Object.entries(levelConfig).map(([key, config]) => (
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
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Days Overdue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Next Action</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No dunning items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => {
                  const sConfig = statusConfig[item.status]
                  const lConfig = levelConfig[item.level]
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{item.invoiceNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.customerName}</p>
                          <p className="text-xs text-muted-foreground">{item.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        ${item.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{item.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={cn(
                            "text-[10px]",
                            item.daysOverdue > 60
                              ? "bg-red-100 text-red-700"
                              : item.daysOverdue > 30
                                ? "bg-orange-100 text-orange-700"
                                : "bg-yellow-100 text-yellow-700"
                          )}
                        >
                          {item.daysOverdue}d
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px]", sConfig.color, sConfig.bgColor)}>
                          {sConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px]", lConfig.color, lConfig.bgColor)}>
                          {lConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.nextActionDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {onSendReminder && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => onSendReminder(item.id)}
                              title="Send Reminder"
                            >
                              <SendIcon className="size-3" />
                            </Button>
                          )}
                          {onCall && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => onCall(item.id)}
                              title="Call"
                            >
                              <PhoneIcon className="size-3" />
                            </Button>
                          )}
                          {onEmail && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => onEmail(item.id)}
                              title="Email"
                            >
                              <MailIcon className="size-3" />
                            </Button>
                          )}
                          {onEscalate && item.status !== "resolved" && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => onEscalate(item.id)}
                              title="Escalate"
                            >
                              <AlertCircleIcon className="size-3 text-orange-500" />
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
  DunningList,
  DunningSummaryCards,
  statusConfig,
  levelConfig,
  type DunningItem,
  type DunningStatus,
  type DunningLevel,
  type DunningListProps,
}
