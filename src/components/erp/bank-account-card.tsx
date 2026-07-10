"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LandmarkIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  RefreshCwIcon,
} from "lucide-react"

interface BankAccountCardProps {
  accountName: string
  accountNumber: string
  bankName: string
  balance: number
  availableBalance?: number
  currency?: string
  accountType?: "checking" | "savings" | "credit" | "investment"
  lastTransaction?: {
    description: string
    amount: number
    date: string
  }
  onViewTransactions?: () => void
  onTransfer?: () => void
  className?: string
}

const accountTypeConfig: Record<string, { label: string; color: string }> = {
  checking: { label: "Checking", color: "bg-blue-100 text-blue-700" },
  savings: { label: "Savings", color: "bg-green-100 text-green-700" },
  credit: { label: "Credit", color: "bg-purple-100 text-purple-700" },
  investment: { label: "Investment", color: "bg-orange-100 text-orange-700" },
}

function BankAccountCard({
  accountName,
  accountNumber,
  bankName,
  balance,
  availableBalance,
  currency = "USD",
  accountType = "checking",
  lastTransaction,
  onViewTransactions,
  onTransfer,
  className,
}: BankAccountCardProps) {
  const [showBalance, setShowBalance] = React.useState(true)

  const maskedAccountNumber = React.useMemo(() => {
    if (accountNumber.length <= 4) return accountNumber
    return "****" + accountNumber.slice(-4)
  }, [accountNumber])

  const formatCurrency = (amount: number) => {
    return `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary/5" />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {accountName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <LandmarkIcon className="size-4 text-muted-foreground" />
            <span className="text-sm">{bankName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={cn("text-xs", accountTypeConfig[accountType]?.color)}>
            {accountTypeConfig[accountType]?.label}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <EyeIcon className="size-3.5" /> : <EyeOffIcon className="size-3.5" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">Account Number</p>
          <p className="font-mono text-sm">{maskedAccountNumber}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Current Balance</p>
          <p className={cn(
            "text-2xl font-bold tabular-nums",
            balance < 0 ? "text-destructive" : "text-foreground"
          )}>
            {showBalance ? formatCurrency(balance) : "****"}
          </p>
        </div>

        {availableBalance !== undefined && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className={cn(
              "font-mono text-sm tabular-nums",
              availableBalance < 0 ? "text-destructive" : "text-green-600"
            )}>
              {showBalance ? formatCurrency(availableBalance) : "****"}
            </p>
          </div>
        )}

        {lastTransaction && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {lastTransaction.amount >= 0 ? (
                  <ArrowDownLeftIcon className="size-4 text-green-600" />
                ) : (
                  <ArrowUpRightIcon className="size-4 text-red-600" />
                )}
                <div>
                  <p className="text-xs font-medium">{lastTransaction.description}</p>
                  <p className="text-[10px] text-muted-foreground">{lastTransaction.date}</p>
                </div>
              </div>
              <span className={cn(
                "font-mono text-xs tabular-nums",
                lastTransaction.amount >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {lastTransaction.amount >= 0 ? "+" : ""}{formatCurrency(Math.abs(lastTransaction.amount))}
              </span>
            </div>
          </>
        )}

        <Separator />

        <div className="flex items-center gap-2">
          {onViewTransactions && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onViewTransactions}>
              View Transactions
            </Button>
          )}
          {onTransfer && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onTransfer}>
              <RefreshCwIcon className="mr-1 size-3.5" />
              Transfer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export {
  BankAccountCard,
  type BankAccountCardProps,
  accountTypeConfig,
}
