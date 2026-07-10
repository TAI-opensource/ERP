"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const project = {
  id: "PRJ-001",
  name: "ERP Implementation",
  description: "Full ERP system implementation for the organization",
  startDate: "2024-01-01",
  endDate: "2024-03-01",
  progress: 65,
  budget: "$150,000",
  spent: "$97,500",
  team: 5,
  tasks: 32,
  completedTasks: 21,
  status: "In Progress",
}

const teamMembers = [
  { name: "David Brown", role: "Project Lead", hours: 120 },
  { name: "Alice Johnson", role: "Developer", hours: 95 },
  { name: "Bob Williams", role: "Business Analyst", hours: 80 },
  { name: "Carol Davis", role: "Designer", hours: 60 },
  { name: "Eva Martinez", role: "QA Lead", hours: 45 },
]

const recentTasks = [
  { task: "Configure accounting module", assignee: "Alice Johnson", dueDate: "2024-01-18", priority: "High", status: "In Progress" },
  { task: "Data migration planning", assignee: "Bob Williams", dueDate: "2024-01-17", priority: "High", status: "Completed" },
  { task: "UI design for dashboard", assignee: "Carol Davis", dueDate: "2024-01-20", priority: "Medium", status: "In Progress" },
  { task: "Test stock management", assignee: "Eva Martinez", dueDate: "2024-01-22", priority: "Medium", status: "Pending" },
]

export default function ProjectDetailPage() {
  return (
    <OverviewLayout
      title={project.name}
      description={`${project.id} • ${project.description}`}
      actionLabel="Edit Project"
      actionHref={`/projects/${project.id}/edit`}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.progress}%</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${project.progress}%` }} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.budget}</div>
              <p className="text-xs text-muted-foreground">Spent: {project.spent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.completedTasks}/{project.tasks}</div>
              <p className="text-xs text-muted-foreground">completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{project.startDate}</div>
              <p className="text-xs text-muted-foreground">to {project.endDate}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {recentTasks.map((t, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{t.task}</p>
                        <p className="text-xs text-muted-foreground">{t.assignee} • Due: {t.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={t.status === "Completed" ? "default" : t.status === "In Progress" ? "secondary" : "outline"}>
                          {t.status}
                        </Badge>
                        <p className={`text-xs mt-1 ${t.priority === "High" ? "text-red-500" : "text-muted-foreground"}`}>
                          {t.priority}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="team">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {teamMembers.map((m, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {m.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{m.hours} hours</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </OverviewLayout>
  )
}
