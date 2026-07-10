"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckIcon,
  XIcon,
  ClockIcon,
  MessageSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react"

type ApprovalStatus = "pending" | "approved" | "rejected" | "skipped"

interface ApprovalStep {
  id: string
  name: string
  assignee: {
    name: string
    avatar?: string
    email?: string
  }
  status: ApprovalStatus
  date?: string
  comment?: string
  requiredApprovals?: number
  currentApprovals?: number
}

interface WorkflowApprovalsProps {
  steps: ApprovalStep[]
  onApprove?: (stepId: string, comment?: string) => void
  onReject?: (stepId: string, comment?: string) => void
  onComment?: (stepId: string, comment: string) => void
  className?: string
  readOnly?: boolean
  title?: string
}

const statusConfig: Record<ApprovalStatus, { label: string; color: string; bgColor: string }> = {
  pending: {
    label: "Pending",
    color: "text-yellow-700 dark:text-yellow-200",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
  },
  approved: {
    label: "Approved",
    color: "text-green-700 dark:text-green-200",
    bgColor: "bg-green-100 dark:bg-green-900/50",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-700 dark:text-red-200",
    bgColor: "bg-red-100 dark:bg-red-900/50",
  },
  skipped: {
    label: "Skipped",
    color: "text-gray-700 dark:text-gray-200",
    bgColor: "bg-gray-100 dark:bg-gray-800",
  },
}

function WorkflowApprovals({
  steps,
  onApprove,
  onReject,
  onComment,
  className,
  readOnly = false,
  title = "Approval Workflow",
}: WorkflowApprovalsProps) {
  const [expandedStep, setExpandedStep] = React.useState<string | null>(null)
  const [comments, setComments] = React.useState<Record<string, string>>({})

  const handleToggleExpand = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  const handleApprove = (stepId: string) => {
    onApprove?.(stepId, comments[stepId])
    setComments((prev) => ({ ...prev, [stepId]: "" }))
  }

  const handleReject = (stepId: string) => {
    onReject?.(stepId, comments[stepId])
    setComments((prev) => ({ ...prev, [stepId]: "" }))
  }

  const currentStepIndex = steps.findIndex((s) => s.status === "pending")

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {steps.map((step, idx) => {
            const config = statusConfig[step.status]
            const isExpanded = expandedStep === step.id
            const isCurrent = idx === currentStepIndex

            return (
              <div key={step.id} className="relative pb-6 last:pb-0">
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-5 top-10 h-full w-0.5",
                      step.status === "approved" ? "bg-green-500" : "bg-border"
                    )}
                  />
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2",
                      step.status === "approved"
                        ? "border-green-500 bg-green-500 text-white"
                        : step.status === "rejected"
                          ? "border-red-500 bg-red-500 text-white"
                          : isCurrent
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {step.status === "approved" ? (
                      <CheckIcon className="size-5" />
                    ) : step.status === "rejected" ? (
                      <XIcon className="size-5" />
                    ) : (
                      <span className="text-sm font-medium">{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-foreground">{step.name}</h4>
                        <Badge className={cn("text-[10px]", config.color, config.bgColor)}>
                          {config.label}
                        </Badge>
                        {step.requiredApprovals && step.requiredApprovals > 1 && (
                          <Badge variant="outline" className="text-[10px]">
                            {step.currentApprovals ?? 0}/{step.requiredApprovals}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {step.date && (
                          <span className="text-xs text-muted-foreground">
                            {step.date}
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleToggleExpand(step.id)}
                        >
                          {isExpanded ? (
                            <ChevronUpIcon className="size-4" />
                          ) : (
                            <ChevronDownIcon className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <Avatar className="size-5">
                        <AvatarImage src={step.assignee.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {step.assignee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {step.assignee.name}
                      </span>
                      {step.comment && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquareIcon className="size-3" />
                          <span className="truncate max-w-[200px]">{step.comment}</span>
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 space-y-3">
                        {step.comment && (
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm text-foreground">{step.comment}</p>
                          </div>
                        )}

                        {!readOnly && step.status === "pending" && isCurrent && (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Add a comment (optional)..."
                              value={comments[step.id] ?? ""}
                              onChange={(e) =>
                                setComments((prev) => ({ ...prev, [step.id]: e.target.value }))
                              }
                              className="min-h-[80px] text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(step.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckIcon className="mr-1 size-3" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(step.id)}
                              >
                                <XIcon className="mr-1 size-3" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export { WorkflowApprovals, type ApprovalStep, type ApprovalStatus, type WorkflowApprovalsProps }
