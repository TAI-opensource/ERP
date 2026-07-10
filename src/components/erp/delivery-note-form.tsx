"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { PlusIcon, Trash2Icon, SaveIcon, PrinterIcon, SendIcon } from "lucide-react"

interface DeliveryNoteItem {
  id: string
  description: string
  sku: string
  quantity: number
  unit: string
  deliveredQuantity: number
  condition: "good" | "damaged" | "partial"
  notes?: string
}

interface DeliveryNoteFormProps {
  onSubmit?: (data: DeliveryNoteFormData) => void
  onSaveDraft?: (data: DeliveryNoteFormData) => void
  onPrint?: (data: DeliveryNoteFormData) => void
  className?: string
  initialData?: Partial<DeliveryNoteFormData>
}

interface DeliveryNoteFormData {
  noteNumber: string
  orderNumber: string
  customerName: string
  customerAddress: string
  shippingAddress: string
  carrier: string
  trackingNumber: string
  expectedDeliveryDate: string
  actualDeliveryDate: string
  receivedBy: string
  items: DeliveryNoteItem[]
  generalNotes: string
  status: "pending" | "in_transit" | "delivered" | "partially_delivered"
}

function DeliveryNoteForm({
  onSubmit,
  onSaveDraft,
  onPrint,
  className,
  initialData,
}: DeliveryNoteFormProps) {
  const [formData, setFormData] = React.useState<DeliveryNoteFormData>({
    noteNumber: initialData?.noteNumber ?? `DN-${Date.now()}`,
    orderNumber: initialData?.orderNumber ?? "",
    customerName: initialData?.customerName ?? "",
    customerAddress: initialData?.customerAddress ?? "",
    shippingAddress: initialData?.shippingAddress ?? "",
    carrier: initialData?.carrier ?? "",
    trackingNumber: initialData?.trackingNumber ?? "",
    expectedDeliveryDate: initialData?.expectedDeliveryDate ?? "",
    actualDeliveryDate: initialData?.actualDeliveryDate ?? "",
    receivedBy: initialData?.receivedBy ?? "",
    items: initialData?.items ?? [
      {
        id: "1",
        description: "",
        sku: "",
        quantity: 1,
        unit: "Unit",
        deliveredQuantity: 0,
        condition: "good",
      },
    ],
    generalNotes: initialData?.generalNotes ?? "",
    status: initialData?.status ?? "pending",
  })

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now().toString(),
          description: "",
          sku: "",
          quantity: 1,
          unit: "Unit",
          deliveredQuantity: 0,
          condition: "good",
        },
      ],
    }))
  }

  const handleRemoveItem = (id: string) => {
    if (formData.items.length === 1) return
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  const handleItemChange = (id: string, field: keyof DeliveryNoteItem, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  const handleSubmit = (action: "submit" | "draft" | "print") => {
    if (action === "print") {
      onPrint?.(formData)
    } else if (action === "draft") {
      onSaveDraft?.(formData)
    } else {
      onSubmit?.(formData)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Delivery Note</CardTitle>
            <p className="text-sm text-muted-foreground">{formData.noteNumber}</p>
          </div>
          <Badge
            className={cn(
              formData.status === "delivered" && "bg-green-100 text-green-700",
              formData.status === "in_transit" && "bg-blue-100 text-blue-700",
              formData.status === "partially_delivered" && "bg-yellow-100 text-yellow-700",
              formData.status === "pending" && "bg-gray-100 text-gray-700"
            )}
          >
            {formData.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="noteNumber">Note Number</Label>
            <Input
              id="noteNumber"
              value={formData.noteNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, noteNumber: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Order Number *</Label>
            <Input
              id="orderNumber"
              value={formData.orderNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, orderNumber: e.target.value }))}
              placeholder="PO or SO number"
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
              placeholder="Customer or company name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier</Label>
            <Input
              id="carrier"
              value={formData.carrier}
              onChange={(e) => setFormData((prev) => ({ ...prev, carrier: e.target.value }))}
              placeholder="Shipping carrier"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerAddress">Customer Address</Label>
            <Textarea
              id="customerAddress"
              value={formData.customerAddress}
              onChange={(e) => setFormData((prev) => ({ ...prev, customerAddress: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingAddress">Shipping Address</Label>
            <Textarea
              id="shippingAddress"
              value={formData.shippingAddress}
              onChange={(e) => setFormData((prev) => ({ ...prev, shippingAddress: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Tracking Number</Label>
            <Input
              id="trackingNumber"
              value={formData.trackingNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, trackingNumber: e.target.value }))}
              placeholder="Tracking number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receivedBy">Received By</Label>
            <Input
              id="receivedBy"
              value={formData.receivedBy}
              onChange={(e) => setFormData((prev) => ({ ...prev, receivedBy: e.target.value }))}
              placeholder="Person who received the delivery"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedDate">Expected Delivery Date</Label>
            <Input
              id="expectedDate"
              type="date"
              value={formData.expectedDeliveryDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, expectedDeliveryDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actualDate">Actual Delivery Date</Label>
            <Input
              id="actualDate"
              type="date"
              value={formData.actualDeliveryDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, actualDeliveryDate: e.target.value }))}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Items</Label>
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              <PlusIcon className="mr-1 size-3" />
              Add Item
            </Button>
          </div>

          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Description</TableHead>
                  <TableHead className="w-[10%]">SKU</TableHead>
                  <TableHead className="w-[8%]">Ordered</TableHead>
                  <TableHead className="w-[8%]">Delivered</TableHead>
                  <TableHead className="w-[8%]">Unit</TableHead>
                  <TableHead className="w-[10%]">Condition</TableHead>
                  <TableHead className="w-[20%]">Notes</TableHead>
                  <TableHead className="w-[5%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        placeholder="Item description"
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.sku}
                        onChange={(e) => handleItemChange(item.id, "sku", e.target.value)}
                        placeholder="SKU"
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value) || 0)}
                        min={0}
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.deliveredQuantity}
                        onChange={(e) => handleItemChange(item.id, "deliveredQuantity", Number(e.target.value) || 0)}
                        min={0}
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.unit}
                        onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.condition}
                        onValueChange={(val) => handleItemChange(item.id, "condition", val)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.notes ?? ""}
                        onChange={(e) => handleItemChange(item.id, "notes", e.target.value)}
                        placeholder="Notes"
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={formData.items.length === 1}
                      >
                        <Trash2Icon className="size-3 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="generalNotes">General Notes</Label>
          <Textarea
            id="generalNotes"
            value={formData.generalNotes}
            onChange={(e) => setFormData((prev) => ({ ...prev, generalNotes: e.target.value }))}
            placeholder="Additional notes or special instructions..."
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2 pt-4">
          <Button onClick={() => handleSubmit("submit")}>
            <SendIcon className="mr-1 size-3" />
            Submit
          </Button>
          <Button variant="outline" onClick={() => handleSubmit("draft")}>
            <SaveIcon className="mr-1 size-3" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={() => handleSubmit("print")}>
            <PrinterIcon className="mr-1 size-3" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { DeliveryNoteForm, type DeliveryNoteItem, type DeliveryNoteFormProps, type DeliveryNoteFormData }
