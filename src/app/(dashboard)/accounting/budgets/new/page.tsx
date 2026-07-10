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

interface BudgetLine {
  account: string
  amount: string
}

export default function NewBudgetPage() {
  const [lines, setLines] = useState<BudgetLine[]>([
    { account: "", amount: "" },
  ])

  const addLine = () => {
    setLines([...lines, { account: "", amount: "" }])
  }

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index))
    }
  }

  const total = lines.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0)

  return (
    <OverviewLayout
      title="New Budget"
      description="Create a new budget plan"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Budget Name</Label>
                <Input id="name" placeholder="e.g. Annual Budget 2024" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <option value="">Select department</option>
                  <option value="all">All Departments</option>
                  <option value="sales">Sales</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                  <option value="it">IT</option>
                  <option value="hr">Human Resources</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Budget Lines</CardTitle>
            <Button variant="outline" size="sm" onClick={addLine}>
              <Plus className="size-4" />
              Add Line
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lines.map((line, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end rounded-lg border p-4">
                  <div className="space-y-2">
                    <Label>Account</Label>
                    <Select>
                      <option value="">Select account</option>
                      <option value="5100">5100 - Salary Expense</option>
                      <option value="5200">5200 - Rent Expense</option>
                      <option value="5300">5300 - Utilities Expense</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Budget Amount</Label>
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
                <span className="text-sm text-muted-foreground">Total Budget: </span>
                <span className="text-lg font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/budgets" />}>
            Cancel
          </Button>
          <Button>Create Budget</Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
