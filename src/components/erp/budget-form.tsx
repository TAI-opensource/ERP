"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, Trash2Icon, AlertCircleIcon, SaveIcon, XIcon } from "lucide-react"

interface BudgetLine {
  id: string
  accountId: string
  accountCode: string
  accountName: string
  monthlyAmounts: number[]
  total: number
}

interface BudgetFormData {
  name: string
  description: string
  fiscalYear: string
  costCenter: string
  status: "draft" | "active" | "archived"
  lines: BudgetLine[]
}

interface AccountOption {
  id: string
  code: string
  name: string
}

interface CostCenterOption {
  id: string
  name: string
}

interface BudgetFormProps {
  initialData?: Partial<BudgetFormData>
  accounts?: AccountOption[]
  costCenters?: CostCenterOption[]
  fiscalYears?: string[]
  onSubmit?: (data: BudgetFormData) => void
  onCancel?: () => void
  loading?: boolean
  readOnly?: boolean
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

let lineCounter = 0
function generateLineId(): string {
  return `budget-line-${Date.now()}-${++lineCounter}`
}

function BudgetForm({
  initialData,
  accounts = [],
  costCenters = [],
  fiscalYears = ["2024", "2025", "2026"],
  onSubmit,
  onCancel,
  loading = false,
  readOnly = false,
}: BudgetFormProps) {
  const [formData, setFormData] = React.useState<BudgetFormData>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    fiscalYear: initialData?.fiscalYear ?? new Date().getFullYear().toString(),
    costCenter: initialData?.costCenter ?? "",
    status: initialData?.status ?? "draft",
    lines: initialData?.lines ?? [
      {
        id: generateLineId(),
        accountId: "",
        accountCode: "",
        accountName: "",
        monthlyAmounts: new Array(12).fill(0),
        total: 0,
      },
    ],
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Budget name is required"
    if (!formData.fiscalYear) newErrors.fiscalYear = "Fiscal year is required"

    const validLines = formData.lines.filter((l) => l.accountId)
    if (validLines.length === 0) newErrors.lines = "At least one account line is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSubmit?.(formData)
    }
  }

  const addLine = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          id: generateLineId(),
          accountId: "",
          accountCode: "",
          accountName: "",
          monthlyAmounts: new Array(12).fill(0),
          total: 0,
        },
      ],
    }))
  }

  const removeLine = (lineId: string) => {
    if (formData.lines.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.filter((l) => l.id !== lineId),
    }))
  }

  const updateLineAccount = (lineId: string, accountId: string) => {
    const account = accounts.find((a) => a.id === accountId)
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.map((line) =>
        line.id === lineId
          ? { ...line, accountId, accountCode: account?.code ?? "", accountName: account?.name ?? "" }
          : line
      ),
    }))
  }

  const updateMonthlyAmount = (lineId: string, monthIndex: number, value: number) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.map((line) => {
        if (line.id !== lineId) return line
        const newAmounts = [...line.monthlyAmounts]
        newAmounts[monthIndex] = value
        const total = newAmounts.reduce((sum, amt) => sum + amt, 0)
        return { ...line, monthlyAmounts: newAmounts, total }
      }),
    }))
  }

  const columnTotals = React.useMemo(() => {
    return months.map((_, monthIndex) =>
      formData.lines.reduce((sum, line) => sum + (line.monthlyAmounts[monthIndex] || 0), 0)
    )
  }, [formData.lines])

  const grandTotal = React.useMemo(
    () => columnTotals.reduce((sum, total) => sum + total, 0),
    [columnTotals]
  )

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {readOnly ? "Budget" : "New Budget"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Budget Name <span className="text-destructive">*</span></Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Marketing Budget 2026"
                disabled={readOnly}
                className={cn(errors.name && "border-destructive")}
              />
              {errors.name && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircleIcon className="size-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fiscal Year <span className="text-destructive">*</span></Label>
              <Select
                value={formData.fiscalYear}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, fiscalYear: val ?? "" }))}
                disabled={readOnly}
              >
                <SelectTrigger className={cn(errors.fiscalYear && "border-destructive")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fiscalYears.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fiscalYear && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircleIcon className="size-3" />
                  {errors.fiscalYear}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Cost Center</Label>
              <Select
                value={formData.costCenter}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, costCenter: val ?? "" }))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All cost centers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {costCenters.map((cc) => (
                    <SelectItem key={cc.id} value={cc.id}>{cc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, status: (val ?? "draft") as BudgetFormData["status"] }))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description"
              rows={2}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Budget Lines</CardTitle>
              {errors.lines && (
                <p className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircleIcon className="size-4" />
                  {errors.lines}
                </p>
              )}
            </div>
            {!readOnly && (
              <Button size="sm" variant="outline" onClick={addLine}>
                <PlusIcon className="mr-1 size-4" />
                Add Line
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Account</TableHead>
                  {months.map((month) => (
                    <TableHead key={month} className="w-[100px] text-right">
                      {month}
                    </TableHead>
                  ))}
                  <TableHead className="w-[120px] text-right">Total</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <Select
                        value={line.accountId}
                        onValueChange={(val) => updateLineAccount(line.id, val ?? "")}
                        disabled={readOnly}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              <span className="font-mono text-xs">{account.code}</span> - {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    {months.map((_, monthIndex) => (
                      <TableCell key={monthIndex}>
                        <Input
                          type="number"
                          value={line.monthlyAmounts[monthIndex] || ""}
                          onChange={(e) =>
                            updateMonthlyAmount(line.id, monthIndex, Number(e.target.value) || 0)
                          }
                          className="h-8 text-right font-mono text-xs"
                          min={0}
                          disabled={readOnly}
                        />
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-mono text-xs font-medium tabular-nums">
                      {line.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {!readOnly && formData.lines.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => removeLine(line.id)}
                        >
                          <Trash2Icon className="size-3.5 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell>Total</TableCell>
                  {columnTotals.map((total, idx) => (
                    <TableCell key={idx} className="text-right font-mono text-xs tabular-nums">
                      {total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-mono text-xs tabular-nums">
                    {grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {!readOnly && (
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              <XIcon className="mr-1 size-4" />
              Cancel
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <div className="mr-1 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
            <SaveIcon className="mr-1 size-4" />
            Save Budget
          </Button>
        </div>
      )}
    </div>
  )
}

export {
  BudgetForm,
  type BudgetFormData,
  type BudgetFormProps,
  type BudgetLine,
  type AccountOption,
  type CostCenterOption,
  months,
}
