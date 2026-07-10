"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"

const taxTemplates = [
  { id: "TAX-001", name: "ICMS Standard", tax: "ICMS", rate: "18%", type: "State", account: "2300 - ICMS Payable", status: "Active" },
  { id: "TAX-002", name: "IPI Standard", tax: "IPI", rate: "10%", type: "Federal", account: "2310 - IPI Payable", status: "Active" },
  { id: "TAX-003", name: "PIS Standard", tax: "PIS", rate: "1.65%", type: "Federal", account: "2320 - PIS Payable", status: "Active" },
  { id: "TAX-004", name: "COFINS Standard", tax: "COFINS", rate: "7.6%", type: "Federal", account: "2330 - COFINS Payable", status: "Active" },
  { id: "TAX-005", name: "ISS Standard", tax: "ISS", rate: "5%", type: "Municipal", account: "2340 - ISS Payable", status: "Active" },
  { id: "TAX-006", name: "IRPJ Standard", tax: "IRPJ", rate: "15%", type: "Federal", account: "2350 - IRPJ Payable", status: "Active" },
  { id: "TAX-007", name: "CSLL Standard", tax: "CSLL", rate: "9%", type: "Federal", account: "2360 - CSLL Payable", status: "Active" },
]

const columns = [
  { key: "id", label: "Template #" },
  { key: "name", label: "Template Name" },
  { key: "tax", label: "Tax" },
  { key: "rate", label: "Rate" },
  { key: "type", label: "Type" },
  { key: "account", label: "Account" },
  { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} /> },
]

const summaryStats = [
  { label: "Total Templates", value: "7" },
  { label: "Active Templates", value: "7" },
  { label: "State Taxes", value: "1" },
  { label: "Federal Taxes", value: "5" },
]

export default function TaxTemplatesPage() {
  return (
    <OverviewLayout
      title="Tax Templates"
      description="Manage tax templates and configurations"
      actionLabel="New Template"
      actionHref="/accounting/tax-templates/new"
      stats={summaryStats}
    >
      <div className="rounded-lg border">
        <SimpleDataTable columns={columns} data={taxTemplates} />
      </div>
    </OverviewLayout>
  )
}
