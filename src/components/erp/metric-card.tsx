import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ title, value, change, changeLabel = "vs last month", icon, className }: MetricCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {change >= 0 ? (
              <TrendingUp className="size-3 text-emerald-500" />
            ) : (
              <TrendingDown className="size-3 text-red-500" />
            )}
            <span className={change >= 0 ? "text-emerald-500" : "text-red-500"}>
              {change >= 0 ? "+" : ""}{change}%
            </span>
            <span className="text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
