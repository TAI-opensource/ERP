"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface JournalLine {
  account: string
  debit: string
  credit: string
  description: string
}

export default function NewJournalEntryPage() {
  const [lines, setLines] = useState<JournalLine[]>([
    { account: "", debit: "", credit: "", description: "" },
    { account: "", debit: "", credit: "", description: "" },
  ])

  const addLine = () => {
    setLines([...lines, { account: "", debit: "", credit: "", description: "" }])
  }

  const removeLine = (index: number) => {
    if (lines.length > 2) {
      setLines(lines.filter((_, i) => i !== index))
    }
  }

  const updateLine = (index: number, field: keyof JournalLine, value: string) => {
    const updated = [...lines]
    updated[index] = { ...updated[index], [field]: value }
    setLines(updated)
  }

  const totalDebit = lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0)
  const totalCredit = lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0)
  const isBalanced = totalDebit === totalCredit && totalDebit > 0

  return (
    <OverviewLayout
      title="New Journal Entry"
      description="Create a new journal entry with debit and credit lines"
      actionLabel="Save Entry"
      actionHref="/accounting/journal-entries"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Entry Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postingDate">Posting Date</Label>
                <Input id="postingDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference</Label>
                <Input id="reference" placeholder="e.g. INV-2024-001" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" placeholder="Entry description..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Journal Lines</CardTitle>
            <Button variant="outline" size="sm" onClick={addLine}>
              <Plus className="size-4" />
              Add Line
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lines.map((line, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_120px_120px_1fr_auto] items-end rounded-lg border p-4">
                  <div className="space-y-2">
                    <Label>Account</Label>
                    <Input
                      placeholder="Select account"
                      value={line.account}
                      onChange={(e) => updateLine(index, "account", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Debit</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={line.debit}
                      onChange={(e) => updateLine(index, "debit", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Credit</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={line.credit}
                      onChange={(e) => updateLine(index, "credit", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Line description"
                      value={line.description}
                      onChange={(e) => updateLine(index, "description", e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLine(index)}
                    disabled={lines.length <= 2}
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-8 rounded-lg bg-muted p-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Total Debit: </span>
                <span className="font-medium">${totalDebit.toFixed(2)}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Total Credit: </span>
                <span className="font-medium">${totalCredit.toFixed(2)}</span>
              </div>
              <div className="text-sm">
                {isBalanced ? (
                  <span className="font-medium text-emerald-500">Balanced</span>
                ) : (
                  <span className="font-medium text-red-500">Out of Balance</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<a href="/accounting/journal-entries" />}>
            Cancel
          </Button>
          <Button disabled={!isBalanced}>
            Submit Entry
          </Button>
        </div>
      </div>
    </OverviewLayout>
  )
}
