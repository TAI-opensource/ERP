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
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  FilterIcon,
} from "lucide-react"
import { format } from "date-fns"

type TransactionType = "credit" | "debit" | "transfer"
type TransactionStatus = "pending" | "cleared" | "reconciled" | "voided"

interface BankTransaction {
  id: string
  date: string
  description: string
  reference?: string
  type: TransactionType
  debit: number
  credit: number
  balance: number
  status: TransactionStatus
  category?: string
}

interface BankTransactionListProps {
  transactions: BankTransaction[]
  accountName?: string
  currentBalance?: number
  onExport?: (transactions: BankTransaction[]) => void
  onFilter?: (filters: { type: string; status: string; dateFrom: string; dateTo: string }) => void
  loading?: boolean
  pageSize?: number
  totalItems?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  className?: string
}

const statusConfig: Record<TransactionStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  cleared: { label: "Cleared", color: "text-green-700", bgColor: "bg-green-100" },
  reconciled: { label: "Reconciled", color: "text-blue-700", bgColor: "bg-blue-100" },
  voided: { label: "Voided", color: "text-gray-700", bgColor: "bg-gray-100" },
}

function BankTransactionList({
  transactions,
  accountName,
  currentBalance,
  onExport,
  onFilter,
  loading = false,
  pageSize = 20,
  totalItems,
  currentPage: controlledPage,
  onPageChange,
  className,
}: BankTransactionListProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [dateFrom, setDateFrom] = React.useState("")
  const [dateTo, setDateTo] = React.useState("")
  const [showFilters, setShowFilters] = React.useState(false)
  const [internalPage, setInternalPage] = React.useState(1)

  const currentPage = controlledPage ?? internalPage
  const total = totalItems ?? transactions.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const filteredTransactions = React.useMemo(() => {
    let result = [...transactions]

    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(lower) ||
          (t.reference && t.reference.toLowerCase().includes(lower))
      )
    }

    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter)
    }

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter)
    }

    if (dateFrom) {
      result = result.filter((t) => new Date(t.date) >= new Date(dateFrom))
    }

    if (dateTo) {
      result = result.filter((t) => new Date(t.date) <= new Date(dateTo))
    }

    return result
  }, [transactions, searchQuery, typeFilter, statusFilter, dateFrom, dateTo])

  const paginatedTransactions = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTransactions.slice(start, start + pageSize)
  }, [filteredTransactions, currentPage, pageSize])

  const handlePageChange = (page: number) => {
    setInternalPage(page)
    onPageChange?.(page)
  }

  const applyFilters = () => {
    onFilter?.({ type: typeFilter, status: statusFilter, dateFrom, dateTo })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Bank Transactions</CardTitle>
            {accountName && (
              <p className="text-sm text-muted-foreground">{accountName}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {currentBalance !== undefined && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="font-mono text-sm font-medium tabular-nums">
                  {currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={() => onExport(filteredTransactions)}>
                <DownloadIcon className="mr-1 size-4" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
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

          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="mr-1 size-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-end gap-2 rounded-lg border bg-muted/30 p-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cleared">Cleared</SelectItem>
                  <SelectItem value="reconciled">Reconciled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-8 w-[140px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-8 w-[140px]"
              />
            </div>
            <Button size="sm" onClick={applyFilters}>
              Apply
            </Button>
          </div>
        )}

        <div className="relative rounded-lg border overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => {
                  const config = statusConfig[transaction.status]
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.type === "credit" ? (
                          <ArrowDownLeftIcon className="size-4 text-green-600" />
                        ) : (
                          <ArrowUpRightIcon className="size-4 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(transaction.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-sm max-w-[250px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {transaction.reference || "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm tabular-nums">
                        {transaction.debit > 0 ? (
                          <span className="text-red-600">
                            {transaction.debit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm tabular-nums">
                        {transaction.credit > 0 ? (
                          <span className="text-green-600">
                            {transaction.credit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium tabular-nums">
                        {transaction.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", config.color, config.bgColor)}>
                          {config.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {transaction.category || "-"}
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
  BankTransactionList,
  type BankTransaction,
  type BankTransactionListProps,
  type TransactionType,
  type TransactionStatus,
  statusConfig,
}
