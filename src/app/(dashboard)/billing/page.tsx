"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Download,
  Plus,
  Trash2,
  Edit,
  Check,
  AlertCircle,
  Calendar,
  Receipt,
  RefreshCw,
  MoreVertical,
} from "lucide-react"

const planFeatures = [
  "Up to 10,000 API calls / month",
  "5 team members",
  "10 GB storage",
  "Email support",
  "Basic analytics",
  "Webhook integrations",
]

const paymentMethods = [
  {
    id: 1,
    brand: "Visa",
    last4: "4242",
    expiry: "12/26",
    name: "John Doe",
    isDefault: true,
  },
  {
    id: 2,
    brand: "Mastercard",
    last4: "8888",
    expiry: "03/27",
    name: "John Doe",
    isDefault: false,
  },
]

const invoices = [
  { id: "INV-2026-041", date: "Jul 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-040", date: "Jun 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-039", date: "May 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-038", date: "Apr 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-037", date: "Mar 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-036", date: "Feb 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-035", date: "Jan 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-034", date: "Dec 1, 2025", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-033", date: "Nov 1, 2025", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-032", date: "Oct 1, 2025", amount: "$39.00", status: "Paid" },
]

const subscriptions = [
  {
    id: 1,
    name: "Pro Plan",
    amount: "$49.00",
    cycle: "Monthly",
    nextCharge: "Aug 1, 2026",
    status: "Active",
  },
  {
    id: 2,
    name: "API Add-on (5k calls)",
    amount: "$19.00",
    cycle: "Monthly",
    nextCharge: "Aug 1, 2026",
    status: "Active",
  },
  {
    id: 3,
    name: "Extra Storage (25 GB)",
    amount: "$9.00",
    cycle: "Monthly",
    nextCharge: "Aug 1, 2026",
    status: "Active",
  },
]

function BrandIcon({ brand }: { brand: string }) {
  if (brand === "Visa") {
    return (
      <svg viewBox="0 0 48 32" className="h-8 w-auto" aria-label="Visa">
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="12"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          VISA
        </text>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-auto" aria-label="Mastercard">
      <rect width="48" height="32" rx="4" fill="#252525" />
      <circle cx="19" cy="16" r="8" fill="#EB001B" />
      <circle cx="29" cy="16" r="8" fill="#F79E1B" />
      <path
        d="M24 10.5a8 8 0 0 1 0 11"
        fill="#FF5F00"
      />
    </svg>
  )
}

export default function BillingPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const invoicesPerPage = 5

  const filteredInvoices =
    statusFilter === "all"
      ? invoices
      : invoices.filter((inv) => inv.status.toLowerCase() === statusFilter)

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage)
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * invoicesPerPage,
    currentPage * invoicesPerPage
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your plan, payment methods, and invoices.
        </p>
      </div>

      <Tabs defaultValue="plan">
        <TabsList variant="line">
          <TabsTrigger value="plan">Current Plan</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        {/* Current Plan Tab */}
        <TabsContent value="plan">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Pro Plan
                      <Badge variant="secondary">Active</Badge>
                    </CardTitle>
                    <CardDescription>
                      Monthly billing • Renews August 1, 2026
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">$49</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Plan includes</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {planFeatures.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">API Usage — July 2026</span>
                    <span className="text-muted-foreground">2,450 / 10,000</span>
                  </div>
                  <Progress value={24.5}>
                    <ProgressLabel className="sr-only">API usage</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                  <p className="text-xs text-muted-foreground">
                    2,450 of 10,000 API calls used this billing cycle (24.5%)
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Storage</span>
                    <span className="text-muted-foreground">4.2 / 10 GB</span>
                  </div>
                  <Progress value={42}>
                    <ProgressLabel className="sr-only">Storage usage</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                  <p className="text-xs text-muted-foreground">
                    4.2 GB of 10 GB used (42%)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button>Change Plan</Button>
                <Button variant="outline">Cancel Plan</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">Pro</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base price</span>
                  <span className="font-medium">$49.00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Add-ons</span>
                  <span className="font-medium">$28.00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium text-emerald-600">-$0.00</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">$77.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Next billing date: August 1, 2026
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">
                  <RefreshCw className="size-4 mr-2" />
                  Refresh usage
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Saved Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your credit and debit cards.
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="size-4 mr-2" />
                    Add Card
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <BrandIcon brand={method.brand} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {method.brand} ending in {method.last4}
                          </p>
                          {method.isDefault && <Badge>Default</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Expires {method.expiry} • {method.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Payment Method</CardTitle>
                <CardDescription>Enter your card details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input id="card-name" placeholder="John Doe" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Billing Address</Label>
                  <Input placeholder="Address line 1" className="mb-2" />
                  <Input placeholder="Address line 2" className="mb-2" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="City" />
                    <Input placeholder="State / Province" />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <Input placeholder="Country" />
                    <Input placeholder="ZIP / Postal code" />
                  </div>
                </div>

                <Button className="w-full">
                  <Plus className="size-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="size-5" />
                    Invoice History
                  </CardTitle>
                  <CardDescription>
                    View and download your past invoices.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <button className="text-sm font-medium text-primary hover:underline">
                          {invoice.id}
                        </button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {invoice.date}
                      </TableCell>
                      <TableCell className="font-medium">
                        {invoice.amount}
                      </TableCell>
                      <TableCell>
                        {invoice.status === "Paid" && (
                          <Badge variant="secondary">
                            <Check className="size-3 mr-1" />
                            Paid
                          </Badge>
                        )}
                        {invoice.status === "Pending" && (
                          <Badge>
                            <Calendar className="size-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        {invoice.status === "Overdue" && (
                          <Badge variant="destructive">
                            <AlertCircle className="size-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="size-8">
                          <Download className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        No invoices found for the selected filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * invoicesPerPage + 1}–
                    {Math.min(currentPage * invoicesPerPage, filteredInvoices.length)} of{" "}
                    {filteredInvoices.length} invoices
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          className="size-8 p-0"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Subscriptions</CardTitle>
                  <CardDescription>
                    Manage your active subscriptions and add-ons.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="size-4 mr-2" />
                  Browse Add-ons
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <CreditCard className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{sub.name}</p>
                          <Badge variant="secondary">{sub.status}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{sub.amount}/{sub.cycle === "Monthly" ? "mo" : "yr"}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            Next charge: {sub.nextCharge}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="size-3.5 mr-1.5" />
                        Manage
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="size-3.5 mr-1.5" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Total monthly: <span className="font-medium text-foreground">$77.00</span>
              </p>
              <Button variant="outline" size="sm">
                <MoreVertical className="size-4 mr-1" />
                Subscription settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
