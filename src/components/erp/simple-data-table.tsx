"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface SimpleDataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  className?: string
}

function SimpleDataTableInner<T extends Record<string, unknown>>(
  { columns, data, onRowClick, className }: SimpleDataTableProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div ref={ref} className={cn("relative w-full overflow-x-auto rounded-lg border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow
              key={idx}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? "cursor-pointer" : ""}
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render ? col.render(item) : String(item[col.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const SimpleDataTable = React.forwardRef(SimpleDataTableInner) as <T extends Record<string, unknown>>(
  props: SimpleDataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactNode

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase()
  const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    draft: "secondary",
    pending: "outline",
    cancelled: "destructive",
    completed: "default",
    paid: "default",
    overdue: "destructive",
    shipped: "default",
    delivered: "default",
    open: "default",
    closed: "secondary",
    posted: "default",
    confirmed: "default",
    received: "default",
    approved: "default",
    "in progress": "default",
    planned: "secondary",
    fail: "destructive",
    pass: "default",
    inactive: "secondary",
    "on leave": "outline",
    scheduled: "secondary",
  }

  return (
    <Badge variant={variantMap[lower] ?? "outline"}>
      {status}
    </Badge>
  )
}

export { SimpleDataTable, StatusBadge }
export type { Column as SimpleColumn }
