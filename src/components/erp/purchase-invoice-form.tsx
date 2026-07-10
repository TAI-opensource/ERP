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

type PurchaseInvoiceStatus = "draft" | "submitted" | "paid" | "partially_paid" | "overdue" | "cancelled"

interface PurchaseInvoiceLineItem {
  id: string
  itemId: string
  itemName: string
  description: string
  quantity: number
  rate: number
  amount: number
  discountPercent: number
  discountAmount: number
  taxRate: number
  taxAmount: number
  total: number
}

interface PurchaseInvoiceFormData {
  supplierId: string
  supplierName: string
  invoiceDate: Date
  dueDate: Date
  supplierInvoiceNumber: string
  purchaseOrderNumber: string
  items: PurchaseInvoiceLineItem[]
  subtotal: number
  totalDiscount: number
  totalTax: number
  total: number
  notes: string
  terms: string
  paymentTerms: string
  status: PurchaseInvoiceStatus
}

interface SupplierOption {
  id: string
  name: string
  code?: string
}

interface ItemOption {
  id: string
  name: string
  code?: string
  rate: number
  taxRate?: number
}

interface PurchaseInvoiceFormProps {
  initialData?: Partial<PurchaseInvoiceFormData>
  suppliers?: SupplierOption[]
  items?: ItemOption[]
  onSubmit?: (data: PurchaseInvoiceFormData, action: "draft" | "submit") => void
  onCancel?: () => void
  loading?: boolean
  readOnly?: boolean
  invoiceNumber?: string
}

const paymentTermsOptions = [
  { value: "net_15", label: "Net 15" },
  { value: "net_30", label: "Net 30" },
  { value: "net_45", label: "Net 45" },
  { value: "net_60", label: "Net 60" },
  { value: "due_on_receipt", label: "Due on Receipt" },
]

let itemCounter = 0
function generateItemId(): string {
  return `pi-item-${Date.now()}-${++itemCounter}`
}

function PurchaseInvoiceForm({
  initialData,
  suppliers = [],
  items = [],
  onSubmit,
  onCancel,
  loading = false,
  readOnly = false,
  invoiceNumber,
}: PurchaseInvoiceFormProps) {
  const [formData, setFormData] = React.useState<PurchaseInvoiceFormData>({
    supplierId: initialData?.supplierId ?? "",
    supplierName: initialData?.supplierName ?? "",
    invoiceDate: initialData?.invoiceDate ?? new Date(),
    dueDate: initialData?.dueDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    supplierInvoiceNumber: initialData?.supplierInvoiceNumber ?? "",
    purchaseOrderNumber: initialData?.purchaseOrderNumber ?? "",
    items: initialData?.items ?? [
      {
        id: generateItemId(),
        itemId: "",
        itemName: "",
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
        discountPercent: 0,
        discountAmount: 0,
        taxRate: 0,
        taxAmount: 0,
        total: 0,
      },
    ],
    subtotal: initialData?.subtotal ?? 0,
    totalDiscount: initialData?.totalDiscount ?? 0,
    totalTax: initialData?.totalTax ?? 0,
    total: initialData?.total ?? 0,
    notes: initialData?.notes ?? "",
    terms: initialData?.terms ?? "",
    paymentTerms: initialData?.paymentTerms ?? "net_30",
    status: initialData?.status ?? "draft",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const calculateTotals = React.useCallback((items: PurchaseInvoiceLineItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
    const totalDiscount = items.reduce((sum, item) => sum + item.discountAmount, 0)
    const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0)
    const total = subtotal - totalDiscount + totalTax
    return { subtotal, totalDiscount, totalTax, total }
  }, [])

  const updateItem = (itemId: string, field: keyof PurchaseInvoiceLineItem, value: unknown) => {
    setFormData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id !== itemId) return item

        const updated = { ...item, [field]: value }

        if (field === "itemId") {
          const itemData = items.find((i) => i.id === value)
          if (itemData) {
            updated.itemName = itemData.name
            updated.rate = itemData.rate
            updated.taxRate = itemData.taxRate ?? 0
          }
        }

        const lineAmount = updated.quantity * updated.rate
        updated.amount = lineAmount
        updated.discountAmount = lineAmount * (updated.discountPercent / 100)
        const afterDiscount = lineAmount - updated.discountAmount
        updated.taxAmount = afterDiscount * (updated.taxRate / 100)
        updated.total = afterDiscount + updated.taxAmount

        return updated
      })

      const totals = calculateTotals(updatedItems)
      return { ...prev, items: updatedItems, ...totals }
    })
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: generateItemId(),
          itemId: "",
          itemName: "",
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
          discountPercent: 0,
          discountAmount: 0,
          taxRate: 0,
          taxAmount: 0,
          total: 0,
        },
      ],
    }))
  }

  const removeItem = (itemId: string) => {
    if (formData.items.length <= 1) return
    setFormData((prev) => {
      const updatedItems = prev.items.filter((i) => i.id !== itemId)
      const totals = calculateTotals(updatedItems)
      return { ...prev, items: updatedItems, ...totals }
    })
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.supplierId) newErrors.supplierId = "Supplier is required"
    if (!formData.supplierInvoiceNumber) newErrors.supplierInvoiceNumber = "Supplier invoice number is required"

    const validItems = formData.items.filter((i) => i.itemId)
    if (validItems.length === 0) newErrors.items = "At least one item is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (action: "draft" | "submit") => {
    if (validate()) {
      onSubmit?.({ ...formData, status: action === "draft" ? "draft" : "submitted" }, action)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {readOnly ? "Purchase Invoice" : "New Purchase Invoice"}
            </CardTitle>
            {invoiceNumber && (
              <Badge variant="outline" className="font-mono">{invoiceNumber}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Supplier <span className="text-destructive">*</span></Label>
              <Select
                value={formData.supplierId}
                onValueChange={(val) => {
                  const supplier = suppliers.find((s) => s.id === val)
                  setFormData((prev) => ({
                    ...prev,
                    supplierId: val,
                    supplierName: supplier?.name ?? "",
                  }))
                }}
                disabled={readOnly}
              >
                <SelectTrigger className={cn(errors.supplierId && "border-destructive")}>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.code ? `${supplier.code} - ` : ""}{supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplierId && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircleIcon className="size-3" />
                  {errors.supplierId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Supplier Invoice # <span className="text-destructive">*</span></Label>
              <Input
                value={formData.supplierInvoiceNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, supplierInvoiceNumber: e.target.value }))}
                placeholder="Invoice number from supplier"
                disabled={readOnly}
                className={cn(errors.supplierInvoiceNumber && "border-destructive")}
              />
              {errors.supplierInvoiceNumber && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircleIcon className="size-3" />
                  {errors.supplierInvoiceNumber}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <Input
                type="date"
                value={format(formData.invoiceDate, "yyyy-MM-dd")}
                onChange={(e) => setFormData((prev) => ({ ...prev, invoiceDate: new Date(e.target.value) }))}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={format(formData.dueDate, "yyyy-MM-dd")}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: new Date(e.target.value) }))}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Purchase Order #</Label>
              <Input
                value={formData.purchaseOrderNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, purchaseOrderNumber: e.target.value }))}
                placeholder="Linked PO"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select
                value={formData.paymentTerms}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, paymentTerms: val }))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Invoice Items</CardTitle>
            {!readOnly && (
              <Button size="sm" variant="outline" onClick={addItem}>
                <PlusIcon className="mr-1 size-4" />
                Add Item
              </Button>
            )}
          </div>
          {errors.items && (
            <p className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircleIcon className="size-4" />
              {errors.items}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="min-w-[200px]">Item *</TableHead>
                  <TableHead className="w-[100px]">Qty</TableHead>
                  <TableHead className="w-[120px]">Rate</TableHead>
                  <TableHead className="w-[80px]">Disc %</TableHead>
                  <TableHead className="w-[120px]">Amount</TableHead>
                  <TableHead className="w-[80px]">Tax %</TableHead>
                  <TableHead className="w-[120px] text-right">Total</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <GripVerticalIcon className="size-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.itemId}
                        onValueChange={(val) => updateItem(item.id, "itemId", val)}
                        disabled={readOnly}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {items.map((itm) => (
                            <SelectItem key={itm.id} value={itm.id}>
                              {itm.code ? `${itm.code} - ` : ""}{itm.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value) || 0)}
                        className="h-8 text-right font-mono text-xs"
                        min={0}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", Number(e.target.value) || 0)}
                        className="h-8 text-right font-mono text-xs"
                        min={0}
                        step={0.01}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.discountPercent}
                        onChange={(e) => updateItem(item.id, "discountPercent", Number(e.target.value) || 0)}
                        className="h-8 text-right font-mono text-xs"
                        min={0}
                        max={100}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums">
                      {item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.taxRate}
                        onChange={(e) => updateItem(item.id, "taxRate", Number(e.target.value) || 0)}
                        className="h-8 text-right font-mono text-xs"
                        min={0}
                        max={100}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-medium tabular-nums">
                      {item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {!readOnly && formData.items.length > 1 && (
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => removeItem(item.id)}>
                          <Trash2Icon className="size-3.5 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-end">
            <div className="w-[300px] space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono tabular-nums">{formData.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-mono text-red-600 tabular-nums">-{formData.totalDiscount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-mono tabular-nums">{formData.totalTax.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-base font-medium">
                <span>Total</span>
                <span className="font-mono tabular-nums">{formData.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Internal notes"
                rows={3}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Terms & Conditions</Label>
              <Textarea
                value={formData.terms}
                onChange={(e) => setFormData((prev) => ({ ...prev, terms: e.target.value }))}
                placeholder="Terms and conditions"
                rows={3}
                disabled={readOnly}
              />
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
          <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
            <SaveIcon className="mr-1 size-4" />
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit("submit")} disabled={loading}>
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
  PurchaseInvoiceForm,
  type PurchaseInvoiceFormData,
  type PurchaseInvoiceFormProps,
  type PurchaseInvoiceLineItem,
  type PurchaseInvoiceStatus,
  type SupplierOption,
  type ItemOption,
}
