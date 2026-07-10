"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  DownloadIcon,
  SearchIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  PackageIcon,
  AlertTriangleIcon,
} from "lucide-react"

interface StockItem {
  id: string
  sku: string
  name: string
  category: string
  quantity: number
  minStock: number
  maxStock: number
  unitCost: number
  location: string
  lastUpdated: string
}

interface StockMovement {
  id: string
  date: string
  type: "in" | "out" | "adjustment" | "transfer"
  sku: string
  itemName: string
  quantity: number
  reference: string
  notes?: string
}

interface StockReportsProps {
  items?: StockItem[]
  movements?: StockMovement[]
  onExport?: (format: "csv" | "xlsx" | "pdf") => void
  className?: string
}

function StockSummaryCards({ items }: { items: StockItem[] }) {
  const totalItems = items.length
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
  const lowStockItems = items.filter((item) => item.quantity <= item.minStock)
  const overStockItems = items.filter((item) => item.quantity >= item.maxStock)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <PackageIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
              <TrendingUpIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-700">
              <AlertTriangleIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
              <TrendingDownIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overstocked</p>
              <p className="text-2xl font-bold text-orange-600">{overStockItems.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StockReports({
  items = [],
  movements = [],
  onExport,
  className,
}: StockReportsProps) {
  const [search, setSearch] = React.useState("")

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
  )

  const lowStockItems = items.filter((item) => item.quantity <= item.minStock)

  const movementTypeColors: Record<string, string> = {
    in: "text-green-700 bg-green-100",
    out: "text-red-700 bg-red-100",
    adjustment: "text-yellow-700 bg-yellow-100",
    transfer: "text-blue-700 bg-blue-100",
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Stock Reports</CardTitle>
          <div className="flex items-center gap-2">
            {onExport && (
              <>
                <Button variant="outline" size="sm" onClick={() => onExport("csv")}>
                  <DownloadIcon className="mr-1 size-3" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => onExport("xlsx")}>
                  <DownloadIcon className="mr-1 size-3" />
                  Excel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <StockSummaryCards items={items} />

        <div className="mt-6">
          <Tabs defaultValue="inventory">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
              <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="mt-4 space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 max-w-sm"
                />
              </div>

              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Min</TableHead>
                      <TableHead className="text-right">Max</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                          No items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item) => {
                        const isLow = item.quantity <= item.minStock
                        const isOver = item.quantity >= item.maxStock
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{item.minStock}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{item.maxStock}</TableCell>
                            <TableCell className="text-right">${item.unitCost.toFixed(2)}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>
                              {isLow ? (
                                <Badge className="text-[10px] bg-red-100 text-red-700">Low Stock</Badge>
                              ) : isOver ? (
                                <Badge className="text-[10px] bg-orange-100 text-orange-700">Overstocked</Badge>
                              ) : (
                                <Badge className="text-[10px] bg-green-100 text-green-700">Normal</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="movements" className="mt-4">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No movements recorded
                        </TableCell>
                      </TableRow>
                    ) : (
                      movements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="text-sm">{movement.date}</TableCell>
                          <TableCell>
                            <Badge className={cn("text-[10px] capitalize", movementTypeColors[movement.type])}>
                              {movement.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{movement.sku}</TableCell>
                          <TableCell>{movement.itemName}</TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-medium",
                              movement.type === "in" ? "text-green-600" : movement.type === "out" ? "text-red-600" : ""
                            )}
                          >
                            {movement.type === "in" ? "+" : movement.type === "out" ? "-" : ""}
                            {movement.quantity}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{movement.reference}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{movement.notes ?? "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="mt-4">
              {lowStockItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <PackageIcon className="mb-2 size-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No low stock alerts</p>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Current Qty</TableHead>
                        <TableHead className="text-right">Min Stock</TableHead>
                        <TableHead className="text-right">Deficit</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right text-red-600 font-medium">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">{item.minStock}</TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            {item.minStock - item.quantity}
                          </TableCell>
                          <TableCell>{item.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

export { StockReports, type StockItem, type StockMovement, type StockReportsProps }
