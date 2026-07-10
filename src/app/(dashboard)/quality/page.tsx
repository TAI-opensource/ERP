import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, FileText, TrendingUp } from "lucide-react"

const stats = [
  { label: "Quality Inspections", value: "89" },
  { label: "Pass Rate", value: "96.5%" },
  { label: "Open Issues", value: "3" },
  { label: "Corrective Actions", value: "5" },
]

const recentInspections = [
  { id: "QC-2024-001", item: "Widget Alpha", batch: "BATCH-001", result: "Pass", inspector: "Alice Johnson", date: "2024-01-15" },
  { id: "QC-2024-002", item: "Component X1", batch: "BATCH-002", result: "Pass", inspector: "Bob Williams", date: "2024-01-14" },
  { id: "QC-2024-003", item: "Motor Assembly", batch: "BATCH-003", result: "Fail", inspector: "Alice Johnson", date: "2024-01-13" },
  { id: "QC-2024-004", item: "Bracket Assembly", batch: "BATCH-004", result: "Pass", inspector: "Carol Davis", date: "2024-01-12" },
]

const qualityIssues = [
  { issue: "Motor Assembly vibration test failed", severity: "High", assignedTo: "Engineering", dueDate: "2024-01-18" },
  { issue: "Widget Alpha surface finish below spec", severity: "Medium", assignedTo: "Production", dueDate: "2024-01-20" },
  { issue: "Component X1 dimensional tolerance", severity: "Low", assignedTo: "Quality", dueDate: "2024-01-22" },
]

export default function QualityPage() {
  return (
    <OverviewLayout
      title="Quality Management"
      description="Track inspections, issues, and quality metrics"
      actionLabel="New Inspection"
      actionHref="/quality/inspections/new"
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInspections.map((i) => (
                <div key={i.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{i.id} - {i.item}</p>
                    <p className="text-xs text-muted-foreground">Batch: {i.batch} • Inspector: {i.inspector}</p>
                  </div>
                  <span className={`text-xs font-medium ${i.result === "Pass" ? "text-emerald-500" : "text-red-500"}`}>{i.result}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-yellow-500" />
              Open Quality Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {qualityIssues.map((q, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{q.issue}</p>
                    <p className="text-xs text-muted-foreground">{q.assignedTo} • Due: {q.dueDate}</p>
                  </div>
                  <span className={`text-xs font-medium ${q.severity === "High" ? "text-red-500" : q.severity === "Medium" ? "text-yellow-500" : "text-muted-foreground"}`}>{q.severity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
