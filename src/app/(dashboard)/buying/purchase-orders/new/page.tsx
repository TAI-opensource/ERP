"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface POItem {
  item: string
  description: string
  qty: string
  rate: string
  amount: string
}

export default function NewPurchaseOrderPage() {
  const [items, setItems] = useState<POItem[]>([
    { item: "", description: "", qty: "1", rate: "", amount: "" },
  ])

  const addItem = () => {
    setItems([...items, { item: "", description: "", qty: "1", rate: "", amount: "" }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof POItem, value: string) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    if (field === "qty" || field === "rate") {
      const qty = parseFloat(updated[index].qty) || 0
      const rate = parseFloat(updated[index].rate) || 0
      updated[index].amount = (qty * rate).toFixed(2)
    }
    setItems(updated)
  }

  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)

  return (
    <OverviewLayout
      title="New Purchase Order"
      description="Create a new purchase order"
      actionLabel="Save PO"
      actionHref="/buying/purchase-orders"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Select supplier" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderDate">Order Date</Label>
                <Input id="orderDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requiredDate">Required By</Label>
                <Input id="requiredDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input id="paymentTerms" placeholder="e.g. Net 30" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="shippingAddress">Delivery Address</Label>
                <Textarea id="shippingAddress" placeholder="Delivery address..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order Items</CardTitle>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="size-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[2fr_2fr_100px_120px_120px_auto] items-end rounded-lg border p-4">
                  <div className="space-y-2">
                    <Label>Item</Label>
                    <Input
                      placeholder="Select item"
                      value={item.item}
                      onChange={(e) => updateItem(index, "item", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateItem(index, "qty", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.rate}
                      onChange={(e) => updateItem(index, "rate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      value={`$${parseFloat(item.amount || "0").toFixed(2)}`}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <div className="rounded-lg bg-muted p-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total: </span>
                  <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<a href="/buying/purchase-orders" />}>
            Cancel
          </Button>
          <Button>Submit Purchase Order</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
