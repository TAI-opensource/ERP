import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, CheckCircle, Clock, Users } from "lucide-react"

const stats = [
  { label: "Active Projects", value: "8" },
  { label: "Completed", value: "15" },
  { label: "Total Tasks", value: "124" },
  { label: "Team Members", value: "23" },
]

const projects = [
  { name: "ERP Implementation", progress: 65, dueDate: "2024-03-01", team: 5, tasks: 32, status: "In Progress" },
  { name: "Website Redesign", progress: 40, dueDate: "2024-02-15", team: 3, tasks: 18, status: "In Progress" },
  { name: "Mobile App v2", progress: 20, dueDate: "2024-04-01", team: 4, tasks: 25, status: "In Progress" },
  { name: "Data Migration", progress: 90, dueDate: "2024-01-20", team: 2, tasks: 12, status: "In Progress" },
  { name: "Security Audit", progress: 100, dueDate: "2024-01-10", team: 2, tasks: 8, status: "Completed" },
]

const upcomingTasks = [
  { project: "ERP Implementation", task: "Configure accounting module", dueDate: "2024-01-18", priority: "High" },
  { project: "Website Redesign", task: "Finalize homepage design", dueDate: "2024-01-19", priority: "Medium" },
  { project: "Mobile App v2", task: "API integration testing", dueDate: "2024-01-22", priority: "High" },
  { project: "Data Migration", task: "Validate data integrity", dueDate: "2024-01-17", priority: "High" },
]

export default function ProjectsPage() {
  return (
    <OverviewLayout
      title="Projects"
      description="Track projects, tasks, and team assignments"
      actionLabel="New Project"
      actionHref="/projects/new"
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Due: {p.dueDate} • {p.team} members • {p.tasks} tasks</p>
                    </div>
                    <span className={`text-xs ${p.status === "Completed" ? "text-emerald-500" : "text-blue-500"}`}>{p.status}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((t, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{t.task}</p>
                    <p className="text-xs text-muted-foreground">{t.project}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{t.dueDate}</p>
                    <p className={`text-xs ${t.priority === "High" ? "text-red-500" : t.priority === "Medium" ? "text-yellow-500" : "text-muted-foreground"}`}>{t.priority}</p>
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
