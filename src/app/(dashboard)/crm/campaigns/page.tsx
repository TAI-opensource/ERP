"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const campaigns = [
  { id: "CMP-001", name: "New Year Promotion 2024", type: "Email", startDate: "2024-01-01", endDate: "2024-01-31", budget: "$5,000", spent: "$3,200", leads: 45, conversions: 12, status: "Active" },
  { id: "CMP-002", name: "Product Launch Webinar", type: "Webinar", startDate: "2024-01-15", endDate: "2024-01-15", budget: "$2,000", spent: "$1,800", leads: 78, conversions: 23, status: "Completed" },
  { id: "CMP-003", name: "LinkedIn Awareness Campaign", type: "Social Media", startDate: "2024-01-10", endDate: "2024-02-10", budget: "$8,000", spent: "$4,500", leads: 120, conversions: 18, status: "Active" },
  { id: "CMP-004", name: "Trade Show 2024", type: "Event", startDate: "2024-02-20", endDate: "2024-02-22", budget: "$15,000", spent: "$0", leads: 0, conversions: 0, status: "Planned" },
  { id: "CMP-005", name: "Referral Program", type: "Referral", startDate: "2024-01-01", endDate: "2024-12-31", budget: "$20,000", spent: "$2,800", leads: 34, conversions: 15, status: "Active" },
]

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Campaign" },
  { key: "type", label: "Type" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "budget", label: "Budget", className: "text-right" },
  { key: "spent", label: "Spent", className: "text-right" },
  { key: "leads", label: "Leads", className: "text-right" },
  { key: "conversions", label: "Conversions", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function CampaignsPage() {
  return (
    <OverviewLayout
      title="Campaigns"
      description="Manage marketing campaigns and track performance"
      actionLabel="New Campaign"
      actionHref="/crm/campaigns/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={campaigns} />
      </div>
    </OverviewLayout>
  )
}
