"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  XIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
} from "lucide-react"
import { format } from "date-fns"

type PaymentStatus = "draft" | "submitted" | "reconciled" | "cancelled"

interface PaymentEntry {
  id: string
  paymentNumber: string
  postingDate: string
  paymentType: "receive" | "pay" | "internal_transfer"
  partyName?: string
  sourceAccount: string
  targetAccount?: string
  amount: number
  status: PaymentStatus
  paymentMode: string
  referenceNumber?: string
}

interface PaymentEntryListProps {
  entries: PaymentEntry[]
  onView?: (entry: PaymentEntry) => void
  onEdit?: (entry: PaymentEntry) => void
  onDelete?: (entry: PaymentEntry) => void
  onExport?: (entries: PaymentEntry[]) => void
  loading?: boolean
  pageSize?: number
  totalItems?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  className?: string
}

const statusConfig: Record<PaymentStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Draft", color: "text-gray-700 dark:text-gray-200", bgColor: "bg-gray-100 dark:bg-gray-800" },
  submitted: { label: "Submitted", color: "text-blue-700 dark:text-blue-200", bgColor: "bg-blue-100 dark:bg-blue-900/50" },
  reconciled: { label: "Reconciled", color: "text-green-700 dark:text-green-200", bgColor: "bg-green-100 dark:bg-green-900/50" },
  cancelled: { label: "Cancelled", color: "text-red-700 dark:text-red-200", bgColor: "bg-red-100 dark:bg-red-900/50" },
}

function PaymentEntryList({
  entries,
  onView,
  onEdit,
  onDelete,
  onExport,
  loading = false,
  pageSize = 10,
  totalItems,
  currentPage: controlledPage,
  onPageChange,
  className,
}: PaymentEntryListProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [internalPage, setInternalPage] = React.useState(1)

  const currentPage = controlledPage ?? internalPage
  const total = totalItems ?? entries.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const filteredEntries = React.useMemo(() => {
    let result = [...entries]

    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      result = result.filter(
        (e) =>
          e.paymentNumber.toLowerCase().includes(lower) ||
          (e.partyName && e.partyName.toLowerCase().includes(lower)) ||
          (e.referenceNumber && e.referenceNumber.toLowerCase().includes(lower))
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter)
    }

    if (typeFilter !== "all") {
      result = result.filter((e) => e.paymentType === typeFilter)
    }

    return result
  }, [entries, searchQuery, statusFilter, typeFilter])

  const paginatedEntries = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredEntries.slice(start, start + pageSize)
  }, [filteredEntries, currentPage, pageSize])

  const handlePageChange = (page: number) => {
    setInternalPage(page)
    onPageChange?.(page)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Payment Entries</CardTitle>
          {onExport && (
            <Button variant="outline" size="sm" onClick={() => onExport(filteredEntries)}>
              <DownloadIcon className="mr-1 size-4" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by payment number or party..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="reconciled">Reconciled</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="receive">Receive</SelectItem>
              <SelectItem value="pay">Pay</SelectItem>
              <SelectItem value="internal_transfer">Internal Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative rounded-lg border overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No payment entries found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEntries.map((entry) => {
                  const config = statusConfig[entry.status]
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-xs">{entry.paymentNumber}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(entry.postingDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {entry.paymentType.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{entry.partyName || "-"}</TableCell>
                      <TableCell className="text-sm font-mono text-xs">{entry.sourceAccount}</TableCell>
                      <TableCell className="text-sm capitalize">{entry.paymentMode.replace("_", " ")}</TableCell>
                      <TableCell className="text-right font-mono text-sm tabular-nums">
                        {entry.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            config.color,
                            config.bgColor
                          )}
                        >
                          {config.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {onView && (
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => onView(entry)}>
                              <EyeIcon className="size-3.5" />
                            </Button>
                          )}
                          {onEdit && entry.status === "draft" && (
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => onEdit(entry)}>
                              <EditIcon className="size-3.5" />
                            </Button>
                          )}
                          {onDelete && entry.status === "draft" && (
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => onDelete(entry)}>
                              <Trash2Icon className="size-3.5 text-destructive" />
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * pageSize + 1, total)} to{" "}
              {Math.min(currentPage * pageSize, total)} of {total}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-xs"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <span className="px-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon-xs"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export {
  PaymentEntryList,
  type PaymentEntry,
  type PaymentEntryListProps,
  type PaymentStatus,
  statusConfig,
}
