"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const leads = [
  { id: "LEAD-001", name: "Tech Solutions Inc", contact: "Alex Chen", email: "alex@techsolutions.com", phone: "+1 555-0301", source: "Website", value: "$25,000", status: "Open" },
  { id: "LEAD-002", name: "Global Corp", contact: "Maria Santos", email: "maria@globalcorp.com", phone: "+1 555-0302", source: "Referral", value: "$45,000", status: "Open" },
  { id: "LEAD-003", name: "StartUp Labs", contact: "Tom Anderson", email: "tom@startuplabs.com", phone: "+1 555-0303", source: "Cold Call", value: "$12,000", status: "Open" },
  { id: "LEAD-004", name: "Enterprise Co", contact: "Sarah Kim", email: "sarah@enterprise.com", phone: "+1 555-0304", source: "LinkedIn", value: "$89,000", status: "Open" },
  { id: "LEAD-005", name: "Digital Agency", contact: "James Park", email: "james@digitalagency.com", phone: "+1 555-0305", source: "Website", value: "$18,000", status: "Closed" },
  { id: "LEAD-006", name: "Manufacturing Co", contact: "Linda Brown", email: "linda@mfgco.com", phone: "+1 555-0306", source: "Trade Show", value: "$56,000", status: "Open" },
]

const columns = [
  { key: "id", label: "Lead ID" },
  { key: "name", label: "Company" },
  { key: "contact", label: "Contact" },
  { key: "source", label: "Source" },
  { key: "value", label: "Deal Value", className: "text-right" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function LeadsPage() {
  return (
    <OverviewLayout
      title="Leads"
      description="Track and manage sales leads"
      actionLabel="New Lead"
      actionHref="/crm/leads/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={leads} />
      </div>
    </OverviewLayout>
  )
}
