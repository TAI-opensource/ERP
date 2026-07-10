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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircleIcon, ChevronDownIcon, SearchIcon } from "lucide-react"

type AccountType = "asset" | "liability" | "equity" | "income" | "expense"

interface AccountOption {
  id: string
  name: string
  code: string
  level: number
}

interface AccountFormData {
  name: string
  code: string
  type: AccountType
  subtype: string
  parentId: string | null
  currency: string
  isActive: boolean
  description: string
  openingBalance: number
}

interface AccountFormProps {
  initialData?: Partial<AccountFormData>
  parentAccounts?: AccountOption[]
  currencies?: string[]
  onSubmit: (data: AccountFormData) => void
  onCancel?: () => void
  loading?: boolean
  mode?: "create" | "edit"
}

const accountTypes: { value: AccountType; label: string }[] = [
  { value: "asset", label: "Asset" },
  { value: "liability", label: "Liability" },
  { value: "equity", label: "Equity" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
]

const subtypesByType: Record<AccountType, string[]> = {
  asset: ["Current Asset", "Fixed Asset", "Bank Account", "Cash Account", "Accounts Receivable", "Inventory", "Investment"],
  liability: ["Current Liability", "Long-term Liability", "Accounts Payable", "Tax Payable", "Loan"],
  equity: ["Share Capital", "Retained Earnings", "Reserve", "Dividend"],
  income: ["Sales Revenue", "Service Revenue", "Interest Income", "Other Income", "Discount Received"],
  expense: ["Cost of Goods Sold", "Operating Expense", "Salary Expense", "Rent Expense", "Depreciation", "Interest Expense"],
}

const defaultCurrencies = ["USD", "EUR", "GBP", "BRL", "JPY", "CAD", "AUD"]

function AccountTreeSelect({
  accounts,
  value,
  onChange,
  placeholder = "Select parent account (optional)",
}: {
  accounts: AccountOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
}) {
  const [search, setSearch] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const filteredAccounts = React.useMemo(() => {
    if (!search) return accounts
    const lower = search.toLowerCase()
    return accounts.filter(
      (a) => a.name.toLowerCase().includes(lower) || a.code.toLowerCase().includes(lower)
    )
  }, [accounts, search])

  const selectedAccount = accounts.find((a) => a.id === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          !selectedAccount && "text-muted-foreground"
        )}
      >
        {selectedAccount ? (
          <span className="flex items-center gap-2">
            <span className="font-mono text-xs">{selectedAccount.code}</span>
            {selectedAccount.name}
          </span>
        ) : (
          placeholder
        )}
        <ChevronDownIcon className={cn("size-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          <div className="relative mb-1">
            <SearchIcon className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-7 text-xs"
              autoFocus
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onChange(null)
              setIsOpen(false)
              setSearch("")
            }}
            className={cn(
              "flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
              value === null && "bg-accent"
            )}
          >
            No parent (root account)
          </button>

          <div className="max-h-[200px] overflow-y-auto">
            {filteredAccounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => {
                  onChange(account.id)
                  setIsOpen(false)
                  setSearch("")
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                  value === account.id && "bg-accent"
                )}
                style={{ paddingLeft: `${account.level * 16 + 8}px` }}
              >
                <span className="font-mono text-xs text-muted-foreground">{account.code}</span>
                <span>{account.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AccountForm({
  initialData,
  parentAccounts = [],
  currencies = defaultCurrencies,
  onSubmit,
  onCancel,
  loading = false,
  mode = "create",
}: AccountFormProps) {
  const [formData, setFormData] = React.useState<AccountFormData>({
    name: initialData?.name ?? "",
    code: initialData?.code ?? "",
    type: initialData?.type ?? "asset",
    subtype: initialData?.subtype ?? "",
    parentId: initialData?.parentId ?? null,
    currency: initialData?.currency ?? "USD",
    isActive: initialData?.isActive ?? true,
    description: initialData?.description ?? "",
    openingBalance: initialData?.openingBalance ?? 0,
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Account name is required"
    }
    if (!formData.code.trim()) {
      newErrors.code = "Account code is required"
    }
    if (!formData.type) {
      newErrors.type = "Account type is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const updateField = (field: keyof AccountFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {mode === "create" ? "New Account" : "Edit Account"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Account Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Cash in Bank"
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
              <Label htmlFor="code">
                Account Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => updateField("code", e.target.value)}
                placeholder="e.g. 1101"
                className={cn("font-mono", errors.code && "border-destructive")}
              />
              {errors.code && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircleIcon className="size-3" />
                  {errors.code}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Account Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(val) => updateField("type", val)}
              >
                <SelectTrigger className={cn(errors.type && "border-destructive")}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircleIcon className="size-3" />
                  {errors.type}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Subtype</Label>
              <Select
                value={formData.subtype}
                onValueChange={(val) => updateField("subtype", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subtype" />
                </SelectTrigger>
                <SelectContent>
                  {subtypesByType[formData.type].map((subtype) => (
                    <SelectItem key={subtype} value={subtype}>
                      {subtype}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Parent Account</Label>
            <AccountTreeSelect
              accounts={parentAccounts}
              value={formData.parentId}
              onChange={(val) => updateField("parentId", val)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(val) => updateField("currency", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Opening Balance</Label>
              <Input
                type="number"
                value={formData.openingBalance}
                onChange={(e) => updateField("openingBalance", Number(e.target.value))}
                step={0.01}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Optional description for this account"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => updateField("isActive", checked)}
            />
            <Label className="text-sm font-normal">Active</Label>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading && <div className="mr-1 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
          {mode === "create" ? "Create Account" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}

export {
  AccountForm,
  AccountTreeSelect,
  type AccountFormData,
  type AccountFormProps,
  type AccountOption,
  accountTypes,
  subtypesByType,
}
