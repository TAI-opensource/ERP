"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const paymentEntries = [
  { id: "PAY-2024-001", date: "2024-01-15", party: "Acme Corp", partyType: "Customer", type: "Receive", amount: "$12,500", reference: "INV-2024-001", mode: "Bank Transfer", status: "Submitted" },
  { id: "PAY-2024-002", date: "2024-01-14", party: "Supplier Alpha", partyType: "Supplier", type: "Pay", amount: "$8,200", reference: "PO-2024-001", mode: "Check", status: "Submitted" },
  { id: "PAY-2024-003", date: "2024-01-13", party: "TechStart Inc", partyType: "Customer", type: "Receive", amount: "$5,750", reference: "INV-2024-003", mode: "Credit Card", status: "Draft" },
  { id: "PAY-2024-004", date: "2024-01-12", party: "Parts Unlimited", partyType: "Supplier", type: "Pay", amount: "$15,500", reference: "PO-2024-002", mode: "Bank Transfer", status: "Submitted" },
  { id: "PAY-2024-005", date: "2024-01-11", party: "Global Industries", partyType: "Customer", type: "Receive", amount: "$23,000", reference: "INV-2024-005", mode: "Bank Transfer", status: "Submitted" },
  { id: "PAY-2024-006", date: "2024-01-10", party: "Component Co", partyType: "Supplier", type: "Pay", amount: "$4,800", reference: "PO-2024-003", mode: "Check", status: "Cancelled" },
]

const columns = [
  { key: "id", label: "Payment #" },
  { key: "date", label: "Date" },
  { key: "party", label: "Party" },
  { key: "partyType", label: "Type" },
  { key: "amount", label: "Amount", className: "text-right" },
  { key: "mode", label: "Mode" },
  { key: "reference", label: "Reference" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

export default function PaymentEntriesPage() {
  return (
    <OverviewLayout
      title="Payment Entries"
      description="Record and track payments received and made"
      actionLabel="New Payment"
      actionHref="/accounting/payment-entries/new"
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={paymentEntries} />
      </div>
    </OverviewLayout>
  )
}
