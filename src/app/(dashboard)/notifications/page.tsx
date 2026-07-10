"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  BellOff,
  Info,
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  AtSign,
  Settings,
  Mail,
  Smartphone,
  MessageSquare,
  Monitor,
  Check,
  X,
  Clock,
  Filter,
  Download,
  Search,
  Trash2,
} from "lucide-react"

type NotificationType = "info" | "warning" | "success" | "error" | "mention" | "system"

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: Date
  read: boolean
  category: "all" | "unread" | "mentions" | "system"
}

interface HistoryEntry {
  id: string
  type: NotificationType
  title: string
  channel: string
  date: string
  status: "delivered" | "failed"
}

const now = new Date()

function hoursAgo(h: number): Date {
  return new Date(now.getTime() - h * 60 * 60 * 1000)
}

function daysAgo(d: number): Date {
  return new Date(now.getTime() - d * 24 * 60 * 60 * 1000)
}

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "info",
    title: "New feature available",
    description: "Dashboard analytics have been updated with new filtering options.",
    timestamp: hoursAgo(1),
    read: false,
    category: "all",
  },
  {
    id: "n2",
    type: "warning",
    title: "Low stock alert",
    description: "Widget Alpha stock is below minimum threshold (12 units remaining).",
    timestamp: hoursAgo(3),
    read: false,
    category: "all",
  },
  {
    id: "n3",
    type: "mention",
    title: "Alice mentioned you",
    description: "@you Please review the updated sales report for Q4.",
    timestamp: hoursAgo(5),
    read: false,
    category: "mentions",
  },
  {
    id: "n4",
    type: "success",
    title: "Invoice paid",
    description: "Invoice #INV-2024-0042 has been paid by Acme Corp.",
    timestamp: hoursAgo(8),
    read: true,
    category: "all",
  },
  {
    id: "n5",
    type: "error",
    title: "Payment failed",
    description: "Payment for PO #PO-2024-0089 was declined. Please update payment method.",
    timestamp: daysAgo(1),
    read: false,
    category: "all",
  },
  {
    id: "n6",
    type: "system",
    title: "Scheduled maintenance",
    description: "System maintenance is scheduled for Saturday 2:00 AM - 4:00 AM UTC.",
    timestamp: daysAgo(1),
    read: true,
    category: "system",
  },
  {
    id: "n7",
    type: "info",
    title: "Team member joined",
    description: "Carol Davis has joined the Engineering team.",
    timestamp: daysAgo(2),
    read: true,
    category: "all",
  },
  {
    id: "n8",
    type: "mention",
    title: "Bob mentioned you",
    description: "@you Can you check the purchase order #PO-0091?",
    timestamp: daysAgo(2),
    read: true,
    category: "mentions",
  },
  {
    id: "n9",
    type: "warning",
    title: "Approaching storage limit",
    description: "Your storage usage is at 85%. Consider archiving old data.",
    timestamp: daysAgo(3),
    read: true,
    category: "all",
  },
  {
    id: "n10",
    type: "success",
    title: "Export completed",
    description: "Your inventory report has been generated and is ready for download.",
    timestamp: daysAgo(4),
    read: true,
    category: "all",
  },
  {
    id: "n11",
    type: "system",
    title: "Version update",
    description: "System has been updated to v3.2.1 with performance improvements.",
    timestamp: daysAgo(5),
    read: true,
    category: "system",
  },
  {
    id: "n12",
    type: "info",
    title: "New integration available",
    description: "QuickBooks integration is now available in the marketplace.",
    timestamp: daysAgo(8),
    read: true,
    category: "all",
  },
]

const historyData: HistoryEntry[] = [
  { id: "h1", type: "info", title: "New feature available", channel: "In-App", date: "2024-01-15 10:30", status: "delivered" },
  { id: "h2", type: "warning", title: "Low stock alert", channel: "Email", date: "2024-01-15 08:15", status: "delivered" },
  { id: "h3", type: "mention", title: "Alice mentioned you", channel: "Push", date: "2024-01-15 06:00", status: "delivered" },
  { id: "h4", type: "success", title: "Invoice paid", channel: "Email", date: "2024-01-14 17:45", status: "delivered" },
  { id: "h5", type: "error", title: "Payment failed", channel: "SMS", date: "2024-01-14 14:20", status: "failed" },
  { id: "h6", type: "system", title: "Scheduled maintenance", channel: "In-App", date: "2024-01-14 10:00", status: "delivered" },
  { id: "h7", type: "info", title: "Team member joined", channel: "Push", date: "2024-01-13 09:30", status: "delivered" },
  { id: "h8", type: "warning", title: "Approaching storage limit", channel: "Email", date: "2024-01-12 16:00", status: "failed" },
  { id: "h9", type: "success", title: "Export completed", channel: "In-App", date: "2024-01-11 11:20", status: "delivered" },
  { id: "h10", type: "system", title: "Version update", channel: "Email", date: "2024-01-10 08:00", status: "delivered" },
]

const typeIconMap: Record<NotificationType, React.ReactNode> = {
  info: <Info className="size-4 text-blue-500" />,
  warning: <AlertTriangle className="size-4 text-yellow-500" />,
  success: <CheckCircle className="size-4 text-emerald-500" />,
  error: <AlertOctagon className="size-4 text-red-500" />,
  mention: <AtSign className="size-4 text-purple-500" />,
  system: <Settings className="size-4 text-muted-foreground" />,
}

const channelIconMap: Record<string, React.ReactNode> = {
  Email: <Mail className="size-4" />,
  Push: <Bell className="size-4" />,
  "In-App": <Monitor className="size-4" />,
  SMS: <Smartphone className="size-4" />,
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

function getDateGroup(date: Date): string {
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days <= 7) return "This Week"
  return "Earlier"
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [historySearch, setHistorySearch] = useState("")
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [inAppEnabled, setInAppEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [billingUpdates, setBillingUpdates] = useState(true)
  const [productUpdates, setProductUpdates] = useState(false)
  const [teamActivity, setTeamActivity] = useState(true)
  const [systemMaintenance, setSystemMaintenance] = useState(true)
  const [marketing, setMarketing] = useState(false)
  const [quietStart, setQuietStart] = useState("22:00")
  const [quietEnd, setQuietEnd] = useState("07:00")
  const [preferencesSaved, setPreferencesSaved] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read
    if (filter === "mentions") return n.type === "mention"
    if (filter === "system") return n.type === "system"
    return true
  })

  const groupedNotifications: Record<string, Notification[]> = {}
  for (const n of filteredNotifications) {
    const group = getDateGroup(n.timestamp)
    if (!groupedNotifications[group]) groupedNotifications[group] = []
    groupedNotifications[group].push(n)
  }
  const groupOrder = ["Today", "Yesterday", "This Week", "Earlier"]
  const sortedGroups = groupOrder.filter((g) => groupedNotifications[g]?.length)

  const filteredHistory = historyData.filter(
    (h) =>
      h.title.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.channel.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.type.toLowerCase().includes(historySearch.toLowerCase())
  )

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function dismissNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  function handleSavePreferences() {
    setPreferencesSaved(true)
    setTimeout(() => setPreferencesSaved(false), 2000)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Bell className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You\u2019re all caught up"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-2.5 py-0.5">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="size-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications">
        <TabsList>
          <TabsTrigger value="notifications">
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings className="size-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="size-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-4">
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
              <SelectTrigger size="sm">
                <Filter className="size-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="mentions">Mentions</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-64 pl-8"
              />
            </div>
          </div>

          <Card className="mt-4">
            <CardContent className="p-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <BellOff className="size-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-sm font-medium">No notifications</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {filter === "all"
                      ? "You\u2019re all caught up. No new notifications."
                      : `No ${filter} notifications to show.`}
                  </p>
                </div>
              ) : (
                <ScrollArea className="max-h-[600px]">
                  {sortedGroups.map((group) => (
                    <div key={group}>
                      <div className="sticky top-0 z-10 border-b bg-muted/50 px-4 py-2">
                        <span className="text-xs font-medium text-muted-foreground">{group}</span>
                      </div>
                      {groupedNotifications[group]!.map((n) => (
                        <div
                          key={n.id}
                          className={`group flex items-start gap-3 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/50 ${
                            !n.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                          }`}
                        >
                          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                            {typeIconMap[n.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>
                                {n.title}
                              </p>
                              {!n.read && (
                                <span className="size-2 shrink-0 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                              {n.description}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">{timeAgo(n.timestamp)}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => markAsRead(n.id)}
                              disabled={n.read}
                              title="Mark as read"
                            >
                              <Check className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => dismissNotification(n.id)}
                              title="Dismiss"
                            >
                              <X className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="size-4" />
                  Notification Channels
                </CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Push notifications</p>
                      <p className="text-xs text-muted-foreground">Receive push notifications on your devices</p>
                    </div>
                  </div>
                  <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Monitor className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">In-app notifications</p>
                      <p className="text-xs text-muted-foreground">Show notifications within the application</p>
                    </div>
                  </div>
                  <Switch checked={inAppEnabled} onCheckedChange={setInAppEnabled} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">SMS notifications</p>
                      <p className="text-xs text-muted-foreground">Receive text message notifications</p>
                    </div>
                  </div>
                  <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="size-4" />
                  Notification Categories
                </CardTitle>
                <CardDescription>Select which categories to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Security alerts</p>
                      <p className="text-xs text-muted-foreground">Login attempts and security events</p>
                    </div>
                  </div>
                  <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Info className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Billing updates</p>
                      <p className="text-xs text-muted-foreground">Invoices, payments, and billing changes</p>
                    </div>
                  </div>
                  <Switch checked={billingUpdates} onCheckedChange={setBillingUpdates} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Product updates</p>
                      <p className="text-xs text-muted-foreground">New features and improvements</p>
                    </div>
                  </div>
                  <Switch checked={productUpdates} onCheckedChange={setProductUpdates} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AtSign className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Team activity</p>
                      <p className="text-xs text-muted-foreground">Mentions, comments, and team updates</p>
                    </div>
                  </div>
                  <Switch checked={teamActivity} onCheckedChange={setTeamActivity} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">System maintenance</p>
                      <p className="text-xs text-muted-foreground">Scheduled downtime and maintenance</p>
                    </div>
                  </div>
                  <Switch checked={systemMaintenance} onCheckedChange={setSystemMaintenance} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Marketing</p>
                      <p className="text-xs text-muted-foreground">Promotions and product announcements</p>
                    </div>
                  </div>
                  <Switch checked={marketing} onCheckedChange={setMarketing} />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="size-4" />
                  Quiet Hours
                </CardTitle>
                <CardDescription>
                  Set a time range when notifications will be silenced
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">From</label>
                    <Input
                      type="time"
                      value={quietStart}
                      onChange={(e) => setQuietStart(e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">To</label>
                    <Input
                      type="time"
                      value={quietEnd}
                      onChange={(e) => setQuietEnd(e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Button onClick={handleSavePreferences}>
              {preferencesSaved ? (
                <>
                  <Check className="size-4" />
                  Saved
                </>
              ) : (
                "Save preferences"
              )}
            </Button>
            {preferencesSaved && (
              <span className="text-sm text-muted-foreground">Preferences saved successfully.</span>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Notification History</CardTitle>
                  <CardDescription>View past notifications and their delivery status</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="size-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search history..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="h-8 pl-8"
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No history found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell>{typeIconMap[h.type]}</TableCell>
                        <TableCell className="font-medium">{h.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {channelIconMap[h.channel]}
                            <span>{h.channel}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{h.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={h.status === "delivered" ? "secondary" : "destructive"}
                          >
                            {h.status === "delivered" ? (
                              <CheckCircle className="size-3" />
                            ) : (
                              <AlertOctagon className="size-3" />
                            )}
                            {h.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
