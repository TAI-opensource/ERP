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
import { Badge } from "@/components/ui/badge"
import {
  PlusIcon,
  Trash2Icon,
  AlertCircleIcon,
  SaveIcon,
  SendIcon,
  XIcon,
  GripVerticalIcon,
} from "lucide-react"
import { format } from "date-fns"

type VoucherType = "journal" | "credit_note" | "debit_note" | "opening_entry" | "closing_entry"

interface JournalEntryLine {
  id: string
  accountId: string
  accountCode: string
  accountName: string
  debit: number
  credit: number
  costCenter?: string
  description: string
}

interface JournalEntryFormData {
  postingDate: Date
  voucherType: VoucherType
  referenceNumber: string
  remarks: string
  lines: JournalEntryLine[]
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

interface JournalEntryFormProps {
  initialData?: Partial<JournalEntryFormData>
  accounts?: AccountOption[]
  costCenters?: CostCenterOption[]
  onSubmit?: (data: JournalEntryFormData, action: "draft" | "submit") => void
  onCancel?: () => void
  loading?: boolean
  readOnly?: boolean
  voucherNumber?: string
}

const voucherTypes: { value: VoucherType; label: string }[] = [
  { value: "journal", label: "Journal Entry" },
  { value: "credit_note", label: "Credit Note" },
  { value: "debit_note", label: "Debit Note" },
  { value: "opening_entry", label: "Opening Entry" },
  { value: "closing_entry", label: "Closing Entry" },
]

let lineCounter = 0
function generateLineId(): string {
  return `line-${Date.now()}-${++lineCounter}`
}

function JournalEntryForm({
  initialData,
  accounts = [],
  costCenters = [],
  onSubmit,
  onCancel,
  loading = false,
  readOnly = false,
  voucherNumber,
}: JournalEntryFormProps) {
  const [formData, setFormData] = React.useState<JournalEntryFormData>({
    postingDate: initialData?.postingDate ?? new Date(),
    voucherType: initialData?.voucherType ?? "journal",
    referenceNumber: initialData?.referenceNumber ?? "",
    remarks: initialData?.remarks ?? "",
    lines: initialData?.lines ?? [
      {
        id: generateLineId(),
        accountId: "",
        accountCode: "",
        accountName: "",
        debit: 0,
        credit: 0,
        costCenter: "",
        description: "",
      },
      {
        id: generateLineId(),
        accountId: "",
        accountCode: "",
        accountName: "",
        debit: 0,
        credit: 0,
        costCenter: "",
        description: "",
      },
    ],
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const totalDebit = React.useMemo(
    () => formData.lines.reduce((sum, line) => sum + (line.debit || 0), 0),
    [formData.lines]
  )

  const totalCredit = React.useMemo(
    () => formData.lines.reduce((sum, line) => sum + (line.credit || 0), 0),
    [formData.lines]
  )

  const isBalanced = React.useMemo(
    () => Math.abs(totalDebit - totalCredit) < 0.01,
    [totalDebit, totalCredit]
  )

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.postingDate) {
      newErrors.postingDate = "Posting date is required"
    }

    const nonEmptyLines = formData.lines.filter((l) => l.accountId || l.debit || l.credit)
    if (nonEmptyLines.length < 2) {
      newErrors.lines = "At least 2 lines are required"
    }

    if (!isBalanced) {
      newErrors.balance = "Total debit must equal total credit"
    }

    const hasEmptyAccount = nonEmptyLines.some((l) => !l.accountId)
    if (hasEmptyAccount) {
      newErrors.accounts = "All lines must have an account selected"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (action: "draft" | "submit") => {
    if (validate()) {
      onSubmit?.(formData, action)
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
          debit: 0,
          credit: 0,
          costCenter: "",
          description: "",
        },
      ],
    }))
  }

  const removeLine = (lineId: string) => {
    if (formData.lines.length <= 2) return
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.filter((l) => l.id !== lineId),
    }))
  }

  const updateLine = (lineId: string, field: keyof JournalEntryLine, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.map((line) => {
        if (line.id !== lineId) return line

        const updated = { ...line, [field]: value }

        if (field === "accountId") {
          const account = accounts.find((a) => a.id === value)
          if (account) {
            updated.accountCode = account.code
            updated.accountName = account.name
          }
        }

        if (field === "debit" && Number(value) > 0) {
          updated.credit = 0
        } else if (field === "credit" && Number(value) > 0) {
          updated.debit = 0
        }

        return updated
      }),
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {readOnly ? "Journal Entry" : "New Journal Entry"}
            </CardTitle>
            {voucherNumber && (
              <Badge variant="outline" className="font-mono">
                {voucherNumber}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>
                Posting Date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={format(formData.postingDate, "yyyy-MM-dd")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    postingDate: new Date(e.target.value),
                  }))
                }
                disabled={readOnly}
                className={cn(errors.postingDate && "border-destructive")}
              />
              {errors.postingDate && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircleIcon className="size-3" />
                  {errors.postingDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Voucher Type</Label>
              <Select
                value={formData.voucherType}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, voucherType: val as VoucherType }))
                }
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voucherTypes.map((vt) => (
                    <SelectItem key={vt.value} value={vt.value}>
                      {vt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input
                value={formData.referenceNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, referenceNumber: e.target.value }))
                }
                placeholder="Optional reference"
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={formData.remarks}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, remarks: e.target.value }))
              }
              placeholder="Optional remarks"
              rows={2}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Entry Lines</CardTitle>
            {!readOnly && (
              <Button size="sm" variant="outline" onClick={addLine}>
                <PlusIcon className="mr-1 size-4" />
                Add Line
              </Button>
            )}
          </div>
          {(errors.lines || errors.balance || errors.accounts) && (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircleIcon className="size-4" />
              {errors.lines || errors.balance || errors.accounts}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="min-w-[200px]">Account *</TableHead>
                  <TableHead className="w-[150px] text-right">Debit</TableHead>
                  <TableHead className="w-[150px] text-right">Credit</TableHead>
                  <TableHead className="min-w-[150px]">Cost Center</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <GripVerticalIcon className="size-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={line.accountId}
                        onValueChange={(val) => updateLine(line.id, "accountId", val)}
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
                    <TableCell>
                      <Input
                        type="number"
                        value={line.debit || ""}
                        onChange={(e) =>
                          updateLine(line.id, "debit", Number(e.target.value) || 0)
                        }
                        className="h-8 text-right font-mono text-xs"
                        min={0}
                        step={0.01}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.credit || ""}
                        onChange={(e) =>
                          updateLine(line.id, "credit", Number(e.target.value) || 0)
                        }
                        className="h-8 text-right font-mono text-xs"
                        min={0}
                        step={0.01}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={line.costCenter ?? ""}
                        onValueChange={(val) => updateLine(line.id, "costCenter", val)}
                        disabled={readOnly}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {costCenters.map((cc) => (
                            <SelectItem key={cc.id} value={cc.id}>
                              {cc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={line.description}
                        onChange={(e) => updateLine(line.id, "description", e.target.value)}
                        className="h-8 text-xs"
                        placeholder="Line description"
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      {!readOnly && formData.lines.length > 2 && (
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
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-end gap-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total Debit:</span>
              <span className="font-mono text-sm font-medium tabular-nums">
                {totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total Credit:</span>
              <span className="font-mono text-sm font-medium tabular-nums">
                {totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Difference:</span>
              <span
                className={cn(
                  "font-mono text-sm font-medium tabular-nums",
                  isBalanced ? "text-green-600" : "text-destructive"
                )}
              >
                {(totalDebit - totalCredit).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {isBalanced && totalDebit > 0 && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Balanced
                </Badge>
              )}
            </div>
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
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={loading}
          >
            <SaveIcon className="mr-1 size-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit("submit")}
            disabled={loading || !isBalanced}
          >
            {loading && <div className="mr-1 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
            <SendIcon className="mr-1 size-4" />
            Submit
          </Button>
        </div>
      )}
    </div>
  )
}

export {
  JournalEntryForm,
  type JournalEntryLine,
  type JournalEntryFormData,
  type JournalEntryFormProps,
  type VoucherType,
  type AccountOption,
  type CostCenterOption,
}
