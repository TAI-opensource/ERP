"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const opportunities = [
  { id: "OPP-001", name: "Enterprise ERP Implementation", customer: "Global Corp", value: "$45,000", stage: "Proposal", closeDate: "2024-02-15", owner: "Bob Williams", status: "Open" },
  { id: "OPP-002", name: "Software License Renewal", customer: "Tech Solutions Inc", value: "$25,000", stage: "Negotiation", closeDate: "2024-01-31", owner: "Bob Williams", status: "Open" },
  { id: "OPP-003", name: "Consulting Services", customer: "StartUp Labs", value: "$12,000", stage: "Qualification", closeDate: "2024-03-01", owner: "Carol Davis", status: "Open" },
  { id: "OPP-004", name: "Hardware Upgrade Project", customer: "Enterprise Co", value: "$89,000", stage: "Negotiation", closeDate: "2024-02-28", owner: "Bob Williams", status: "Open" },
  { id: "OPP-005", name: "Training Program", customer: "Manufacturing Co", value: "$18,000", stage: "Prospecting", closeDate: "2024-04-01", owner: "Carol Davis", status: "Open" },
  { id: "OPP-006", name: "Annual Maintenance Contract", customer: "Digital Agency", value: "$8,500", stage: "Closed Won", closeDate: "2024-01-10", owner: "Bob Williams", status: "Closed" },
]

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Opportunity" },
  { key: "customer", label: "Customer" },
  { key: "value", label: "Value", className: "text-right" },
  { key: "stage", label: "Stage" },
  { key: "closeDate", label: "Expected Close" },
  { key: "owner", label: "Owner" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function OpportunitiesPage() {
  return (
    <OverviewLayout
      title="Opportunities"
      description="Track sales opportunities through the pipeline"
      actionLabel="New Opportunity"
      actionHref="/crm/opportunities/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={opportunities} />
      </div>
    </OverviewLayout>
  )
}
