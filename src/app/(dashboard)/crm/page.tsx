import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, TrendingUp, Phone } from "lucide-react"

const stats = [
  { label: "Total Leads", value: "23" },
  { label: "Open Deals", value: "5" },
  { label: "Conversion Rate", value: "34%" },
  { label: "Pipeline Value", value: "$245,000" },
]

const pipeline = [
  { stage: "Prospecting", count: 8, value: "$67,000" },
  { stage: "Qualification", count: 5, value: "$45,000" },
  { stage: "Proposal", count: 4, value: "$78,000" },
  { stage: "Negotiation", count: 3, value: "$35,000" },
  { stage: "Closed Won", count: 3, value: "$20,000" },
]

const recentLeads = [
  { name: "Tech Solutions Inc", source: "Website", value: "$25,000", stage: "Qualification" },
  { name: "Global Corp", source: "Referral", value: "$45,000", stage: "Proposal" },
  { name: "StartUp Labs", source: "Cold Call", value: "$12,000", stage: "Prospecting" },
  { name: "Enterprise Co", source: "LinkedIn", value: "$89,000", stage: "Negotiation" },
]

export default function CRMPage() {
  return (
    <OverviewLayout
      title="CRM"
      description="Manage leads, opportunities, and customer relationships"
      actionLabel="New Lead"
      actionHref="/crm/leads/new"
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipeline.map((p) => (
                <div key={p.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{p.stage}</span>
                    <span className="text-sm text-muted-foreground">{p.count} deals • {p.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${(p.count / 10) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeads.map((l) => (
                <div key={l.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{l.name}</p>
                    <p className="text-xs text-muted-foreground">Source: {l.source}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{l.value}</p>
                    <p className="text-xs text-muted-foreground">{l.stage}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
