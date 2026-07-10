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

type InvoiceType = "sales" | "purchase"
type InvoiceStatus = "draft" | "submitted" | "paid" | "partially_paid" | "overdue" | "cancelled"

interface Invoice {
  id: string
  invoiceNumber: string
  invoiceType: InvoiceType
  partyName: string
  invoiceDate: string
  dueDate: string
  total: number
  amountPaid: number
  balance: number
  status: InvoiceStatus
}

interface InvoiceListProps {
  invoices: Invoice[]
  onView?: (invoice: Invoice) => void
  onEdit?: (invoice: Invoice) => void
  onDelete?: (invoice: Invoice) => void
  onExport?: (invoices: Invoice[]) => void
  loading?: boolean
  pageSize?: number
  totalItems?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  className?: string
}

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Draft", color: "text-gray-700 dark:text-gray-200", bgColor: "bg-gray-100 dark:bg-gray-800" },
  submitted: { label: "Submitted", color: "text-blue-700 dark:text-blue-200", bgColor: "bg-blue-100 dark:bg-blue-900/50" },
  paid: { label: "Paid", color: "text-green-700 dark:text-green-200", bgColor: "bg-green-100 dark:bg-green-900/50" },
  partially_paid: { label: "Partial", color: "text-yellow-700 dark:text-yellow-200", bgColor: "bg-yellow-100 dark:bg-yellow-900/50" },
  overdue: { label: "Overdue", color: "text-red-700 dark:text-red-200", bgColor: "bg-red-100 dark:bg-red-900/50" },
  cancelled: { label: "Cancelled", color: "text-gray-700 dark:text-gray-200", bgColor: "bg-gray-100 dark:bg-gray-800" },
}

function InvoiceList({
  invoices,
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
}: InvoiceListProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [internalPage, setInternalPage] = React.useState(1)

  const currentPage = controlledPage ?? internalPage
  const total = totalItems ?? invoices.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const filteredInvoices = React.useMemo(() => {
    let result = [...invoices]

    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      result = result.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(lower) ||
          inv.partyName.toLowerCase().includes(lower)
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((inv) => inv.status === statusFilter)
    }

    if (typeFilter !== "all") {
      result = result.filter((inv) => inv.invoiceType === typeFilter)
    }

    return result
  }, [invoices, searchQuery, statusFilter, typeFilter])

  const paginatedInvoices = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredInvoices.slice(start, start + pageSize)
  }, [filteredInvoices, currentPage, pageSize])

  const handlePageChange = (page: number) => {
    setInternalPage(page)
    onPageChange?.(page)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Invoices</CardTitle>
          {onExport && (
            <Button variant="outline" size="sm" onClick={() => onExport(filteredInvoices)}>
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
              placeholder="Search by invoice number or party..."
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

          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partially_paid">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
                <TableHead>Invoice #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInvoices.map((invoice) => {
                  const config = statusConfig[invoice.status]
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-xs">{invoice.invoiceNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {invoice.invoiceType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{invoice.partyName}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(invoice.invoiceDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm tabular-nums">
                        {invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm tabular-nums text-green-600">
                        {invoice.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-mono text-sm tabular-nums",
                        invoice.balance > 0 ? "text-red-600" : "text-muted-foreground"
                      )}>
                        {invoice.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => onView(invoice)}>
                              <EyeIcon className="size-3.5" />
                            </Button>
                          )}
                          {onEdit && invoice.status === "draft" && (
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => onEdit(invoice)}>
                              <EditIcon className="size-3.5" />
                            </Button>
                          )}
                          {onDelete && invoice.status === "draft" && (
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => onDelete(invoice)}>
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
  InvoiceList,
  type Invoice,
  type InvoiceListProps,
  type InvoiceType,
  type InvoiceStatus,
  statusConfig,
}
