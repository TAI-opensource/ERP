"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const item = {
  sku: "WGT-001",
  name: "Widget Alpha",
  category: "Electronics",
  description: "High-quality electronic widget for industrial applications",
  unit: "Piece",
  weight: "0.5 kg",
  dimensions: "10x5x3 cm",
  price: "$25.00",
  cost: "$15.00",
  margin: "40%",
  stock: 150,
  reservedStock: 12,
  availableStock: 138,
  warehouse: "Warehouse A",
  reorderLevel: 50,
  reorderQty: 200,
  status: "Active",
}

const stockHistory = [
  { date: "2024-01-15", type: "Sales Invoice", reference: "INV-2024-001", qty: -10, balance: 150 },
  { date: "2024-01-14", type: "Stock Receipt", reference: "PO-2024-002", qty: 100, balance: 160 },
  { date: "2024-01-13", type: "Sales Invoice", reference: "INV-2024-003", qty: -25, balance: 60 },
  { date: "2024-01-12", type: "Stock Adjustment", reference: "ADJ-001", qty: -5, balance: 85 },
  { date: "2024-01-11", type: "Sales Invoice", reference: "INV-2024-005", qty: -15, balance: 90 },
]

const purchaseHistory = [
  { date: "2024-01-14", supplier: "Parts Unlimited", po: "PO-2024-002", qty: 100, price: "$15.00", total: "$1,500" },
  { date: "2024-01-05", supplier: "Supplier Alpha", po: "PO-2024-008", qty: 200, price: "$14.50", total: "$2,900" },
  { date: "2023-12-20", supplier: "Parts Unlimited", po: "PO-2023-045", qty: 150, price: "$15.00", total: "$2,250" },
]

export default function ItemDetailPage() {
  return (
    <OverviewLayout
      title={item.name}
      description={`${item.sku} • ${item.category}`}
      actionLabel="Edit Item"
      actionHref={`/stock/items/${item.sku}/edit`}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Current Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.stock}</div>
              <p className="text-xs text-muted-foreground">units</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Available Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.availableStock}</div>
              <p className="text-xs text-muted-foreground">{item.reservedStock} reserved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Unit Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.price}</div>
              <p className="text-xs text-muted-foreground">Cost: {item.cost}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Reorder Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.reorderLevel}</div>
              <p className="text-xs text-muted-foreground">Reorder qty: {item.reorderQty}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-medium">Item Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU</span>
                    <span>{item.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unit</span>
                    <span>{item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span>{item.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions</span>
                    <span>{item.dimensions}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Warehouse Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warehouse</span>
                    <span>{item.warehouse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge>{item.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Margin</span>
                    <span>{item.margin}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="stock-history">
          <TabsList>
            <TabsTrigger value="stock-history">Stock History</TabsTrigger>
            <TabsTrigger value="purchase-history">Purchase History</TabsTrigger>
          </TabsList>
          <TabsContent value="stock-history">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {stockHistory.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{entry.type}</p>
                        <p className="text-xs text-muted-foreground">{entry.date} • {entry.reference}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${entry.qty > 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {entry.qty > 0 ? "+" : ""}{entry.qty}
                        </p>
                        <p className="text-xs text-muted-foreground">Balance: {entry.balance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="purchase-history">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {purchaseHistory.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{entry.supplier}</p>
                        <p className="text-xs text-muted-foreground">{entry.date} • {entry.po}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{entry.qty} units @ {entry.price}</p>
                        <p className="text-xs text-muted-foreground">{entry.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </OverviewLayout>
  )
}
