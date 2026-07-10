"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  UsersIcon,
  BarChart3Icon,
} from "lucide-react"

interface SalesData {
  period: string
  revenue: number
  orders: number
  averageOrderValue: number
  customers: number
  growth?: number
}

interface TopProduct {
  id: string
  name: string
  sku: string
  quantitySold: number
  revenue: number
  margin: number
}

interface SalesByChannel {
  channel: string
  revenue: number
  orders: number
  percentage: number
}

interface SalesReportsProps {
  summary?: SalesData
  topProducts?: TopProduct[]
  salesByChannel?: SalesByChannel[]
  recentOrders?: {
    id: string
    customer: string
    date: string
    total: number
    status: string
  }[]
  onExport?: (format: "csv" | "xlsx" | "pdf") => void
  className?: string
}

function SummaryCard({
  title,
  value,
  change,
  icon,
  prefix = "",
}: {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  prefix?: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">
                {prefix}
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
              {change !== undefined && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    change >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {change >= 0 ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {change >= 0 ? "+" : ""}
                  {change}%
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SalesReports({
  summary,
  topProducts = [],
  salesByChannel = [],
  recentOrders = [],
  onExport,
  className,
}: SalesReportsProps) {
  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-orange-100 text-orange-700",
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Sales Reports</CardTitle>
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
                <Button variant="outline" size="sm" onClick={() => onExport("pdf")}>
                  <DownloadIcon className="mr-1 size-3" />
                  PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              title="Revenue"
              value={summary.revenue}
              change={summary.growth}
              icon={<DollarSignIcon className="size-5" />}
              prefix="$"
            />
            <SummaryCard
              title="Orders"
              value={summary.orders}
              icon={<ShoppingCartIcon className="size-5" />}
            />
            <SummaryCard
              title="Avg. Order Value"
              value={summary.averageOrderValue.toFixed(2)}
              icon={<BarChart3Icon className="size-5" />}
              prefix="$"
            />
            <SummaryCard
              title="Customers"
              value={summary.customers}
              icon={<UsersIcon className="size-5" />}
            />
          </div>
        )}

        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="channels">Sales by Channel</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Qty Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No product data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    topProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                        <TableCell className="text-right">{product.quantitySold}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${product.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={cn(
                              "text-[10px]",
                              product.margin >= 30
                                ? "bg-green-100 text-green-700"
                                : product.margin >= 15
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            )}
                          >
                            {product.margin.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Share</TableHead>
                    <TableHead className="w-[200px]">Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesByChannel.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No channel data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    salesByChannel.map((channel) => (
                      <TableRow key={channel.channel}>
                        <TableCell className="font-medium">{channel.channel}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${channel.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">{channel.orders}</TableCell>
                        <TableCell className="text-right">{channel.percentage.toFixed(1)}%</TableCell>
                        <TableCell>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${channel.percentage}%` }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No recent orders
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-[10px] capitalize",
                              statusColors[order.status] ?? "bg-gray-100 text-gray-700"
                            )}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export { SalesReports, type SalesData, type TopProduct, type SalesByChannel, type SalesReportsProps }
