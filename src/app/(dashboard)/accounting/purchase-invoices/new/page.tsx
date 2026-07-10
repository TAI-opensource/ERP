"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface InvoiceLine {
  item: string
  quantity: string
  rate: string
  amount: string
}

export default function NewPurchaseInvoicePage() {
  const [lines, setLines] = useState<InvoiceLine[]>([
    { item: "", quantity: "", rate: "", amount: "" },
  ])

  const addLine = () => {
    setLines([...lines, { item: "", quantity: "", rate: "", amount: "" }])
  }

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index))
    }
  }

  const total = lines.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0)

  return (
    <OverviewLayout
      title="New Purchase Invoice"
      description="Create a new purchase invoice from a supplier"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select>
                  <option value="">Select supplier</option>
                  <option value="alpha">Supplier Alpha</option>
                  <option value="parts">Parts Unlimited</option>
                  <option value="component">Component Co</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Invoice Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference</Label>
                <Input id="reference" placeholder="e.g. Purchase Order #123" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button variant="outline" size="sm" onClick={addLine}>
              <Plus className="size-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lines.map((line, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] items-end rounded-lg border p-4">
                  <div className="space-y-2">
                    <Label>Item</Label>
                    <Input placeholder="Select item" value={line.item} onChange={(e) => { const updated = [...lines]; updated[index].item = e.target.value; setLines(updated) }} />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="0" value={line.quantity} onChange={(e) => { const updated = [...lines]; updated[index].quantity = e.target.value; setLines(updated) }} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate</Label>
                    <Input type="number" placeholder="0.00" value={line.rate} onChange={(e) => { const updated = [...lines]; updated[index].rate = e.target.value; setLines(updated) }} />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="0.00" value={line.amount} onChange={(e) => { const updated = [...lines]; updated[index].amount = e.target.value; setLines(updated) }} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeLine(index)} disabled={lines.length <= 1}>
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <div className="rounded-lg bg-muted p-4">
                <span className="text-sm text-muted-foreground">Total: </span>
                <span className="text-lg font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/purchase-invoices" />}>
            Cancel
          </Button>
          <Button>Create Invoice</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
