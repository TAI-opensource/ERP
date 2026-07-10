"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { DownloadIcon, PrinterIcon } from "lucide-react"

interface FinancialLineItem {
  id: string
  label: string
  value: number
  level?: number
  isTotal?: boolean
  isSubtotal?: boolean
  children?: FinancialLineItem[]
}

interface FinancialStatementsProps {
 dre?: FinancialLineItem[]
  balanceSheet?: FinancialLineItem[]
  cashFlow?: FinancialLineItem[]
  period?: string
  companyName?: string
  onExport?: (format: "pdf" | "xlsx") => void
  onPrint?: () => void
  className?: string
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

function FinancialLineItemRow({
  item,
  level = 0,
}: {
  item: FinancialLineItem
  level?: number
}) {
  return (
    <>
      <TableRow
        className={cn(
          item.isTotal && "font-bold bg-muted/50",
          item.isSubtotal && "font-semibold",
          item.level === 0 && "font-medium"
        )}
      >
        <TableCell
          className="text-sm"
          style={{ paddingLeft: `${(level * 16) + 12}px` }}
        >
          {item.label}
        </TableCell>
        <TableCell
          className={cn(
            "text-right text-sm tabular-nums",
            item.isTotal && "font-bold",
            item.isSubtotal && "font-semibold",
            item.value < 0 && "text-red-600 dark:text-red-400"
          )}
        >
          {formatCurrency(item.value)}
        </TableCell>
      </TableRow>
      {item.children?.map((child) => (
        <FinancialLineItemRow key={child.id} item={child} level={level + 1} />
      ))}
    </>
  )
}

function StatementTable({ items }: { items: FinancialLineItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-sm">Description</TableHead>
          <TableHead className="text-right text-sm">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <FinancialLineItemRow key={item.id} item={item} />
        ))}
      </TableBody>
    </Table>
  )
}

function FinancialStatements({
  dre = [],
  balanceSheet = [],
  cashFlow = [],
  period = "Q4 2024",
  companyName = "Company Name",
  onExport,
  onPrint,
  className,
}: FinancialStatementsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Financial Statements</CardTitle>
            <p className="text-sm text-muted-foreground">
              {companyName} — {period}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onPrint && (
              <Button variant="outline" size="sm" onClick={onPrint}>
                <PrinterIcon className="mr-1 size-3" />
                Print
              </Button>
            )}
            {onExport && (
              <>
                <Button variant="outline" size="sm" onClick={() => onExport("pdf")}>
                  <DownloadIcon className="mr-1 size-3" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => onExport("xlsx")}>
                  <DownloadIcon className="mr-1 size-3" />
                  Excel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dre">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dre">Income Statement (DRE)</TabsTrigger>
            <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          </TabsList>

          <TabsContent value="dre" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <StatementTable items={dre} />
            </div>
          </TabsContent>

          <TabsContent value="balance" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <StatementTable items={balanceSheet} />
            </div>
          </TabsContent>

          <TabsContent value="cashflow" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <StatementTable items={cashFlow} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export { FinancialStatements, formatCurrency, type FinancialLineItem, type FinancialStatementsProps }
