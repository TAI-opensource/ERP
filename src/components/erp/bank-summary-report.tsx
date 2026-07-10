"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DownloadIcon, PrinterIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"

interface BankAccountSummary {
  id: string
  accountName: string
  bankName: string
  accountNumber: string
  balance: number
  availableBalance: number
  currency: string
  lastReconciled?: string
}

interface BankSummaryReportProps {
  companyName: string
  reportDate: string
  accounts: BankAccountSummary[]
  totalBalance: number
  totalAvailableBalance: number
  onExport?: () => void
  onPrint?: () => void
  className?: string
}

function BankSummaryReport({
  companyName,
  reportDate,
  accounts,
  totalBalance,
  totalAvailableBalance,
  onExport,
  onPrint,
  className,
}: BankSummaryReportProps) {
  const formatAmount = (amount: number, currency = "USD") =>
    `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Bank Summary</CardTitle>
            <p className="text-sm text-muted-foreground">{companyName}</p>
            <p className="text-sm text-muted-foreground">As of {reportDate}</p>
          </div>
          <div className="flex items-center gap-2">
            {onPrint && (
              <Button variant="outline" size="sm" onClick={onPrint}>
                <PrinterIcon className="mr-1 size-4" />
                Print
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <DownloadIcon className="mr-1 size-4" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {formatAmount(totalBalance)}
            </p>
          </div>
          <div className="rounded-lg border p-4 border-green-200 bg-green-50">
            <p className="text-sm text-muted-foreground">Total Available</p>
            <p className="font-mono text-2xl font-bold tabular-nums text-green-600">
              {formatAmount(totalAvailableBalance)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{account.accountName}</h4>
                  <p className="text-sm text-muted-foreground">{account.bankName}</p>
                  <p className="font-mono text-xs text-muted-foreground">{account.accountNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-bold tabular-nums">
                    {formatAmount(account.balance, account.currency)}
                  </p>
                  {account.availableBalance !== account.balance && (
                    <p className="font-mono text-sm text-green-600 tabular-nums">
                      Available: {formatAmount(account.availableBalance, account.currency)}
                    </p>
                  )}
                  {account.lastReconciled && (
                    <p className="text-xs text-muted-foreground">
                      Last reconciled: {account.lastReconciled}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No bank accounts found
          </div>
        )}

        <Separator />

        <div className="rounded-lg bg-muted/30 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Accounts</p>
              <p className="text-2xl font-bold">{accounts.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Balance</p>
              <p className="font-mono text-2xl font-bold tabular-nums">
                {formatAmount(totalBalance)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="font-mono text-2xl font-bold tabular-nums text-green-600">
                {formatAmount(totalAvailableBalance)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export {
  BankSummaryReport,
  type BankSummaryReportProps,
  type BankAccountSummary,
}
