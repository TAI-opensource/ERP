"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SimpleDataTable, StatusBadge } from "@/components/erp/simple-data-table"
import Link from "next/link"

const entryDetails = {
  id: "JE-0045",
  date: "2024-01-15",
  postingDate: "2024-01-15",
  reference: "INV-2024-001",
  remarks: "Sales revenue from Acme Corp",
  status: "Posted",
  user: "John Doe",
}

const journalLines = [
  { account: "1000 - Cash and Cash Equivalents", debit: "$5,000.00", credit: "-", description: "Cash received" },
  { account: "4000 - Sales Revenue", debit: "-", credit: "$5,000.00", description: "Revenue recognized" },
]

const columns = [
  { key: "account", label: "Account" },
  { key: "debit", label: "Debit", className: "text-right" },
  { key: "credit", label: "Credit", className: "text-right" },
  { key: "description", label: "Description" },
]

export default function JournalEntryDetailPage() {
  return (
    <OverviewLayout
      title={`Journal Entry ${entryDetails.id}`}
      description="View journal entry details"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Entry Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{entryDetails.date}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Debit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$5,000.00</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$5,000.00</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={entryDetails.status} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entry Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Entry Number</p>
                <p className="font-medium">{entryDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posting Date</p>
                <p className="font-medium">{entryDetails.postingDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-medium">{entryDetails.reference}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium">{entryDetails.user}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Remarks</p>
                <p className="font-medium">{entryDetails.remarks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Journal Lines</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDataTable columns={columns} data={journalLines} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" render={<Link href="/accounting/journal-entries" />}>
            Back to Journal Entries
          </Button>
          {entryDetails.status === "Draft" && (
            <Button>Post Entry</Button>
          )}
        </div>
      </div>
    </OverviewLayout>
  )
}
