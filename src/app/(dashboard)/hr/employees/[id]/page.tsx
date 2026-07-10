"use client"

import { OverviewLayout } from "@/components/erp/overview-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const employee = {
  id: "EMP-001",
  name: "Alice Johnson",
  email: "alice@company.com",
  phone: "+1 555-0101",
  department: "Engineering",
  designation: "Senior Developer",
  joinDate: "2021-03-15",
  dateOfBirth: "1990-05-20",
  gender: "Female",
  address: "456 Tech Street, San Francisco, CA",
  salary: "$95,000",
  manager: "David Brown",
  status: "Active",
}

const attendance = [
  { date: "2024-01-15", checkIn: "09:00", checkOut: "18:15", hours: "9.25", status: "Present" },
  { date: "2024-01-14", checkIn: "08:45", checkOut: "17:30", hours: "8.75", status: "Present" },
  { date: "2024-01-13", checkIn: "-", checkOut: "-", hours: "-", status: "Weekend" },
  { date: "2024-01-12", checkIn: "09:15", checkOut: "18:00", hours: "8.75", status: "Present" },
  { date: "2024-01-11", checkIn: "09:00", checkOut: "14:00", hours: "5.00", status: "Half Day" },
]

const leaveHistory = [
  { type: "Annual Leave", from: "2024-01-20", to: "2024-01-22", days: 3, status: "Approved" },
  { type: "Sick Leave", from: "2024-01-05", to: "2024-01-05", days: 1, status: "Approved" },
  { type: "Annual Leave", from: "2023-12-25", to: "2023-12-29", days: 5, status: "Approved" },
]

export default function EmployeeDetailPage() {
  return (
    <OverviewLayout
      title={employee.name}
      description={`${employee.id} • ${employee.department}`}
      actionLabel="Edit Employee"
      actionHref={`/hr/employees/${employee.id}/edit`}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{employee.department}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Designation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{employee.designation}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Join Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{employee.joinDate}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{employee.salary}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-medium">Personal Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date of Birth</span>
                    <span>{employee.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender</span>
                    <span>{employee.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="text-right">{employee.address}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Employment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manager</span>
                    <span>{employee.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge>{employee.status}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="attendance">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave History</TabsTrigger>
          </TabsList>
          <TabsContent value="attendance">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {attendance.map((a, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{a.date}</p>
                        <p className="text-xs text-muted-foreground">Check-in: {a.checkIn} • Check-out: {a.checkOut}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{a.hours} hours</p>
                        <Badge variant={a.status === "Present" ? "default" : a.status === "Half Day" ? "secondary" : "outline"}>
                          {a.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="leave">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {leaveHistory.map((l, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{l.type}</p>
                        <p className="text-xs text-muted-foreground">{l.from} to {l.to} • {l.days} days</p>
                      </div>
                      <Badge variant={l.status === "Approved" ? "default" : "secondary"}>
                        {l.status}
                      </Badge>
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
