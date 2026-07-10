import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface OverviewLayoutProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  children: React.ReactNode
  stats?: { label: string; value: string }[]
}

export function OverviewLayout({ title, description, actionLabel, actionHref, children, stats }: OverviewLayoutProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {actionLabel && actionHref && (
          <Button render={<Link href={actionHref} />}>
            <Plus className="size-4" />
            {actionLabel}
          </Button>
        )}
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {children}
    </div>
  )
}
