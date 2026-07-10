"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const customer = {
  id: "CUST-001",
  name: "Acme Corp",
  contact: "John Smith",
  email: "john@acme.com",
  phone: "+1 555-0101",
  address: "123 Business Ave, New York, NY 10001",
  taxId: "US-TAX-12345",
  currency: "USD",
  creditLimit: "$50,000",
  outstanding: "$12,500",
  totalOrders: 45,
  totalRevenue: "$234,000",
  status: "Active",
}

const recentOrders = [
  { id: "SO-2024-001", date: "2024-01-15", amount: "$12,500", status: "Confirmed" },
  { id: "SO-2024-008", date: "2024-01-10", amount: "$9,100", status: "Delivered" },
  { id: "SO-2024-005", date: "2024-01-05", amount: "$15,800", status: "Shipped" },
]

const recentInvoices = [
  { id: "INV-2024-001", date: "2024-01-15", amount: "$12,500", status: "Paid" },
  { id: "INV-2024-008", date: "2024-01-10", amount: "$9,100", status: "Unpaid" },
  { id: "INV-2024-005", date: "2024-01-05", amount: "$15,800", status: "Paid" },
]

export default function CustomerDetailPage() {
  return (
    <OverviewLayout
      title={customer.name}
      description={`${customer.id} • ${customer.contact}`}
      actionLabel="Edit Customer"
      actionHref={`/selling/customers/${customer.id}/edit`}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.outstanding}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Credit Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.creditLimit}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.totalRevenue}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-medium">Contact Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact Person</span>
                    <span>{customer.contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="text-right">{customer.address}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Account Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ID</span>
                    <span>{customer.taxId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Currency</span>
                    <span>{customer.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge>{customer.status}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {recentOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{o.amount}</p>
                        <Badge variant={o.status === "Delivered" ? "default" : "secondary"}>{o.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="invoices">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {recentInvoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{inv.id}</p>
                        <p className="text-xs text-muted-foreground">{inv.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{inv.amount}</p>
                        <Badge variant={inv.status === "Paid" ? "default" : "destructive"}>{inv.status}</Badge>
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
