"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  StarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DownloadIcon,
  PrinterIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  DollarSignIcon,
  PackageIcon,
  FileTextIcon,
} from "lucide-react"

interface ScorecardMetric {
  id: string
  name: string
  score: number
  maxScore: number
  weight: number
  status: "excellent" | "good" | "average" | "poor"
  trend: "up" | "down" | "stable"
  details?: string
}

interface SupplierEvent {
  id: string
  date: string
  type: "delivery" | "quality" | "payment" | "communication" | "issue"
  description: string
  impact: "positive" | "negative" | "neutral"
  score?: number
}

interface SupplierDocument {
  id: string
  name: string
  type: string
  uploadDate: string
  expiryDate?: string
  status: "valid" | "expired" | "pending"
}

interface SupplierScorecardDetailProps {
  supplierName: string
  supplierCode: string
  overallScore: number
  grade: string
  metrics: ScorecardMetric[]
  events: SupplierEvent[]
  documents: SupplierDocument[]
  contactInfo?: {
    name: string
    email: string
    phone: string
    address: string
  }
  contractInfo?: {
    startDate: string
    endDate: string
    value: number
    paymentTerms: string
  }
  onExport?: (format: "pdf" | "xlsx") => void
  onPrint?: () => void
  className?: string
}

const gradeColors: Record<string, { color: string; bgColor: string }> = {
  A: { color: "text-green-700", bgColor: "bg-green-100" },
  B: { color: "text-blue-700", bgColor: "bg-blue-100" },
  C: { color: "text-yellow-700", bgColor: "bg-yellow-100" },
  D: { color: "text-orange-700", bgColor: "bg-orange-100" },
  F: { color: "text-red-700", bgColor: "bg-red-100" },
}

const statusIcons: Record<string, React.ReactNode> = {
  excellent: <CheckCircleIcon className="size-4 text-green-500" />,
  good: <CheckCircleIcon className="size-4 text-blue-500" />,
  average: <AlertTriangleIcon className="size-4 text-yellow-500" />,
  poor: <XCircleIcon className="size-4 text-red-500" />,
}

function ScoreCard({
  metric,
}: {
  metric: ScorecardMetric
}) {
  const percentage = (metric.score / metric.maxScore) * 100

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">{metric.name}</h4>
          <div className="flex items-center gap-2">
            {statusIcons[metric.status]}
            {metric.trend === "up" && <TrendingUpIcon className="size-3 text-green-500" />}
            {metric.trend === "down" && <TrendingDownIcon className="size-3 text-red-500" />}
          </div>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-2xl font-bold">{metric.score}</span>
          <span className="text-sm text-muted-foreground">/ {metric.maxScore}</span>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Weight: {(metric.weight * 100).toFixed(0)}%</span>
          <Badge
            className={cn(
              "text-[10px] capitalize",
              metric.status === "excellent" && "bg-green-100 text-green-700",
              metric.status === "good" && "bg-blue-100 text-blue-700",
              metric.status === "average" && "bg-yellow-100 text-yellow-700",
              metric.status === "poor" && "bg-red-100 text-red-700"
            )}
          >
            {metric.status}
          </Badge>
        </div>
        {metric.details && (
          <p className="mt-2 text-xs text-muted-foreground">{metric.details}</p>
        )}
      </CardContent>
    </Card>
  )
}

function SupplierScorecardDetail({
  supplierName,
  supplierCode,
  overallScore,
  grade,
  metrics,
  events,
  documents,
  contactInfo,
  contractInfo,
  onExport,
  onPrint,
  className,
}: SupplierScorecardDetailProps) {
  const gColor = gradeColors[grade] ?? gradeColors.C

  const documentStatusColors: Record<string, string> = {
    valid: "bg-green-100 text-green-700",
    expired: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  }

  const eventImpactColors: Record<string, string> = {
    positive: "bg-green-100 text-green-700",
    negative: "bg-red-100 text-red-700",
    neutral: "bg-gray-100 text-gray-700",
  }

  const eventIcons: Record<string, React.ReactNode> = {
    delivery: <PackageIcon className="size-3" />,
    quality: <CheckCircleIcon className="size-3" />,
    payment: <DollarSignIcon className="size-3" />,
    communication: <FileTextIcon className="size-3" />,
    issue: <AlertTriangleIcon className="size-3" />,
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{supplierName}</CardTitle>
            <p className="text-sm text-muted-foreground">{supplierCode}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{overallScore.toFixed(1)}</span>
                <Badge className={cn("text-lg px-3 py-1", gColor.color, gColor.bgColor)}>
                  {grade}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onPrint && (
                <Button variant="outline" size="sm" onClick={onPrint}>
                  <PrinterIcon className="mr-1 size-3" />
                  Print
                </Button>
              )}
              {onExport && (
                <>
                  <Button variant="outline" size="sm" onClick={() => onExport("pdf")}>
                    <DownloadIcon className="mr-1 size-3" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onExport("xlsx")}>
                    <DownloadIcon className="mr-1 size-3" />
                    Excel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="metrics">Score Metrics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((metric) => (
                <ScoreCard key={metric.id} metric={metric} />
              ))}
            </div>

            <div className="mt-6 rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Weight</TableHead>
                    <TableHead className="text-center">Weighted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-medium">{metric.name}</TableCell>
                      <TableCell className="text-center">
                        {metric.score}/{metric.maxScore}
                      </TableCell>
                      <TableCell className="text-center">
                        {(metric.weight * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {(metric.score * metric.weight).toFixed(1)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-[10px] capitalize",
                            metric.status === "excellent" && "bg-green-100 text-green-700",
                            metric.status === "good" && "bg-blue-100 text-blue-700",
                            metric.status === "average" && "bg-yellow-100 text-yellow-700",
                            metric.status === "poor" && "bg-red-100 text-red-700"
                          )}
                        >
                          {metric.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {metric.trend === "up" && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUpIcon className="size-3" /> Improving
                          </span>
                        )}
                        {metric.trend === "down" && (
                          <span className="flex items-center gap-1 text-xs text-red-600">
                            <TrendingDownIcon className="size-3" /> Declining
                          </span>
                        )}
                        {metric.trend === "stable" && (
                          <span className="text-xs text-muted-foreground">Stable</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No events recorded
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="text-sm">{event.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {eventIcons[event.type]}
                            <span className="capitalize text-sm">{event.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{event.description}</TableCell>
                        <TableCell>
                          <Badge className={cn("text-[10px] capitalize", eventImpactColors[event.impact])}>
                            {event.impact}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {event.score !== undefined ? event.score.toFixed(1) : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No documents uploaded
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell className="text-sm">{doc.type}</TableCell>
                        <TableCell className="text-sm">{doc.uploadDate}</TableCell>
                        <TableCell className="text-sm">{doc.expiryDate ?? "-"}</TableCell>
                        <TableCell>
                          <Badge className={cn("text-[10px] capitalize", documentStatusColors[doc.status])}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Contact Information</h4>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact Person</span>
                      <span>{contactInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{contactInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span>{contactInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address</span>
                      <span className="text-right">{contactInfo.address}</span>
                    </div>
                  </div>
                </div>
              )}

              {contractInfo && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Contract Information</h4>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date</span>
                      <span>{contractInfo.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Date</span>
                      <span>{contractInfo.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contract Value</span>
                      <span className="font-medium">${contractInfo.value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Terms</span>
                      <span>{contractInfo.paymentTerms}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export {
  SupplierScorecardDetail,
  ScoreCard,
  gradeColors,
  statusIcons,
  type ScorecardMetric,
  type SupplierEvent,
  type SupplierDocument,
  type SupplierScorecardDetailProps,
}
