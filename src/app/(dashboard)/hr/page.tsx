import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, DollarSign } from "lucide-react"

const stats = [
  { label: "Total Employees", value: "47" },
  { label: "Active Departments", value: "6" },
  { label: "Pending Leave", value: "2" },
  { label: "Monthly Payroll", value: "$186,000" },
]

const departmentSummary = [
  { name: "Engineering", headcount: 15, budget: "$89,000" },
  { name: "Sales", headcount: 10, budget: "$45,000" },
  { name: "Marketing", headcount: 6, budget: "$28,000" },
  { name: "Operations", headcount: 8, budget: "$35,000" },
  { name: "HR", headcount: 4, budget: "$18,000" },
  { name: "Finance", headcount: 4, budget: "$19,000" },
]

const recentActivity = [
  { employee: "Alice Johnson", action: "Checked in at 09:00 AM", time: "Today" },
  { employee: "Bob Williams", action: "Leave request approved", time: "Yesterday" },
  { employee: "Carol Davis", action: "New employee onboarded", time: "2 days ago" },
  { employee: "David Brown", action: "Performance review completed", time: "3 days ago" },
]

export default function HRPage() {
  return (
    <OverviewLayout
      title="Human Resources"
      description="Manage employees, attendance, and payroll"
      actionLabel="Add Employee"
      actionHref="/hr/employees/new"
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentSummary.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.headcount} employees</p>
                  </div>
                  <p className="text-sm font-medium">{d.budget}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent HR Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {a.employee.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.employee}</p>
                    <p className="text-xs text-muted-foreground">{a.action}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </OverviewLayout>
  )
}
