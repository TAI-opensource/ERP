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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, Trash2Icon, SaveIcon, SendIcon } from "lucide-react"

interface MaterialRequestItem {
  id: string
  description: string
  quantity: number
  unit: string
  estimatedCost: number
  urgency: "low" | "medium" | "high"
  notes?: string
}

interface MaterialRequestFormProps {
  onSubmit?: (data: {
    requestor: string
    department: string
    project: string
    justification: string
    items: MaterialRequestItem[]
  }) => void
  onSaveDraft?: (data: Record<string, unknown>) => void
  className?: string
  initialData?: Partial<{
    requestor: string
    department: string
    project: string
    justification: string
    items: MaterialRequestItem[]
  }>
}

const units = ["Unit", "Kg", "L", "m", "m²", "m³", "Box", "Pack", "Set"]
const urgencyOptions = [
  { value: "low", label: "Low", color: "text-gray-700 bg-gray-100" },
  { value: "medium", label: "Medium", color: "text-yellow-700 bg-yellow-100" },
  { value: "high", label: "High", color: "text-red-700 bg-red-100" },
]

function MaterialRequestForm({
  onSubmit,
  onSaveDraft,
  className,
  initialData,
}: MaterialRequestFormProps) {
  const [requestor, setRequestor] = React.useState(initialData?.requestor ?? "")
  const [department, setDepartment] = React.useState(initialData?.department ?? "")
  const [project, setProject] = React.useState(initialData?.project ?? "")
  const [justification, setJustification] = React.useState(initialData?.justification ?? "")
  const [items, setItems] = React.useState<MaterialRequestItem[]>(
    initialData?.items ?? [
      {
        id: "1",
        description: "",
        quantity: 1,
        unit: "Unit",
        estimatedCost: 0,
        urgency: "medium",
      },
    ]
  )

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unit: "Unit",
        estimatedCost: 0,
        urgency: "medium",
      },
    ])
  }

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleItemChange = (id: string, field: keyof MaterialRequestItem, value: unknown) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const totalCost = items.reduce((sum, item) => sum + item.estimatedCost * item.quantity, 0)

  const handleSubmit = (asDraft: boolean) => {
    const data = {
      requestor,
      department,
      project,
      justification,
      items,
    }
    if (asDraft) {
      onSaveDraft?.(data)
    } else {
      onSubmit?.(data)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Material Request</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="requestor">Requestor *</Label>
            <Input
              id="requestor"
              value={requestor}
              onChange={(e) => setRequestor(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="ops">Operations</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Input
              id="project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="Project name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="justification">Justification *</Label>
          <Textarea
            id="justification"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Describe why these materials are needed..."
            rows={3}
          />
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

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Description</TableHead>
                  <TableHead className="w-[10%]">Qty</TableHead>
                  <TableHead className="w-[10%]">Unit</TableHead>
                  <TableHead className="w-[15%]">Est. Cost</TableHead>
                  <TableHead className="w-[10%]">Total</TableHead>
                  <TableHead className="w-[10%]">Urgency</TableHead>
                  <TableHead className="w-[15%]">Notes</TableHead>
                  <TableHead className="w-[5%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
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
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value) || 0)}
                        min={1}
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.unit}
                        onValueChange={(val) => handleItemChange(item.id, "unit", val)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((u) => (
                            <SelectItem key={u} value={u}>
                              {u}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.estimatedCost}
                        onChange={(e) => handleItemChange(item.id, "estimatedCost", Number(e.target.value) || 0)}
                        min={0}
                        step={0.01}
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      ${(item.estimatedCost * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.urgency}
                        onValueChange={(val) => handleItemChange(item.id, "urgency", val)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
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
                        disabled={items.length === 1}
                      >
                        <Trash2Icon className="size-3 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Estimated Total</p>
              <p className="text-xl font-bold">${totalCost.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <Button onClick={() => handleSubmit(false)}>
            <SendIcon className="mr-1 size-3" />
            Submit Request
          </Button>
          <Button variant="outline" onClick={() => handleSubmit(true)}>
            <SaveIcon className="mr-1 size-3" />
            Save Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { MaterialRequestForm, type MaterialRequestItem, type MaterialRequestFormProps }
