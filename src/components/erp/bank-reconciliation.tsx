"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CheckIcon,
  ArrowRightIcon,
  SearchIcon,
  XIcon,
  AlertCircleIcon,
  RefreshCwIcon,
} from "lucide-react"
import { format } from "date-fns"

interface BankTransaction {
  id: string
  date: string
  description: string
  reference?: string
  amount: number
  type: "credit" | "debit"
  isSelected: boolean
}

interface SystemTransaction {
  id: string
  date: string
  description: string
  reference?: string
  amount: number
  type: "credit" | "debit"
  isReconciled: boolean
  isSelected: boolean
}

interface BankReconciliationProps {
  bankTransactions: BankTransaction[]
  systemTransactions: SystemTransaction[]
  accountName: string
  statementBalance: number
  systemBalance: number
  onReconcile?: (bankIds: string[], systemIds: string[]) => void
  onAutoReconcile?: () => void
  onMarkAsReconciled?: (bankId: string, systemId: string) => void
  loading?: boolean
}

function BankReconciliation({
  bankTransactions,
  systemTransactions,
  accountName,
  statementBalance,
  systemBalance,
  onReconcile,
  onAutoReconcile,
  onMarkAsReconciled,
  loading = false,
}: BankReconciliationProps) {
  const [selectedBank, setSelectedBank] = React.useState<Set<string>>(new Set())
  const [selectedSystem, setSelectedSystem] = React.useState<Set<string>>(new Set())
  const [searchBank, setSearchBank] = React.useState("")
  const [searchSystem, setSearchSystem] = React.useState("")

  const difference = React.useMemo(
    () => statementBalance - systemBalance,
    [statementBalance, systemBalance]
  )

  const isBalanced = Math.abs(difference) < 0.01

  const filteredBankTransactions = React.useMemo(() => {
    if (!searchBank) return bankTransactions
    const lower = searchBank.toLowerCase()
    return bankTransactions.filter(
      (t) =>
        t.description.toLowerCase().includes(lower) ||
        (t.reference && t.reference.toLowerCase().includes(lower))
    )
  }, [bankTransactions, searchBank])

  const filteredSystemTransactions = React.useMemo(() => {
    if (!searchSystem) return systemTransactions.filter((t) => !t.isReconciled)
    const lower = searchSystem.toLowerCase()
    return systemTransactions
      .filter((t) => !t.isReconciled)
      .filter(
        (t) =>
          t.description.toLowerCase().includes(lower) ||
          (t.reference && t.reference.toLowerCase().includes(lower))
      )
  }, [systemTransactions, searchSystem])

  const toggleBankSelection = (id: string) => {
    setSelectedBank((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSystemSelection = (id: string) => {
    setSelectedSystem((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleReconcile = () => {
    if (selectedBank.size > 0 && selectedSystem.size > 0) {
      onReconcile?.(Array.from(selectedBank), Array.from(selectedSystem))
      setSelectedBank(new Set())
      setSelectedSystem(new Set())
    }
  }

  const handleAutoReconcile = () => {
    onAutoReconcile?.()
  }

  const selectedBankTotal = React.useMemo(() => {
    return bankTransactions
      .filter((t) => selectedBank.has(t.id))
      .reduce((sum, t) => sum + t.amount, 0)
  }, [bankTransactions, selectedBank])

  const selectedSystemTotal = React.useMemo(() => {
    return systemTransactions
      .filter((t) => selectedSystem.has(t.id))
      .reduce((sum, t) => sum + t.amount, 0)
  }, [systemTransactions, selectedSystem])

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Bank Reconciliation - {accountName}</CardTitle>
            <div className="flex items-center gap-2">
              {onAutoReconcile && (
                <Button variant="outline" size="sm" onClick={handleAutoReconcile} disabled={loading}>
                  <RefreshCwIcon className="mr-1 size-4" />
                  Auto Reconcile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Statement Balance</p>
              <p className="font-mono text-xl font-bold tabular-nums">
                {statementBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">System Balance</p>
              <p className="font-mono text-xl font-bold tabular-nums">
                {systemBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={cn("rounded-lg border p-4", isBalanced ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
              <p className="text-sm text-muted-foreground">Difference</p>
              <p className={cn("font-mono text-xl font-bold tabular-nums", isBalanced ? "text-green-600" : "text-red-600")}>
                {difference.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              {isBalanced && (
                <Badge variant="outline" className="mt-1 text-green-600 border-green-200">
                  <CheckIcon className="mr-1 size-3" />
                  Balanced
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Bank Statement Transactions</CardTitle>
              <Badge variant="outline">{filteredBankTransactions.length} items</Badge>
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bank transactions..."
                value={searchBank}
                onChange={(e) => setSearchBank(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        checked={selectedBank.size === filteredBankTransactions.length && filteredBankTransactions.length > 0}
                        onChange={() => {
                          if (selectedBank.size === filteredBankTransactions.length) {
                            setSelectedBank(new Set())
                          } else {
                            setSelectedBank(new Set(filteredBankTransactions.map((t) => t.id)))
                          }
                        }}
                        className="size-4"
                      />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBankTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No transactions
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBankTransactions.map((t) => (
                      <TableRow
                        key={t.id}
                        className={cn("cursor-pointer", selectedBank.has(t.id) && "bg-muted")}
                        onClick={() => toggleBankSelection(t.id)}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedBank.has(t.id)}
                            onChange={() => toggleBankSelection(t.id)}
                            className="size-4"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell className="text-xs">
                          {format(new Date(t.date), "MMM dd")}
                        </TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate">
                          {t.description}
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-mono text-xs tabular-nums",
                          t.type === "credit" ? "text-green-600" : "text-red-600"
                        )}>
                          {t.type === "credit" ? "+" : "-"}{Math.abs(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {selectedBank.size > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                Selected: {selectedBank.size} items ({selectedBankTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })})
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">System Transactions</CardTitle>
              <Badge variant="outline">{filteredSystemTransactions.length} items</Badge>
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search system transactions..."
                value={searchSystem}
                onChange={(e) => setSearchSystem(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        checked={selectedSystem.size === filteredSystemTransactions.length && filteredSystemTransactions.length > 0}
                        onChange={() => {
                          if (selectedSystem.size === filteredSystemTransactions.length) {
                            setSelectedSystem(new Set())
                          } else {
                            setSelectedSystem(new Set(filteredSystemTransactions.map((t) => t.id)))
                          }
                        }}
                        className="size-4"
                      />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSystemTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No unreconciled transactions
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSystemTransactions.map((t) => (
                      <TableRow
                        key={t.id}
                        className={cn("cursor-pointer", selectedSystem.has(t.id) && "bg-muted")}
                        onClick={() => toggleSystemSelection(t.id)}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedSystem.has(t.id)}
                            onChange={() => toggleSystemSelection(t.id)}
                            className="size-4"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell className="text-xs">
                          {format(new Date(t.date), "MMM dd")}
                        </TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate">
                          {t.description}
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-mono text-xs tabular-nums",
                          t.type === "credit" ? "text-green-600" : "text-red-600"
                        )}>
                          {t.type === "credit" ? "+" : "-"}{Math.abs(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          {onMarkAsReconciled && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                onMarkAsReconciled("", t.id)
                              }}
                            >
                              <CheckIcon className="size-3.5" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {selectedSystem.size > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                Selected: {selectedSystem.size} items ({selectedSystemTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })})
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedBank.size > 0 && selectedSystem.size > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bank Total</p>
                  <p className="font-mono text-sm font-medium tabular-nums">
                    {selectedBankTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <ArrowRightIcon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">System Total</p>
                  <p className="font-mono text-sm font-medium tabular-nums">
                    {selectedSystemTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Difference</p>
                  <p className={cn(
                    "font-mono text-sm font-medium tabular-nums",
                    Math.abs(selectedBankTotal - selectedSystemTotal) < 0.01
                      ? "text-green-600"
                      : "text-red-600"
                  )}>
                    {(selectedBankTotal - selectedSystemTotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleReconcile}
                disabled={loading || Math.abs(selectedBankTotal - selectedSystemTotal) >= 0.01}
              >
                <CheckIcon className="mr-1 size-4" />
                Reconcile Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export {
  BankReconciliation,
  type BankReconciliationProps,
  type BankTransaction,
  type SystemTransaction,
}
