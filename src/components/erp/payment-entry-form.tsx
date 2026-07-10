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
import { Separator } from "@/components/ui/separator"
import { AlertCircleIcon, SaveIcon, SendIcon, XIcon, CheckIcon } from "lucide-react"
import { format } from "date-fns"

type PaymentType = "receive" | "pay" | "internal_transfer"
type PaymentMode = "cash" | "bank_transfer" | "check" | "card" | "online"

interface PaymentEntryFormData {
  paymentType: PaymentType
  postingDate: Date
  partyType: "customer" | "supplier"
  partyId: string
  partyName: string
  sourceAccount: string
  sourceAccountName: string
  targetAccount: string
  targetAccountName: string
  amount: number
  receivedAmount: number
  exchangeRate: number
  referenceNumber: string
  referenceDate: Date | null
  clearanceDate: Date | null
  paymentMode: PaymentMode
  remarks: string
}

interface PartyOption {
  id: string
  name: string
  code?: string
}

interface BankAccountOption {
  id: string
  name: string
  accountCode: string
  balance: number
  currency: string
}

interface PaymentEntryFormProps {
  initialData?: Partial<PaymentEntryFormData>
  parties?: PartyOption[]
  bankAccounts?: BankAccountOption[]
  onSubmit?: (data: PaymentEntryFormData, action: "draft" | "submit") => void
  onCancel?: () => void
  loading?: boolean
  readOnly?: boolean
  paymentNumber?: string
}

const paymentTypes: { value: PaymentType; label: string }[] = [
  { value: "receive", label: "Receive" },
  { value: "pay", label: "Pay" },
  { value: "internal_transfer", label: "Internal Transfer" },
]

const paymentModes: { value: PaymentMode; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "check", label: "Check" },
  { value: "card", label: "Card" },
  { value: "online", label: "Online" },
]

function PaymentEntryForm({
  initialData,
  parties = [],
  bankAccounts = [],
  onSubmit,
  onCancel,
  loading = false,
  readOnly = false,
  paymentNumber,
}: PaymentEntryFormProps) {
  const [formData, setFormData] = React.useState<PaymentEntryFormData>({
    paymentType: initialData?.paymentType ?? "receive",
    postingDate: initialData?.postingDate ?? new Date(),
    partyType: initialData?.partyType ?? "customer",
    partyId: initialData?.partyId ?? "",
    partyName: initialData?.partyName ?? "",
    sourceAccount: initialData?.sourceAccount ?? "",
    sourceAccountName: initialData?.sourceAccountName ?? "",
    targetAccount: initialData?.targetAccount ?? "",
    targetAccountName: initialData?.targetAccountName ?? "",
    amount: initialData?.amount ?? 0,
    receivedAmount: initialData?.receivedAmount ?? 0,
    exchangeRate: initialData?.exchangeRate ?? 1,
    referenceNumber: initialData?.referenceNumber ?? "",
    referenceDate: initialData?.referenceDate ?? null,
    clearanceDate: initialData?.clearanceDate ?? null,
    paymentMode: initialData?.paymentMode ?? "bank_transfer",
    remarks: initialData?.remarks ?? "",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.postingDate) {
      newErrors.postingDate = "Posting date is required"
    }

    if (formData.paymentType !== "internal_transfer") {
      if (!formData.partyId) {
        newErrors.partyId = "Party is required"
      }
    }

    if (formData.paymentType === "internal_transfer") {
      if (!formData.sourceAccount) {
        newErrors.sourceAccount = "Source account is required"
      }
      if (!formData.targetAccount) {
        newErrors.targetAccount = "Target account is required"
      }
      if (formData.sourceAccount === formData.targetAccount) {
        newErrors.targetAccount = "Source and target accounts must be different"
      }
    } else {
      if (!formData.sourceAccount) {
        newErrors.sourceAccount = "Bank/Cash account is required"
      }
    }

    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (action: "draft" | "submit") => {
    if (validate()) {
      onSubmit?.(formData, action)
    }
  }

  const updateField = (field: keyof PaymentEntryFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const isReceive = formData.paymentType === "receive"
  const isPay = formData.paymentType === "pay"
  const isTransfer = formData.paymentType === "internal_transfer"

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {readOnly ? "Payment Entry" : "New Payment Entry"}
            </CardTitle>
            {paymentNumber && (
              <span className="font-mono text-sm text-muted-foreground">{paymentNumber}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Payment Type <span className="text-destructive">*</span></Label>
              <Select
                value={formData.paymentType}
                onValueChange={(val) => updateField("paymentType", val)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map((pt) => (
                    <SelectItem key={pt.value} value={pt.value}>
                      {pt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Posting Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={format(formData.postingDate, "yyyy-MM-dd")}
                onChange={(e) => updateField("postingDate", new Date(e.target.value))}
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
              <Label>Payment Mode</Label>
              <Select
                value={formData.paymentMode}
                onValueChange={(val) => updateField("paymentMode", val)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentModes.map((pm) => (
                    <SelectItem key={pm.value} value={pm.value}>
                      {pm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isTransfer && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  {isReceive ? "Customer" : "Supplier"} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.partyId}
                  onValueChange={(val) => {
                    const party = parties.find((p) => p.id === val)
                    updateField("partyId", val)
                    updateField("partyName", party?.name ?? "")
                  }}
                  disabled={readOnly}
                >
                  <SelectTrigger className={cn(errors.partyId && "border-destructive")}>
                    <SelectValue placeholder={`Select ${isReceive ? "customer" : "supplier"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {parties.map((party) => (
                      <SelectItem key={party.id} value={party.id}>
                        {party.code ? `${party.code} - ` : ""}{party.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.partyId && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircleIcon className="size-3" />
                    {errors.partyId}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                {isTransfer ? "From Account" : "Bank/Cash Account"} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.sourceAccount}
                onValueChange={(val) => {
                  const account = bankAccounts.find((a) => a.id === val)
                  updateField("sourceAccount", val)
                  updateField("sourceAccountName", account?.name ?? "")
                }}
                disabled={readOnly}
              >
                <SelectTrigger className={cn(errors.sourceAccount && "border-destructive")}>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{account.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {account.currency} {account.balance.toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sourceAccount && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircleIcon className="size-3" />
                  {errors.sourceAccount}
                </p>
              )}
            </div>

            {isTransfer && (
              <div className="space-y-2">
                <Label>To Account <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.targetAccount}
                  onValueChange={(val) => {
                    const account = bankAccounts.find((a) => a.id === val)
                    updateField("targetAccount", val)
                    updateField("targetAccountName", account?.name ?? "")
                  }}
                  disabled={readOnly}
                >
                  <SelectTrigger className={cn(errors.targetAccount && "border-destructive")}>
                    <SelectValue placeholder="Select target account" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts
                      .filter((a) => a.id !== formData.sourceAccount)
                      .map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{account.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {account.currency} {account.balance.toLocaleString()}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.targetAccount && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircleIcon className="size-3" />
                    {errors.targetAccount}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Amount <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                value={formData.amount || ""}
                onChange={(e) => updateField("amount", Number(e.target.value) || 0)}
                min={0}
                step={0.01}
                disabled={readOnly}
                className={cn("font-mono", errors.amount && "border-destructive")}
              />
              {errors.amount && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircleIcon className="size-3" />
                  {errors.amount}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Received Amount</Label>
              <Input
                type="number"
                value={formData.receivedAmount || ""}
                onChange={(e) => updateField("receivedAmount", Number(e.target.value) || 0)}
                min={0}
                step={0.01}
                disabled={readOnly}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Exchange Rate</Label>
              <Input
                type="number"
                value={formData.exchangeRate}
                onChange={(e) => updateField("exchangeRate", Number(e.target.value) || 1)}
                min={0}
                step={0.0001}
                disabled={readOnly}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input
                value={formData.referenceNumber}
                onChange={(e) => updateField("referenceNumber", e.target.value)}
                placeholder="Optional reference"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label>Reference Date</Label>
              <Input
                type="date"
                value={formData.referenceDate ? format(formData.referenceDate, "yyyy-MM-dd") : ""}
                onChange={(e) => updateField("referenceDate", e.target.value ? new Date(e.target.value) : null)}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label>Clearance Date</Label>
              <Input
                type="date"
                value={formData.clearanceDate ? format(formData.clearanceDate, "yyyy-MM-dd") : ""}
                onChange={(e) => updateField("clearanceDate", e.target.value ? new Date(e.target.value) : null)}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={formData.remarks}
              onChange={(e) => updateField("remarks", e.target.value)}
              placeholder="Optional remarks"
              rows={2}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {!readOnly && (
        <>
          <Separator />
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
              disabled={loading}
            >
              {loading && <div className="mr-1 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
              <CheckIcon className="mr-1 size-4" />
              Submit
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export {
  PaymentEntryForm,
  type PaymentEntryFormData,
  type PaymentEntryFormProps,
  type PaymentType,
  type PaymentMode,
  type PartyOption,
  type BankAccountOption,
  paymentTypes,
  paymentModes,
}
