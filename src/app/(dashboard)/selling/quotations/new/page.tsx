"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface QuotationItem {
  item: string
  description: string
  qty: string
  rate: string
  amount: string
}

export default function NewQuotationPage() {
  const [items, setItems] = useState<QuotationItem[]>([
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

  const updateItem = (index: number, field: keyof QuotationItem, value: string) => {
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
      title="New Quotation"
      description="Create a new sales quotation"
      actionLabel="Save Quotation"
      actionHref="/selling/quotations"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quotation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Input id="customer" placeholder="Select customer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input id="validUntil" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="USD" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea id="terms" placeholder="Payment terms, delivery terms..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Items</CardTitle>
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
          <Button variant="outline" render={<a href="/selling/quotations" />}>
            Cancel
          </Button>
          <Button>Submit Quotation</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
